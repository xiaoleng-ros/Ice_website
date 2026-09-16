const express = require('express');
const compression = require('compression');
const path = require('path');
const http = require('http');
const https = require('https');

const app = express();
const port = process.env.PORT || 3100;

// 安全头（必须在所有路由前）
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
    next();
});

// 自定义 MIME（补全音频格式 + lrc 歌词）
express.static.mime.define({
    'image/webp': ['webp'],
    'image/avif': ['avif'],
    'font/woff2': ['woff2'],
    'audio/mp4': ['m4a', 'mp4'],
    'audio/flac': ['flac'],
    'audio/wav': ['wav'],
    'audio/ogg': ['ogg', 'oga'],
    'audio/opus': ['opus'],
    'audio/aac': ['aac'],
    'text/plain; charset=utf-8': ['lrc']
});

// 性能：gzip 压缩（必须在 express.static 之前，让 send-stream 也走压缩）
app.use(compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// 静态资源：只暴露项目根（index.html + static/）
app.use(express.static(__dirname, {
    dotfiles: 'deny',
    index: 'index.html',
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
        if (/\.(jpg|jpeg|png|gif|webp|avif|ico|svg)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000');
            } else if (/\.(css|js)$/i.test(filePath)) {
                // 开发期：关闭强缓存，每次刷新都向服务器校验（etag 命中返回 304，改了返回 200）
                res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
            }
    }
}));

// 本地曲库（/api/music 接口 + static/music/ 目录）已于 2026-09-16 移除：
// 播放器统一走网易云歌单（/api/netease/*），不再保留本地 mp3 / lrc 回退。

// ============================================================
// 网易云音乐（经 Meting 代理）
// 配置优先级：请求参数 > 环境变量 > 代码默认值
// 见《前台网易云音乐播放器-通用方案.md》第 4 节
// ============================================================
const METING_API = process.env.MUSIC_API_BASE || 'https://meting.mikus.ink/api';
const DEFAULT_PLAYLIST_ID = process.env.NETEASE_PLAYLIST_ID || '18387867575';
// url 模式：stream = 服务端转发（默认，规避 CORS/Referer）；redirect = 302 直跳（省带宽）
const URL_MODE = (process.env.MUSIC_URL_MODE || 'stream').toLowerCase();
const UPSTREAM_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const PLAYLIST_TTL = 10 * 60 * 1000;  // 歌单元数据缓存 10 分钟
const TRACK_URL_TTL = 20 * 60 * 1000; // 音频直链缓存 20 分钟（直链带 token，会过期）
const LRC_TTL = 60 * 60 * 1000;       // 歌词缓存 1 小时

const playlistCache = new Map();   // playlistId -> { time, payload }
const trackUrlCache = new Map();   // songId     -> { time, url }
const lrcCache = new Map();        // songId     -> { time, text }

// 统一超时：代理挂了不把请求吊死
function fetchWithTimeout(url, options = {}, ms = 10000) {
    return fetch(url, { ...options, signal: AbortSignal.timeout(ms) });
}

function metingUrl(type, id) {
    const u = new URL(METING_API);
    u.searchParams.set('server', 'netease');
    u.searchParams.set('type', type);
    u.searchParams.set('id', id);
    return u;
}

// 不同 Meting 实现字段不统一：有的给 id，有的只给完整的 url/lrc 地址
function extractSongId(item, fallbackIndex, playlistId) {
    const direct = item.id ?? item.song_id ?? item.music_id;
    if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
        return String(direct).trim();
    }
    for (const key of ['url', 'lrc']) {
        const raw = item[key];
        if (typeof raw !== 'string') continue;
        const match = /[?&]id=(\d+)/.exec(raw);
        if (match) return match[1];
    }
    return `${playlistId}:${fallbackIndex}`;
}

// 取歌单（带缓存），返回 Meting 原始数组
async function getPlaylistRaw(playlistId) {
    const cached = playlistCache.get(playlistId);
    if (cached && Date.now() - cached.time < PLAYLIST_TTL) {
        return cached.raw;
    }

    const u = new URL(METING_API);
    u.searchParams.set('server', 'netease');
    u.searchParams.set('type', 'playlist');
    u.searchParams.set('id', playlistId);

    const upstream = await fetchWithTimeout(u, {}, 12000);
    if (!upstream.ok) throw new Error(`Meting 返回 ${upstream.status}`);
    const raw = await upstream.json();
    if (!Array.isArray(raw)) throw new Error('Meting 返回格式异常');

    playlistCache.set(playlistId, { time: Date.now(), raw, payload: null });
    return raw;
}

// 按「歌单 ID + 序号」定位曲目，兼容字段缺失的 Meting 实现
async function getTrack(playlistId, index) {
    const raw = await getPlaylistRaw(playlistId);
    const item = raw[index];
    if (!item) return null;
    return { item, id: extractSongId(item, index, playlistId) };
}

// 向 Meting 换取音频直链：
// 优先复用 Meting 给的 url 地址（302 的 Location 即真实 CDN 地址），
// 否则退回 type=url&id=xxx 重新换一次
async function resolveTrackUrl(track) {
    const cached = trackUrlCache.get(track.id);
    if (cached && Date.now() - cached.time < TRACK_URL_TTL) {
        return cached.url;
    }

    const candidates = [];
    if (typeof track.item.url === 'string' && /^https?:\/\//i.test(track.item.url)) {
        candidates.push(track.item.url);
    }
    if (/^\d+$/.test(track.id)) {
        candidates.push(metingUrl('url', track.id).toString());
    }

    for (const candidate of candidates) {
        try {
            const res = await fetchWithTimeout(candidate, { redirect: 'manual' });
            let url = res.headers.get('location');
            if (!url && res.status === 200) {
                const text = (await res.text()).trim();
                if (/^https?:\/\//i.test(text)) url = text;
            }
            if (url) {
                trackUrlCache.set(track.id, { time: Date.now(), url });
                return url;
            }
        } catch (error) {
            console.warn('解析直链失败，尝试下一个候选：', error.message);
        }
    }
    return null;
}

// 服务端转发音频流：透传 Range，保证拖动进度可用
function streamAudio(target, req, res) {
    const u = new URL(target);
    const client = u.protocol === 'http:' ? http : https;
    const headers = {
        'User-Agent': UPSTREAM_UA,
        'Referer': 'https://music.163.com/',
        'Accept': '*/*'
    };
    if (req.headers.range) headers.Range = req.headers.range;

    const upstream = client.request(u, { headers, timeout: 15000 }, (upRes) => {
        const pass = {};
        for (const key of ['content-type', 'content-length', 'content-range', 'etag', 'last-modified']) {
            const value = upRes.headers[key];
            if (value) pass[key] = value;
        }
        // 上游会给音频带上 charset=utf-8，音频类型不需要，去掉避免个别浏览器误判
        if (pass['content-type']) {
            pass['content-type'] = pass['content-type'].replace(/;\s*charset=[^;]*/i, '');
        }
        pass['Accept-Ranges'] = 'bytes';
        pass['Cache-Control'] = 'public, max-age=3600';

        res.writeHead(upRes.statusCode, pass);
        upRes.pipe(res);
        req.on('close', () => upRes.destroy());
    });

    upstream.on('timeout', () => upstream.destroy(new Error('上游超时')));
    upstream.on('error', (err) => {
        console.error('音频上游请求失败：', err.message);
        if (!res.headersSent) {
            res.status(502).json({ success: false, error: '音频源不可用' });
        } else {
            res.destroy();
        }
    });
    upstream.end();
}

// 歌单：GET /api/netease/playlist?id=<歌单ID>
app.get('/api/netease/playlist', async (req, res) => {
    const playlistId = String(req.query.id || DEFAULT_PLAYLIST_ID).trim();
    if (!/^\d+$/.test(playlistId)) {
        return res.status(400).json({ success: false, error: '歌单 ID 不合法', data: [] });
    }

    const cached = playlistCache.get(playlistId);
    if (cached && cached.payload && Date.now() - cached.time < PLAYLIST_TTL) {
        return res.json(cached.payload);
    }

    try {
        const raw = await getPlaylistRaw(playlistId);

        const data = raw
            .map((item, index) => {
                if (!item || (!item.url && !item.id)) return null;
                const ref = `p=${encodeURIComponent(playlistId)}&i=${index}`;
                return {
                    id: extractSongId(item, index, playlistId),
                    title: item.title || '未知曲目',
                    artist: item.author || '未知歌手',
                    cover: item.pic || '/static/img/music.png',
                    src: `/api/netease/url?${ref}`,
                    lyrics: `/api/netease/lrc?${ref}`
                };
            })
            .filter(Boolean);

        const payload = { success: true, source: 'netease', playlistId, data };
        playlistCache.set(playlistId, { time: Date.now(), raw, payload });
        res.json(payload);
    } catch (error) {
        console.error('获取网易云歌单失败：', error.message);
        res.status(502).json({ success: false, error: '网易云接口暂时不可用', data: [] });
    }
});

// 音频：GET /api/netease/url?p=<歌单ID>&i=<序号>
app.get('/api/netease/url', async (req, res) => {
    const playlistId = String(req.query.p || DEFAULT_PLAYLIST_ID).trim();
    const index = Number.parseInt(req.query.i, 10);

    if (!/^\d+$/.test(playlistId) || !Number.isInteger(index) || index < 0) {
        return res.status(400).json({ success: false, error: '参数不合法' });
    }

    try {
        const track = await getTrack(playlistId, index);
        if (!track) {
            return res.status(404).json({ success: false, error: '曲目不存在' });
        }

        let target = await resolveTrackUrl(track);
        if (!target) {
            // 直链可能已过期，清缓存后重试一次
            trackUrlCache.delete(track.id);
            target = await resolveTrackUrl(track);
        }
        if (!target) {
            return res.status(502).json({ success: false, error: '该歌曲暂无可用音源' });
        }

        if (URL_MODE === 'redirect') {
            return res.redirect(302, target);
        }
        streamAudio(target, req, res);
    } catch (error) {
        console.error('解析音频直链失败：', error.message);
        res.status(502).json({ success: false, error: '音频源不可用' });
    }
});

// 歌词：GET /api/netease/lrc?p=<歌单ID>&i=<序号>
app.get('/api/netease/lrc', async (req, res) => {
    const playlistId = String(req.query.p || DEFAULT_PLAYLIST_ID).trim();
    const index = Number.parseInt(req.query.i, 10);

    if (!/^\d+$/.test(playlistId) || !Number.isInteger(index) || index < 0) {
        return res.status(400).json({ success: false, error: '参数不合法' });
    }

    try {
        const track = await getTrack(playlistId, index);
        if (!track) {
            return res.status(404).json({ success: false, error: '曲目不存在' });
        }

        const cacheKey = track.id;
        const cached = lrcCache.get(cacheKey);
        if (cached && Date.now() - cached.time < LRC_TTL) {
            res.type('text/plain; charset=utf-8');
            return res.send(cached.text);
        }

        let lrc = '';
        const sources = [];
        if (typeof track.item.lrc === 'string' && /^https?:\/\//i.test(track.item.lrc)) {
            sources.push(track.item.lrc);
        }
        if (/^\d+$/.test(track.id)) {
            sources.push(metingUrl('lrc', track.id).toString());
        }

        for (const source of sources) {
            try {
                const upstream = await fetchWithTimeout(source, {}, 10000);
                const text = await upstream.text();
                if (text && text.includes('[')) {
                    lrc = text;
                    break;
                }
            } catch (error) {
                console.warn('获取歌词失败，尝试下一个来源：', error.message);
            }
        }

        lrcCache.set(cacheKey, { time: Date.now(), text: lrc });
        res.type('text/plain; charset=utf-8');
        res.send(lrc);
    } catch (error) {
        console.error('获取歌词失败：', error.message);
        res.status(502).json({ success: false, error: '歌词获取失败' });
    }
});

// 404 fallback：返回 index.html（用于 SPA/深链接刷新）
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) res.status(404).end();
    });
});

// 统一错误处理：避免把堆栈信息暴露给客户端
app.use((err, req, res, next) => {
    console.error('请求处理异常：', err.message);
    if (res.headersSent) return next(err);
    res.status(500).json({ success: false, error: '服务器内部错误' });
});

// 优雅关闭
function shutdown(signal) {
    console.log(`收到 ${signal}，正在关闭服务...`);
    process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
