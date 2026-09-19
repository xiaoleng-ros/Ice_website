/**
 * EdgeOne Pages 构建脚本
 * ------------------------------------------------------------
 * 本项目是「已构建好的纯静态站」：入口 index.html 在仓库根目录，
 * 资源在 static/ 下，没有打包步骤。EdgeOne 若把输出目录指到仓库根，
 * 会把 node_modules / server.js 等一起传上去，所以这里先把真正要发布的
 * 静态产物收敛到 dist/，再让 EdgeOne 只上传 dist/。
 *
 * 只用 Node 内置模块，无需任何依赖。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

// 需要发布的静态产物（相对仓库根目录）
const TARGETS = ['index.html', 'static'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

let copied = 0;
for (const name of TARGETS) {
  const src = path.join(root, name);
  if (!fs.existsSync(src)) {
    console.warn(`[edgeone] 跳过（不存在）：${name}`);
    continue;
  }
  const dest = path.join(dist, name);
  fs.cpSync(src, dest, { recursive: true });
  copied += 1;
  console.log(`[edgeone] 已复制 ${name} -> dist/${name}`);
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('[edgeone] 构建失败：dist/index.html 不存在，站点入口缺失');
  process.exit(1);
}

console.log(`[edgeone] 构建完成，共 ${copied} 项 -> ${dist}`);
