const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API: 获取音乐文件列表
app.get('/api/music', (req, res) => {
    const musicDir = path.join(__dirname, 'static', 'music');
    
    try {
        // 读取music目录中的所有文件
        const files = fs.readdirSync(musicDir);
        
        // 筛选出mp3文件
        const musicList = files
            .filter(file => file.endsWith('.mp3'))
            .map(file => {
                // 从文件名解析歌曲信息
                // 假设文件名格式为: "歌手名 - 歌曲名.mp3" 或 "歌曲名.mp3"
                const nameWithoutExt = file.replace('.mp3', '');
                const parts = nameWithoutExt.split(' - ');
                
                let title = nameWithoutExt;
                let artist = '未知歌手';
                
                if (parts.length >= 2) {
                    // 格式: "歌手名 - 歌曲名" 或 "歌手名 - 歌曲名 - 其他"
                    artist = parts[0].trim();
                    title = parts.slice(1).join(' - ').trim();
                }
                // 如果没有分隔符，整个文件名作为歌曲名，歌手为"未知歌手"
                
                // 检查是否存在对应的lrc文件
                const lrcFile = file.replace('.mp3', '.lrc');
                const hasLyrics = files.includes(lrcFile);
                
                return {
                    title: title,
                    artist: artist,
                    src: `/static/music/${encodeURIComponent(file)}`,
                    cover: '/static/img/music.png',
                    lyrics: hasLyrics ? `/static/music/${encodeURIComponent(lrcFile)}` : null
                };
            });
        
        res.json({
            success: true,
            data: musicList
        });
    } catch (error) {
        console.error('读取音乐目录失败:', error);
        res.json({
            success: false,
            error: '读取音乐目录失败',
            data: []
        });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});