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

`public/persona/` 包含约 160 MB 的原始视频和角色图片，保留原文件画质；视频静帧用于加载时及减少动态效果模式。未引入参考作者的个人信息或社交账号。
