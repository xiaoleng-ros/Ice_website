# Iceuu Personal Website

一个采用暗黑科技风格的个人引导页与展示站。具备粒子动画背景、智能音乐播放器、GPS 定位天气等特色功能。

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://ice-website-wine.vercel.app/)
[![License](https://img.shields.io/github/license/xiaoleng-ros/Ice_website)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/xiaoleng-ros/Ice_website)](https://github.com/xiaoleng-ros/Ice_website/stargazers)

---

## 核心特性

### 视觉设计
- **暗黑科技风格**：深色背景搭配霓虹发光效果，营造未来科技感
- **粒子动画背景**：Canvas 粒子系统，支持鼠标交互和粒子连线
- **丰富动画效果**：进入动画、悬停发光、点击涟漪等多种交互动效
- **响应式布局**：完美适配桌面端、平板和移动端

### 功能模块
- **智能音乐播放器**：
  - 自动扫描本地 MP3 文件，无需手动配置
  - 支持 LRC 歌词同步显示
  - 唱片旋转动画 + 音乐波形可视化
  - 完整播放控制（播放/暂停、上一首/下一首、音量调节）
  - 页面切换后自动恢复播放状态
- **GPS 定位天气时钟**：
  - 浏览器 GPS 精确定位（自动降级为 IP 定位）
  - 实时天气信息显示（天气、温度、风力）
  - 实时时钟与日期显示
- **网站运行统计**：自动计算并展示网站运行天数
- **个人信息展示**：头像、简介、技能标签、时间线等
- **站点链接**：博客、Bilibili 等外部链接快速访问

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | HTML5, CSS3, JavaScript (ES6+) |
| 音频 | [Howler.js](https://howlerjs.com/) |
| 后端 | Node.js (Express) |
| 部署 | Vercel |

---

## 项目结构

```
Ice_website/
├── static/
│   ├── css/
│   │   ├── root.css          # CSS 变量与主题定义
│   │   └── style.css         # 样式文件
│   ├── js/
│   │   └── script.js         # 核心逻辑
│   ├── img/                  # 图片资源
│   │   ├── background/       # 背景图片（备用）
│   │   ├── logo.png          # 头像
│   │   └── music.png         # 音乐封面
│   ├── music/                # 音乐文件目录
│   │   └── *.mp3             # MP3 音乐文件
│   ├── svg/                  # SVG 图标
│   └── fonts/                # 自定义字体
├── index.html                # 页面入口
├── server.js                 # Express 服务器（含音乐 API）
├── vercel.json               # Vercel 部署配置
└── package.json              # 项目配置
```

---

## 快速开始

### 环境要求
- Node.js >= 14

### 本地运行

```bash
# 克隆项目
git clone https://github.com/xiaoleng-ros/Ice_website.git

# 进入目录
cd Ice_website

# 安装依赖
npm install

# 启动服务
npm start
```

访问 `http://localhost:3100` 即可查看（可通过 `PORT` 环境变量自定义）。

### 添加音乐

只需将 MP3 文件放入 `static/music/` 目录，系统会自动扫描并加载。

> 配套歌词：将同名的 `.lrc` 文件放在同一目录即可被自动加载。LRC 须为 UTF-8 编码。

**文件命名建议**：
```
static/music/
├── 周杰伦 - 晴天.mp3        # 格式：歌手 - 歌名
├── 稻香.mp3                 # 或直接用歌名
└── 薛之谦 - 演员.mp3
```

支持歌词同步：只需将同名 `.lrc` 文件放在同一目录下即可。

### 自定义内容

| 内容 | 修改位置 |
|------|----------|
| 头像 | `static/img/favicon.ico` |
| 音乐封面 | `static/img/music.png`（含 `.webp` 备选） |
| 个人信息 | `index.html` 中的 `.left-div` 区域 |
| 站点链接 | `index.html` 中的 `.projectList` 区域 |
| 时间线 | `index.html` 中的 `#line` 区域 |
| 主题颜色 | `static/css/root.css` |
| 城市名映射 | `static/data/city-pinyin.json` |

---

## 资源优化

首次拉取后可执行 `npm run build:assets` 把图片转 WebP、字体子集化为 woff2，可节省约 70% 传输体积。

---

## 隐私说明

天气定位功能会调用以下第三方 API（取决于 IP 定位回退链路）：

- 浏览器 GPS（需用户授权）
- [BigDataCloud](https://www.bigdatacloud.net/)、[Nominatim](https://nominatim.openstreetmap.org/) - 反向地理编码
- [wttr.in](https://wttr.in/)、[Open-Meteo](https://open-meteo.com/) - 天气数据
- [ip-api.com](https://ip-api.com/)、[ipwho.is](https://ipwho.is/)、[ipapi.co](https://ipapi.co/)、[ipinfo.io](https://ipinfo.io/) - IP 定位

这些服务会接收到访问者的公网 IP。定位结果在浏览器本地缓存 6 小时（localStorage）。如果不需要此功能，可在 `script.js` 中注释 `updateWeather()` 调用。

---

## 部署

### Vercel 部署（推荐）

1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com/) 导入项目
3. 自动部署完成

项目已内置 `vercel.json`，无需额外配置。

> **注意**：音乐 API 功能 (`/api/music`) 需要 Node.js 服务器支持，Vercel 部署时需要使用 Serverless Functions。

---

## 更新日志

### v3.0.0 (2026-06-02) - 质量与无障碍全面重构

- **服务端加固**：加 helmet 安全头、`compression` gzip、`/api/music` 缓存、`process.env.PORT` 支持、优雅关闭
- **资源优化**：图片 WebP（music.png 644KB→30KB）、字体 woff2 子集化（273KB→6KB）
- **JS 清理**：移除所有 `console.log` 调试输出、3 个 rAF 循环在 `visibilitychange` 与 `prefers-reduced-motion` 时暂停、IP 定位 4 源改 `Promise.any` 并行、点击波纹去重
- **CSS 清理**：删除 ~150 行死代码（`.switch` `.onoffswitch*` 重复块）、修复 `i1.png` 404、修复 `user-select` 全局禁用、滚动条不再隐藏、加 `prefers-reduced-motion` 兜底、添加 z-index 语义化变量
- **HTML 无障碍**：移除 `user-scalable=no`、加 SRI integrity、`<content>` → `<main>`、QQ/微信链接改 `<button>` + `aria-label`、图片加 `alt`、加 `og:*` `theme-color` `apple-touch-icon`、footer 年份动态化
- **Git 卫生**：新增 `.gitignore`、删除 12MB 未引用的背景图、删除过时的 `music.md`、favicon.ico / logo.png 去重
- **定位逻辑**：GPS 优先 + 浏览器授权；并把反向地理编码从慢的 Nominatim 切到 BigDataCloud；localStorage 6h 缓存

### v2.1.0 (2026-05-06) - 赛博朋克风格全面升级
- **自定义光标效果**：双层光标系统（外圈+内点），悬停可交互元素时变色放大
- **打字机效果**：描述文字逐字显示，带闪烁光标
- **点击波纹效果**：点击页面任意位置产生霓虹波纹扩散
- **Logo 霓虹动画**：脉冲光效 + 旋转光环
- **欢迎文字动画**：霓虹闪烁 + 底部渐变装饰线展开
- **标题装饰线**：左侧渐变竖线 + 底部悬停展开横线
- **项目卡片增强**：3D 倾斜效果 + 霓虹边框流动 + 悬停光晕
- **技能卡片美化**：渐变边框动画 + 悬停上浮 + 图片放大
- **左侧标签优化**：霓虹边框流动 + 悬停发光变色
- **时间线美化**：节点脉冲动画 + 悬停变色加粗
- **页面装饰元素**：四角赛博朋克装饰线 + 浮动光线
- **音乐播放器优化**：霓虹边框 + 旋转光效
- **天气时钟增强**：时间文字霓虹脉冲 + 悬停边框
- **唱片播放器**：播放时旋转动画 + 霓虹光环
- **响应式优化**：多断点适配，移动端禁用复杂效果保证性能
- **修复**：emoji 字符在打字机效果中的显示问题

### v2.0.0 (2026-03-20)
- 全新暗黑科技风格 UI 设计
- 粒子动画背景系统
- 音乐播放器重构（自动扫描本地音乐、波形可视化）
- GPS 定位天气功能（支持 IP 定位降级）
- 页面切换后播放状态自动恢复
- 新增 Bilibili 站点链接

### v1.2.1
- 新增实时时钟功能
- 优化 UI 细节

### v1.1.1
- 引入 Howler.js 音乐引擎
- 增加 LRC 歌词同步显示

### v1.0.0
- 项目初始化
- 基础引导页功能

---

## 鸣谢

- [Howler.js](https://howlerjs.com/) - 音频播放引擎
- [iconfont](https://www.iconfont.cn/) - 图标资源
- [skill-icons](https://github.com/tandpfun/skill-icons) - 技能图标
- [OpenStreetMap](https://www.openstreetmap.org/) - 地理编码服务
- [wttr.in](https://wttr.in/) - 天气数据服务

---

## 许可证

[MIT License](LICENSE)

---

> **GitHub**: [https://github.com/xiaoleng-ros/Ice_website](https://github.com/xiaoleng-ros/Ice_website)  
> **Demo**: [https://ice-website-wine.vercel.app/](https://ice-website-wine.vercel.app/)
