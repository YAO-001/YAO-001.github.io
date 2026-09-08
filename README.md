# YAO / 001 — Persona 3 Research Portfolio

YAO-001 的个人研究主页，聚焦具身智能与世界模型、机器人学习与强化学习，以及面向 Agentic 的具身智能架构。

界面按 [Persona 3 参考站](https://persona3-themed-website.vercel.app/) 还原：首页采用相同的角色开场与循环视频、Anton 字体、倾斜菜单、三角形高亮和错落入场；资料、研究档案、联系方式和开源贡献分别采用对应的视频场景及页面转场。

保留 YAO-001 的个人资料、研究问题、技术栈、邮箱、七条精选 PR 及 EN / 中文切换。PR 状态和统计沿用原站 2026.08.30 的内容快照，不代表实时 GitHub 状态。背景视频与参考站一致，静音自动播放。

- 首页：↑ / ↓ 选择，Enter 打开；鼠标和 Tab 同样可用。
- 资料：↑ / ↓ 选择，Enter / → 展开，← 收起，LB / RB 切换。
- 各内页：Esc / Backspace 或页面中的返回链接回到菜单。
- 触屏设备点选开源条目可阅读摘要，再使用详情中的 PR 链接打开原始贡献。
- 右上角保留语言与动态开关；系统减少动态效果设置会暂停视频和动画。
- 窄屏保持菜单及角色场景，长内容可纵向滚动。

## 本地运行

```sh
npm ci
npm run dev
```

```sh
npm test
npm run lint
```

`npm test` 构建静态导出，并检查页面路由、YAO 内容、贡献链接和所需媒体。

## GitHub Pages

继续使用现有 `.github/workflows` 中的发布流程：推送到 `main` 后构建 `out/` 并发布。仓库 Settings → Pages 的 Source 选择 GitHub Actions。

`/about/`、`/resume/`、`/socials/`、`/sideproj/` 均有独立静态 HTML，可直接打开和刷新。原有 `#about`、`#questions`、`#work`、`#contact` 和 `#top` 链接仍可使用。普通项目仓库的子路径同时适用于页面、视频、角色图和字体。

## 素材与界面来源

- 参考站与场景样式：[MdHussain121/Persona3_themed_website](https://github.com/MdHussain121/Persona3_themed_website)。本次移植使用其 `src/P3Menu.jsx`、`AboutMe.jsx`、`ResumePage.jsx`、`Socials.jsx`、`App.jsx` 和 `PageTransition.jsx` 的界面参数及对应角色素材；在 Next.js 内实现导航与 YAO 内容呈现。样式按场景隔离，避免原站同名选择器相互覆盖。
- 原始 UI 基础：[blairxu13/persona3-website](https://github.com/blairxu13/persona3-website)。
- Persona 3 角色与游戏画面属于 ATLUS / SEGA；这里保留参考站的展示素材，不表示对这些素材拥有权利或获得官方认可。
- 字体：Google Fonts 的 Anton、Bebas Neue、Barlow Condensed、Montserrat；字体本地提供，对应许可证保留在 `app/fonts/`。

原始视频、静帧和角色图片保留在 `media-source/persona/`，不会进入 GitHub Pages 的发布目录。网站使用 `public/persona/optimized/` 中的轻量版本；未引入参考作者的个人信息或社交账号。

## 加载与媒体优化

- 背景视频使用 1280×720、30 fps、H.264 CRF 25，移除音轨并启用 MP4 faststart。五段视频由 158 MB 降至约 7 MB；首页开场与循环视频由 90 MB 降至约 3.5 MB。
- 页面先显示预加载的 WebP 静帧与菜单，首屏 HTML 不包含视频请求；首轮绘制后空闲时才开始下载开场视频，距离结束约 1.5 秒时再准备循环视频。循环视频只在开场结束后播放。
- 减少动态效果、手动暂停，以及支持 Network Information API 的节流/2G 网络，首次加载均使用静帧。切到后台时暂停视频，回到前台再继续。
- 所有角色图与静帧转为 WebP。字体保留字形和许可证，转换为 WOFF2；只有首屏 Anton 预加载，其余按实际文本需要加载。
- 菜单保留错落入场，但取消固定 1 秒的延迟。视频播放受限或加载失败时，文字、菜单和静帧仍可使用。
- `npm test` 额外检查静帧优先、延迟视频加载的静态输出、字体预加载数量、MP4 faststart 和媒体体积预算。

视频可由原始文件重新生成，例如：

```sh
ffmpeg -i media-source/persona/Mainn.mp4 -map 0:v:0 -an -vf "scale=1280:-2:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart public/persona/optimized/Mainn.mp4
```
