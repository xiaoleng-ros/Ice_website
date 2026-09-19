/**
 * EdgeOne Makers · Edge Function（边缘函数）
 * 路由：GET /api/netease/url?p=<歌单ID>&i=<序号>
 *
 * 逻辑与 server.js 的 /api/netease/url 对齐：
 *   1) 按「歌单 ID + 序号」定位曲目，取出歌曲 ID；
 *   2) 向 Meting type=url 换取 302 的真实 CDN 直链；
 *   3) 带 Range / Referer 转发音频流，保证拖动进度可用。
 */
const METING_API = 'https://meting.mikus.ink/api';
const DEFAULT_PLAYLIST_ID = '18387867575';
const UPSTREAM_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYLIST_TTL = 10 * 60 * 1000;

let playlistCache = { key: null, time: 0, raw: null };

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'content-type': 'application/json; charset=UTF-8',
            'access-control-allow-origin': '*',
            'cache-control': 'no-store'
        }
    });
}

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

async function getPlaylistRaw(playlistId) {
    if (playlistCache.key === playlistId && playlistCache.raw && Date.now() - playlistCache.time < PLAYLIST_TTL) {
        return playlistCache.raw;
    }
    const api = new URL(METING_API);
    api.searchParams.set('server', 'netease');
    api.searchParams.set('type', 'playlist');
    api.searchParams.set('id', playlistId);

    const res = await fetch(api.toString(), { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Meting 返回 ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error('Meting 返回格式异常');

    playlistCache = { key: playlistId, time: Date.now(), raw };
    return raw;
}

// 跟随 Meting 的 302，取出真实 CDN 直链
async function followToDirectLink(candidate) {
    try {
        const res = await fetch(candidate, { redirect: 'manual', headers: { 'user-agent': UPSTREAM_UA } });
        const loc = res.headers.get('location');
        if (loc) return loc;
        if (res.status === 200) {
            const text = (await res.text()).trim();
            if (/^https?:\/\//i.test(text)) return text;
            if (/^https?:\/\//i.test(candidate)) return candidate;
        }
    } catch (error) {
        // 换下一个候选
    }
    return null;
}

async function resolveTrackUrl(item, id) {
    const candidates = [];
    if (typeof item.url === 'string' && /^https?:\/\//i.test(item.url)) {
        candidates.push(item.url);
    }
    if (/^\d+$/.test(id)) {
        const u = new URL(METING_API);
        u.searchParams.set('server', 'netease');
        u.searchParams.set('type', 'url');
        u.searchParams.set('id', id);
        candidates.push(u.toString());
    }
    for (const candidate of candidates) {
        const direct = await followToDirectLink(candidate);
        if (direct) return direct;
    }
    return null;
}

async function handler(context) {
    const request = context.request;
    const url = new URL(request.url);
    const playlistId = String(url.searchParams.get('p') || DEFAULT_PLAYLIST_ID).trim();
    const index = Number.parseInt(url.searchParams.get('i'), 10);

    if (!/^\d+$/.test(playlistId) || !Number.isInteger(index) || index < 0) {
        return json({ success: false, error: '参数不合法' }, 400);
    }

    try {
        const raw = await getPlaylistRaw(playlistId);
        const item = raw[index];
        if (!item) {
            return json({ success: false, error: '曲目不存在' }, 404);
        }

        const id = extractSongId(item, index, playlistId);
        const target = await resolveTrackUrl(item, id);
        if (!target) {
            return json({ success: false, error: '该歌曲暂无可用音源' }, 502);
        }

        const headers = { 'user-agent': UPSTREAM_UA, referer: 'https://music.163.com/', accept: '*/*' };
        const range = request.headers.get('range');
        if (range) headers.range = range;

        const upstream = await fetch(target, { headers });
        const pass = {};
        for (const key of ['content-type', 'content-length', 'content-range', 'etag', 'last-modified']) {
            const value = upstream.headers.get(key);
            if (!value) continue;
            // 上游会给音频带上 charset=utf-8，音频类型不需要
            pass[key] = key === 'content-type' ? value.replace(/;\s*charset=[^;]*/i, '') : value;
        }
        pass['accept-ranges'] = 'bytes';
        pass['cache-control'] = 'public, max-age=3600';
        pass['access-control-allow-origin'] = '*';

        return new Response(upstream.body, { status: upstream.status, headers: pass });
    } catch (error) {
        return json({ success: false, error: '音频源不可用' }, 502);
    }
}

export default handler;
