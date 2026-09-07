# YAO / 001 — Embodied Intelligence Research

YAO / 001 的个人研究主页，聚焦具身智能与世界模型、机器人学习与强化学习，以及面向 Agentic 的下一代具身智能架构。

页面中的开源工作来自 GitHub 账号 [`YAO-001`](https://github.com/YAO-001) 的公开 Pull Requests，当前精选贡献覆盖 FastMCP、verl、AReaL、TRL 与 AReno。

主页默认显示英文，并提供 `EN / 中文` 页内切换；导航、研究介绍、PR 摘要和页脚会随语言同步更新。

界面采用 P3R 风格的蓝青色、斜切导航与动态背景。菜单支持方向键选择、Enter 打开，URL 锚点支持直接访问栏目及浏览器前进后退；手机端采用顶部菜单，并适配减少动态效果设置。

视觉方向参考 [MdHussain121/Persona3_themed_website](https://github.com/MdHussain121/Persona3_themed_website)。本站使用独立编写的 React/CSS 实现，未引入参考仓库的源码、游戏角色、音乐或视频素材。

## 本地运行

```bash
npm install
npm run dev
```

## 发布到 GitHub Pages

1. 新建名为 `YAO-001.github.io` 的公开仓库。
2. 把本项目推送到仓库的 `main` 分支。
3. 在仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
4. 推送后，项目自带的工作流会自动构建并发布网站。

如果使用普通仓库名，构建会自动处理 GitHub Pages 子路径。
