# History Atlas · 历史资源图谱

> 一个面向高中历史的 **资源聚合库 + 3D 动画索引 + AI 学习助手**。

项目不止是一个「答疑机器人」：底层是把教材、真题、史料等学习资源结构化聚合起来的知识库，中层是用 3D 动画把「单元 → 课 → 子目 → 知识点」的空间关系可视化出来的索引，上层才是基于 RAG 的问答、针对性出题与错题复盘。

**本质**：一个面向大众的历史资源聚合网站，附带沙盘索引与智能体问答；不是班级管理平台。沙盘是首页，作用是**定位事件对应的资源与知识点**，并帮助学生建立时空框架——**不做事件级 3D 场景演绎**（兵棋、朝堂、全景不在产品范围内）。

## 三层形态

| 层 | 名称 | 说明 | 现状 |
| --- | --- | --- | --- |
| 资源层 | 资源聚合库 | 教材章节、高考真题、史料与知识点标签统一建模，支持检索与引用溯源 | 方案已定，待建库 |
| 索引层 | 3D 动画索引（史境沙盘） | 以时间轴 / 三维沙盘呈现历史时空，点击即下钻到事件与资源 | 可用 Demo：三维沙盘、21 个事件、兵棋与朝堂场景 |
| 应用层 | AI 学习助手 | 基于教材 RAG 的问答、按薄弱点出题、错题本与学情统计 | 方案已定，待接后端 |

## 仓库结构

```
history-atlas/
├── backend/                 # FastAPI 服务：用户 / 题库 / 学情 / 对话
├── frontend/                # Vue 3 + Vite 前端，3D 沙盘（史境）已在其中
│   ├── public/assets/       # 事件插画、全景、封面、地图纹理
│   ├── public/vendor/       # Three.js r147 / OrbitControls（MIT）
│   ├── src/engine/          # 沙盘引擎：core / dem / map / route / scene / vr360 / figures / ui / sfx
│   ├── src/data/            # 时期主题、资源清单、许可、DEM 高程
│   ├── src/App.vue          # 应用外壳（外壳静态结构 + 引擎挂载）
│   └── vite.config.js
├── docs/
│   ├── 历史学习智能体MVP技术方案(2).docx
│   └── 3d/                  # 沙盘课件说明、场景契约、资源替换与授信
├── tools/                   # DEM / 全景构建脚本（仅本机运行）
└── README.md
```

## 前端：史境 · 三维历史沙盘

3D 索引不是从零画大饼——已有一套可运行的沙盘 Demo（原 `history-3D-course` 仓库），现作为前端底座迁入并重构：

- **引擎与 UI 解耦**：`src/engine/*` 只认 canvas 与 `data/*`，DOM 层集中在 `ui.js`，所有交互走 `HS.ui.on(act, fn)` 契约。
- **模块化**：由「全局脚本 + `window.HS` 单例」改为 ESM 模块图，依赖关系显式化（`import { HS } from './hs.js'`、`import { data } from '../data/index.js'`）。
- **构建**：Vite 打包，`npm run dev` 起开发服务，`npm run build` 产出静态站点。
- **Vue 接入方式**：`App.vue` 承载外壳，引擎在 `onMounted` 后动态加载；原有 DOM 以 `v-pre` 静态渲染，保留 `id` / `data-act` 契约，后续按区域逐步替换成 Vue 组件，无需重写 Three.js 逻辑。

```bash
cd frontend
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 产物在 frontend/dist
```

引擎细节见 [frontend/README.md](frontend/README.md)，课件使用与数据字段见 [docs/3d/课件说明.md](docs/3d/课件说明.md)。

## 技术选型（MVP）

- **前端**：Vue 3 + Vite + Three.js r147（3D 索引）；Vant UI 用于学习侧 H5 页面
- **后端**：Python FastAPI
- **检索**：Chroma 向量库 + bge-large-zh-v1.5 Embedding
- **存储**：MySQL 8.0（题目 / 用户）、Redis（缓存 / 会话）
- **模型**：通义千问 / 文心一言 API
- **部署**：Docker Compose + 单台云服务器

## 路线图

- [x] 3D 索引底座：三维沙盘、事件时间轴、DEM 地形（隋唐 / 五代十国 / 宋朝）
- [ ] 3D 索引与知识结构对齐：单元 → 课 → 子目 → 事件 / 知识点
- [ ] 教材知识库结构化（《中外历史纲要（上）》）
- [ ] 高考真题题库与三级知识点标签体系
- [ ] RAG 问答：强约束 + 出处溯源 + 低相似度兜底
- [ ] 出题 / 错题本 / 学情统计
- [ ] 联调、部署与试点反馈

## 文档

- [需求文档（PRD）](docs/需求文档.md)：产品定位、角色、功能需求、验收标准、里程碑
- [接口文档（API v1）](docs/接口文档.md)：通用约定、数据模型、全部接口与错误码
- [Git 提交与分支规范](docs/Git提交与分支规范.md)：分支模型、开发流程、提交信息、冲突处理
- [历史学习智能体 MVP 技术方案](<docs/历史学习智能体MVP技术方案(2).docx>)
- [课件使用说明（数据字段 / 资源替换）](docs/3d/课件说明.md)
- [场景数据契约](docs/3d/handoff/SCENE_SPEC_v0.4.md)
- [DEM 来源与许可](docs/3d/handoff/DEM_SOURCES.md)

## 来源与许可

- 3D 沙盘迁自独立仓库 `history-3D-course`（本仓库为其深度重构版，原仓库不受影响）。
- Three.js r147 / OrbitControls：MIT。DEM：Mapzen / Joerd Terrain Tiles（SRTM / GMTED2010 / 3DEP 公有领域，ETOPO1 NOAA）。
- 事件插画与全景为 AI 或程序化复原示意，不是历史影像或全景摄影；历史疆域与兵力为教学示意。
