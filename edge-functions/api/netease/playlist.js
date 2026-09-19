/**
 * EdgeOne Makers · Edge Function（边缘函数）
 * 路由：GET /api/netease/playlist?id=<歌单ID>
 *
 * ⚠️ 目录约定（Makers 新版）：edge-functions/ 下的文件树直接映射 URL，
 *    即 edge-functions/api/netease/playlist.js → /api/netease/playlist
 *    （旧版 Pages 用的 functions/ 目录 Makers 不识别，已废弃）
 * 运行时：Edge Runtime（V8 / Web 标准 API，不是 Node，无 express）
 */
const METING_API = 'https://meting.mikus.ink/api';
const DEFAULT_PLAYLIST_ID = '18387867575';
const PLAYLIST_TTL = 10 * 60 * 1000; // 歌单元数据缓存 10 分钟

// 边缘实例内存缓存（best-effort，每个 isolate 各自持有）
let cache = { key: null, time: 0, payload: null };

function json(data, status = 200, maxAge = 300) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'content-type': 'application/json; charset=UTF-8',
            'access-control-allow-origin': '*',
            'cache-control': maxAge > 0 ? `public, max-age=${maxAge}` : 'no-store'
        }
    });
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

async function handler(context) {
    const request = context.request;
    const url = new URL(request.url);
    const playlistId = String(url.searchParams.get('id') || DEFAULT_PLAYLIST_ID).trim();

    if (!/^\d+$/.test(playlistId)) {
        return json({ success: false, error: '歌单 ID 不合法', data: [] }, 400, 0);
    }

    if (cache.key === playlistId && cache.payload && Date.now() - cache.time < PLAYLIST_TTL) {
        return json(cache.payload, 200, 300);
    }

    const api = new URL(METING_API);
    api.searchParams.set('server', 'netease');
    api.searchParams.set('type', 'playlist');
    api.searchParams.set('id', playlistId);

    try {
        const upstream = await fetch(api.toString(), { headers: { accept: 'application/json' } });
        if (!upstream.ok) {
            return json({ success: false, error: `Meting 返回 ${upstream.status}`, data: [] }, 502, 0);
        }
        const raw = await upstream.json();
        if (!Array.isArray(raw)) {
            return json({ success: false, error: 'Meting 返回格式异常', data: [] }, 502, 0);
        }

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
        cache = { key: playlistId, time: Date.now(), payload };
        return json(payload, 200, 300);
    } catch (error) {
        return json({ success: false, error: '网易云接口暂时不可用', data: [] }, 502, 0);
    }
}

export default handler;
