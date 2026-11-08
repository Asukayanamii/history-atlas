# 前端：史境 · 三维历史沙盘

三维历史沙盘，由原 `history-3D-course` 仓库迁入并重构为 **Vue 3 + Vite + ESM** 工程。

## 运行

```bash
npm install
npm run dev      # 开发服务 http://127.0.0.1:5173
npm run build    # 产物 frontend/dist
npm run preview  # 预览构建产物
```

## 目录

```
frontend/
├── index.html            # Vite 入口，加载 Three.js r147（vendor）与 Vue 应用
├── src/
│   ├── main.js           # createApp(App).mount('#app')
│   ├── App.vue           # 应用外壳：静态 DOM（v-pre）+ 挂载引擎
│   ├── css/app.css       # 界面样式
│   ├── engine/           # 沙盘引擎（纯 JS，无框架依赖）
│   │   ├── hs.js         # 共享命名空间（原 window.HS）
│   │   ├── core.js       # 渲染器 / 场景 / 相机 / 投影 / 补间 / 标签层
│   │   ├── dem.js        # DEM 解码、采样、高度网格
│   │   ├── map.js        # 沙盘地形、海陆、等高线、势力、河流、地名
│   │   ├── route.js      # 路线曲线、生长动画、事件节点
│   │   ├── scene.js      # 3D 场景：war 兵棋 / battlefield / court
│   │   ├── vr360.js      # 360° 全景环视
│   │   ├── figures.js    # 低多边形人物与编队
│   │   ├── ui.js         # DOM 层：顶栏、卡片、时间轴、弹窗
│   │   ├── sfx.js        # Web Audio 合成音效
│   │   └── main.js       # 启动、主题/事件切换、键盘、公开 API
│   └── data/             # 内容与资源
│       ├── index.js      # 数据聚合出口（data 单例）
│       ├── theme.*.js    # 隋唐 / 五代十国 / 宋朝三个时期
│       ├── themes.index.js  # 项目信息、时期顺序、默认时期
│       ├── assets.js     # 资源清单（图片路径 / 状态 / 出处）
│       ├── license.js    # 来源与授权
│       └── dem/regions.js# 真实高程（构建产物，勿手改）
├── public/
│   ├── assets/           # 插画、全景、封面、地图纹理
│   └── vendor/           # three.min.js / OrbitControls.js（MIT）
└── vite.config.js
```

## 重构状态

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| 1 | 迁入 + Vite 工程化：IIFE/全局脚本 → ESM 模块图，`window.HS` → `hs.js` 单例，`window.HISTORY_*` → `data` 模块 | 已完成 |
| 2 | Vue 组件化：`App.vue` 中的静态外壳按区域拆成组件（顶栏 / 时间轴 / 事件卡片 / 弹窗），沿用 `id`、`data-act` 契约 | 待做 |
| 3 | 与资源聚合库打通：事件 ↔ 知识点 / 教材章节双向索引，AI 问答面板接入 | 待做 |

> 阶段 2 的做法：`ui.js` 通过 `document.getElementById` 与事件委托工作，只要组件保留相同的 `id` / `data-act`，替换 DOM 结构不影响引擎逻辑。

## 数据契约（改动前先看）

- 事件字段、场景类型与坐标约定：[../docs/3d/handoff/SCENE_SPEC_v0.4.md](../docs/3d/handoff/SCENE_SPEC_v0.4.md)
- 资源替换与授权要求：[../docs/3d/handoff/RESOURCE_REPLACEMENT.md](../docs/3d/handoff/RESOURCE_REPLACEMENT.md)
- DEM 来源与许可：[../docs/3d/handoff/DEM_SOURCES.md](../docs/3d/handoff/DEM_SOURCES.md)
