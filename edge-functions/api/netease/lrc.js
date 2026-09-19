/**
 * EdgeOne Makers · Edge Function（边缘函数）
 * 路由：GET /api/netease/lrc?p=<歌单ID>&i=<序号>
 *
 * 返回纯文本（LRC）。逻辑与 server.js 的 /api/netease/lrc 对齐。
 */
const METING_API = 'https://meting.mikus.ink/api';
const DEFAULT_PLAYLIST_ID = '18387867575';
const PLAYLIST_TTL = 10 * 60 * 1000;
const LRC_TTL = 60 * 60 * 1000; // 歌词缓存 1 小时

let playlistCache = { key: null, time: 0, raw: null };
const lrcCache = new Map(); // songId -> { time, text }

function text(body, status = 200, maxAge = 3600) {
    return new Response(body, {
        status,
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'access-control-allow-origin': '*',
            'cache-control': `public, max-age=${maxAge}`
        }
    });
}

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
        const cached = lrcCache.get(id);
        if (cached && Date.now() - cached.time < LRC_TTL) {
            return text(cached.text);
        }

        let lrc = '';
        const sources = [];
        if (typeof item.lrc === 'string' && /^https?:\/\//i.test(item.lrc)) {
            sources.push(item.lrc);
        }
        if (/^\d+$/.test(id)) {
            const u = new URL(METING_API);
            u.searchParams.set('server', 'netease');
            u.searchParams.set('type', 'lrc');
            u.searchParams.set('id', id);
            sources.push(u.toString());
        }

        for (const source of sources) {
            try {
                const upstream = await fetch(source);
                const body = await upstream.text();
                if (body && body.includes('[')) {
                    lrc = body;
                    break;
                }
            } catch (error) {
                // 换下一个来源
            }
        }

        lrcCache.set(id, { time: Date.now(), text: lrc });
        return text(lrc);
    } catch (error) {
        return json({ success: false, error: '歌词获取失败' }, 502);
    }
}

export default handler;
