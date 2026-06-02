// 一次性脚本：把 TTF 字体子集化 + 转为 woff2（用项目实际文本 + 常用汉字）
// 运行：node scripts/convert-fonts.js
const fontmin = require('fontmin');
const fs = require('fs');
const path = require('path');

function collectText(dir, ext) {
    let all = '';
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) all += collectText(p, ext);
        else if (f.name.endsWith(ext)) all += fs.readFileSync(p, 'utf8');
    }
    return all;
}

// 收集项目所有 HTML/JS/MD 文本
const root = path.resolve(__dirname, '..');
let corpus = '';
corpus += fs.readFileSync(path.join(root, 'index.html'), 'utf8');
corpus += collectText(path.join(root, 'static/js'), '.js');
corpus += collectText(path.join(root, 'static/css'), '.css');
corpus += fs.readFileSync(path.join(root, 'README.md'), 'utf8');

// 去重 + 加 ASCII
const chars = new Set(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
    ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
);
for (const ch of corpus) chars.add(ch);
const subsetText = [...chars].join('');

const targets = [
    { src: path.join(root, 'static/fonts/Ubuntu-Regular.ttf'), dest: path.join(root, 'static/fonts') }
];

(async () => {
    for (const t of targets) {
        if (!fs.existsSync(t.src)) continue;
        const before = fs.statSync(t.src).size;
        const fm = new fontmin()
            .src(t.src)
            .dest(t.dest)
            .use(fontmin.glyph({ text: subsetText, hinting: false }))
            .use(fontmin.ttf2woff2());
        await new Promise((resolve, reject) => {
            fm.run((err) => err ? reject(err) : resolve());
        });
        const woff2 = t.dest + '/Ubuntu-Regular.woff2';
        if (fs.existsSync(woff2)) {
            const after = fs.statSync(woff2).size;
            console.log(`${path.basename(t.src)} (${(before/1024).toFixed(0)}KB) → ${path.basename(woff2)} (${(after/1024).toFixed(0)}KB) [省 ${((1-after/before)*100).toFixed(0)}%]`);
        }
    }
})();
