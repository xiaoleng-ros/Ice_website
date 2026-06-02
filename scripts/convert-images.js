// 一次性脚本：把关键图片转成 WebP
// 运行：node scripts/convert-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targets = [
    { src: 'static/img/music.png', webp: 'static/img/music.webp', quality: 80 },
    { src: 'static/img/qq.jpg',    webp: 'static/img/qq.webp',    quality: 75 },
    { src: 'static/img/wechat.jpg', webp: 'static/img/wechat.webp', quality: 75 }
];

(async () => {
    for (const t of targets) {
        if (!fs.existsSync(t.src)) continue;
        const before = fs.statSync(t.src).size;
        await sharp(t.src)
            .webp({ quality: t.quality })
            .toFile(t.webp);
        const after = fs.statSync(t.webp).size;
        console.log(`${t.src} (${(before/1024).toFixed(0)}KB) → ${t.webp} (${(after/1024).toFixed(0)}KB) [省 ${((1-after/before)*100).toFixed(0)}%]`);
    }
})();
