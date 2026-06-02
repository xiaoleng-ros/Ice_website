const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

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
        } else if (/\.(css|js|woff2?)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

// API: 获取音乐文件列表
let musicCache = null;
let musicCacheTime = 0;
const MUSIC_CACHE_TTL = 60 * 1000; // 1 分钟缓存，避免每次请求 readdirSync

app.get('/api/music', (req, res) => {
    const now = Date.now();
    if (musicCache && now - musicCacheTime < MUSIC_CACHE_TTL) {
        return res.json(musicCache);
    }

    const musicDir = path.join(__dirname, 'static', 'music');

    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error('读取音乐目录失败：', err.message);
            return res.status(500).json({
                success: false,
                error: '读取音乐目录失败',
                data: []
            });
        }

        const filesLower = new Set(files.map(f => f.toLowerCase()));
        const musicList = files
            .filter(file => file.toLowerCase().endsWith('.mp3'))
            .map(file => {
                const nameWithoutExt = file.replace(/\.mp3$/i, '');
                const parts = nameWithoutExt.split(' - ');
                let title = nameWithoutExt;
                let artist = '未知歌手';
                if (parts.length >= 2) {
                    artist = parts[0].trim();
                    title = parts.slice(1).join(' - ').trim();
                }
                const lrcFile = file.replace(/\.mp3$/i, '.lrc');
                const hasLyrics = filesLower.has(lrcFile.toLowerCase());

                return {
                    title,
                    artist,
                    src: `/static/music/${encodeURIComponent(file)}`,
                    cover: '/static/img/music.png',
                    lyrics: hasLyrics ? `/static/music/${encodeURIComponent(lrcFile)}` : null
                };
            });

        musicCache = { success: true, data: musicList };
        musicCacheTime = now;
        res.json(musicCache);
    });
});

// 404 fallback：返回 index.html（用于 SPA/深链接刷新）
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(publicDir, 'index.html'), (err) => {
        if (err) res.status(404).end();
    });
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
