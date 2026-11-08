# Git 提交与分支管理规范

> 参考 `personalized-learning-space` 项目的《代码提交规范》（docs/04-代码提交规范.md）改写，按本项目实际情况调整：托管在 **GitHub**（不是云效 Codeup），仓库为 **私有 + 免费版**，因此保护分支能力受限（见 1.2）。
>
> 简版，按这个来就行；未覆盖的内容后续追加。

---

## 0. 如何开始

**① 克隆项目**

```bash
git clone https://github.com/Asukayanamii/history-atlas.git
cd history-atlas
```

**② 安装前端依赖并确认能跑起来**

```bash
cd frontend
npm install
npm run dev          # http://127.0.0.1:5173
```

**③ 切到自己的开发分支**

后端同学切 `backend-dev`，前端同学切 `frontend-dev`：

```bash
git checkout frontend-dev
git pull origin frontend-dev
```

**④ 做具体功能时，在 dev 分支上新开 `feat` 分支**，不要直接改 dev：

```bash
git checkout frontend-dev
git pull origin frontend-dev          # 先拉最新，很重要
git checkout -b feat/atlas-event-panel
```

> 每个功能子模块开一个 `feat/xxx`，开发完提 PR 合回对应的 dev（完整流程见第 2 章）。
>
> GUI（VS Code / PyCharm / GitHub Desktop）的 Git 功能完全等价，不强制敲命令。

**⑤ 认证方式**：GitHub 已禁用账号密码推送，使用 **Personal Access Token（PAT）** 或 **SSH key**。仓库地址已配置为 HTTPS + 本机凭据，无需重复输入。

---

## 1. 分支模型

```text
feat/xxx  ──► PR（Squash）──► backend-dev  ──┐
                                              ├──► 里程碑完成 ──► PR（Merge）──► main
feat/xxx  ──► PR（Squash）──► frontend-dev ──┘

hotfix/xxx ──► PR（Merge）──► main ──► 回合并到各 dev
```

| 分支 | 用途 | 说明 |
| --- | --- | --- |
| `main` | 主分支 | 随时可演示、可部署。**约定不直接 push**，只接受 PR |
| `backend-dev` | 后端集成分支 | 后端模块开发完合到这里 |
| `frontend-dev` | 前端集成分支 | 前端模块开发完合到这里 |
| `feat/xxx` | 功能分支 | 从对应 dev 新开，一个子模块一个分支 |
| `fix/xxx` | 缺陷分支 | 修集成阶段问题，合回对应 dev |
| `docs/xxx` | 文档分支 | 需求/接口文档大改时使用，合回 dev |
| `hotfix/xxx` | 线上紧急修复 | 从 `main` 新开，修完合回 `main`，再回合并到各 dev |

**核心规则：先合 dev，再合 main。** 功能分支不要直接向 `main` 提 PR。

命名规则：

| 类型 | 命名示例 |
| --- | --- |
| 功能 | `feat/atlas-event-panel`、`feat/rag-qa`、`feat/question-generate` |
| 修复 | `fix/mistake-dedup`、`fix/citation-missing` |
| 文档 | `docs/api-v1`、`docs/prd-revision` |
| 构建/杂项 | `chore/vite-build`、`chore/remove-scene-code` |
| 紧急修复 | `hotfix/token-expire` |

分支名一律**小写 + 连字符**，不要出现中文、空格、下划线。

### 1.1 在 GitHub 上创建 PR

```text
仓库页 → Pull requests → New pull request
  → base 选 backend-dev / frontend-dev
  → compare 选 feat/atlas-event-panel
  → 填标题（符合第 6 章格式）、描述（第 2 章模板）
  → 指定 Reviewer（至少 1 人）→ Create pull request
```

要点：

- **base 和 compare 别选反**；
- 标题就是将来进 dev 的提交信息，写清楚做了什么；
- 有冲突时 GitHub 会显示 `This branch has conflicts`，处理办法见第 3 章。

### 1.2 保护分支（现状与对策）

当前仓库是 **私有 + GitHub 免费版**，平台不支持保护分支（GitHub 提示需 Pro 或公开仓库）。因此：

| 规则 | 当前落地方式 |
| --- | --- |
| 禁止直接 push `main` | **靠约定**：不直接推，一律走 PR |
| 合并前需评审 | 约定至少 1 人评审；两人项目允许自审，但须在 PR 里写清验证方式 |
| 新提交重置评审 | 评审后如再推提交，需在 PR 里留言说明并重新确认 |

**计划**：一旦仓库转为公开或升级 GitHub Pro，立刻按下列配置开启，用平台兜底：

| 配置项 | 值 |
| --- | --- |
| 保护分支 | `main` |
| 允许直接推送 | 否（仅管理员可例外） |
| 合并前要求 | 至少 1 个 approving review |
| 新提交后重置评审 | 是 |
| 要求状态检查通过 | 接入 CI 后开启（见第 9 章） |

### 1.3 与参考项目的差异

| 项 | personalized-learning-space | 本项目 |
| --- | --- | --- |
| 托管 | 阿里云效 Codeup | GitHub |
| 「PR」叫法 | 合并请求 | Pull Request |
| 保护分支 | 已由平台配置 | 免费版不可用，靠约定（见 1.2） |
| 主机分支 | `master` | `main`（GitHub 默认） |
| 功能分支合并方式 | Merge | **Squash**（保持 dev 历史线性） |

---

## 2. 开发流程

### 第 1 步：从 dev 新开功能分支

```bash
git checkout frontend-dev
git pull origin frontend-dev
git checkout -b feat/atlas-event-panel
```

### 第 2 步：开发 + 提交（可多次）

```bash
git add frontend/src
git status                     # 先看一眼，别把本地配置带上
git commit -m "feat(frontend): 事件面板展示关联知识点与教材出处"
```

一个子模块可以拆成多次提交，**一次提交只做一件事**。

### 第 3 步：本地自测

| 端 | 最低要求 |
| --- | --- |
| 前端 | `npm run build` 通过；`npm run dev` 下页面可交互，控制台无 error |
| 后端 | 服务能起；核心接口在 `/docs`（Swagger）里调通；单元测试通过 |
| 文档 | `git diff --check` 无空白/冲突残留 |

**没跑通的东西不要提 PR。**

### 第 4 步：同步 dev 最新代码

```bash
git fetch origin
git merge origin/frontend-dev      # 用 merge，不用 rebase 改公共分支历史
```

没冲突就继续；有冲突跳到第 3 章。

### 第 5 步：推送并提 PR

```bash
git push -u origin feat/atlas-event-panel
```

然后在 GitHub 上创建 PR：`feat/atlas-event-panel` → `frontend-dev`。

**PR 描述模板**（够用就行，不要空着）：

```markdown
## 做了什么
- 事件面板新增「关联知识点 / 教材出处」区块
- 点击知识点跳转反查事件列表

## 怎么验证
- `npm run build` 通过
- 打开 /?theme=wudai&event=wudai-e06，点击面板资源项，控制台无报错
- 截图：<贴图>

## 影响范围
- 仅前端；未改接口

## 关联文档
- docs/需求文档.md FR-ATL-03
```

### 第 6 步：评审 + 合并（Squash）

- 至少 1 人评审通过；
- GitHub 选 **Squash and merge**，压缩成一条提交进 dev；
- 合并后**删除源分支**（GitHub 有 `Delete branch` 按钮）。

> 不要在已合并的分支上继续开发新任务，一律从最新 dev 新开。

### 第 7 步：里程碑完成，dev → main

一个可演示的里程碑（例如「沙盘索引接通数据」）整体验证通过后，才提 PR：

**`frontend-dev` → `main`**，使用 **Merge commit**（保留里程碑节点）。

> 不要每做完一个小功能就往 main 合；`main` 永远保持可运行。

合并后把 main 合回各 dev，保持起点一致：

```bash
git checkout frontend-dev
git fetch origin
git merge origin/main
git push origin frontend-dev
```

### 合并策略对照

| 合并方向 | 方式 | 理由 |
| --- | --- | --- |
| `feat/fix/docs` → `*-dev` | **Squash merge** | dev 历史线性、一条提交对应一个功能 |
| `*-dev` → `main` | **Merge commit** | 保留里程碑边界，便于回溯 |
| `hotfix` → `main` | **Merge commit** | 线上修复需可追溯 |
| `main` → `*-dev` | Merge | 同步，不产生新内容 |

### 分支同步与清理

- **feat 分支**：开工前 `git pull` 自己的 dev；每天收工前把 dev 最新代码合进来一次。
- **dev ↔ main**：里程碑合并后，立即把 main 合回两个 dev。
- **前后端之间**：`frontend/` 与 `backend/` 目录不重叠，通过接口契约联调；需要对方最新代码时合 master（main）即可。
- **生命周期**：功能分支合入 dev 后即删（本地 `git branch -d`，远程 PR 页面 Delete branch）。不要长期保留。

---

## 3. 解决冲突

### 3.1 什么时候会遇到

两个分支改了**同一文件的同一块区域**。常见于 `git merge origin/frontend-dev`，以及 PR 页面提示 `This branch has conflicts that must be resolved`。

**最好的办法是提前避免**：提 PR 之前先执行第 2 章第 4 步，把冲突在本地解决掉。

### 3.2 冲突长什么样

```text
<<<<<<< HEAD
const threshold = 0.5;      // 你分支上的代码
=======
const threshold = 0.55;     // dev 上的代码
>>>>>>> origin/frontend-dev
```

| 标记 | 含义 |
| --- | --- |
| `<<<<<<< HEAD` ~ `=======` | 当前分支的内容 |
| `=======` ~ `>>>>>>> origin/xxx` | 要合进来的分支的内容 |

### 3.3 三步解决

```bash
git status                              # ① 看哪些文件冲突
# ② 手动编辑，删掉 <<<<<<< / ======= / >>>>>>> 三行标记，保留正确内容
git add frontend/src/engine/main.js     # ③ 标记已解决
git commit                              # 用默认 merge 信息即可
```

### 3.4 怎么决定保留哪一段

| 情况 | 做法 |
| --- | --- |
| 两边改的是不同功能 | 两段都保留 |
| 两边改的是同一处逻辑 | 想清楚正确行为，合成一段 |
| 你的改动已废弃 | 用 dev 的版本 |
| 拿不准 | 去问改这块的人，别乱猜 |

> ⚠️ 不要直接删掉别人的代码。冲突不是二选一，是合出一个两边都对的版本。

### 3.5 中途放弃与自检

```bash
git merge --abort     # 回到合并前
git diff --check      # 检查是否还有残留的 <<<<<<< 标记与行尾空白
```

### 3.6 减少冲突的习惯

- 开工前先 `git pull`，别在过期代码上开发；
- 每天收工前合一次 dev；
- 按模块划清分工，别两个人同时改同一文件（本项目重点：`src/engine/**`、`src/data/**`、`docs/**`）；
- 同一文件反复冲突 = 任务边界有问题，先沟通再动手。

---

## 4. 注释规范

### 基本要求

- **必要的业务逻辑必须写注释**；允许 AI 辅助写代码，但提交前必须自己读懂、核对。
- 注释解释「**为什么这么做**」，而不是复述「做了什么」。

### 示例

```js
// ✗ 差：复述代码
// 把 threshold 设为 0.5
const threshold = 0.5;

// ✓ 好：解释业务规则
// 相似度低于 0.5 时不作答，直接返回「教材中未找到」，参见需求 FR-QA-03
const threshold = 0.5;
```

### 复杂逻辑必须加注释

问答兜底、知识点聚合、练习组卷、沙盘坐标投影这类逻辑，每个关键分支都要说明意图。

### 关联需求编号（推荐）

```python
# 对应需求 FR-EX-07：AI 生成题必须带标识
if question.source_type == "ai_generated":
    item.badge = f"AI 生成 · {question.source_meta.model}"
```

### 不要写的注释

- 废话注释：`// 定义变量`、`// 循环遍历`
- 已过期的注释（改了代码就同步改）
- 大段注释掉的废弃代码，直接删

---

## 5. 不要提交本地文件与产物

**原则：本地配置、密钥、构建产物只留在本机。**

| 不要提交 | 原因 |
| --- | --- |
| `.env`、`.env.local` | 含数据库密码、JWT 密钥、大模型 API Key |
| `node_modules/` | 依赖目录，体积大 |
| `frontend/dist/` | 构建产物，可重新生成 |
| `tools/.dem-cache/`、`.build-dem.log` | DEM 构建缓存与日志 |
| `.idea/`、`.vscode/` | 各自的编辑器配置 |
| `*.db`、`*.sqlite3` | 本地调试数据 |
| 临时截图 / QA 图（`tmp/`、`qa-*.png`） | 体积大、无长期价值 |
| `*.rar`、`*.zip` 打包件 | 与仓库内容重复，diff 不可读 |

规则由根目录 `.gitignore` 兜底，**不要删规则，也不要用 `git add -f` 强推**。

需要共享的配置写成 `.env.example`：只放字段名和示例值，各人复制成 `.env` 后填自己的值。

**万一已经提交了密钥**：立刻更换对应密码 / 密钥（旧的随之作废），并在团队里说明——只删文件没用，git 历史里仍查得到。

### 5.1 本项目的特殊约定

| 对象 | 规则 |
| --- | --- |
| `frontend/src/data/dem/regions.js`（约 3MB） | **生成物**，只在重跑 `tools/build_dem.py` 时随代码一起提交，单独一条提交，说明重跑原因 |
| 事件插画 / 全景（`public/assets/**`） | 单文件 ≤ 600KB，格式 JPEG；新增资源必须同时更新 `src/data/assets.js` 清单与 `license.js` 出处 |
| `package-lock.json` | **必须提交**，锁版本；只随依赖变更单独提交（`chore(deps): ...`） |
| Word 文档（`docs/*.docx`） | diff 不可读，每次改动**单独一条提交**，提交信息写清改了哪一章 |
| 中文文件名 | 保持现状（`docs/需求文档.md`），不要为了兼容改英文名 |

---

## 6. 提交信息

格式（参考 Conventional Commits 简化版）：

```text
类型(范围): 简要说明

（可选）正文：为什么改、改了什么、有什么影响
（可选）脚注：关联需求 / 接口 / 文档，如 Refs: FR-ATL-03
```

### 类型

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复缺陷 |
| `docs` | 文档变更（需求 / 接口 / README） |
| `refactor` | 重构（不改变对外行为） |
| `style` | 格式调整（空格、分号、排版，不改逻辑） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建、依赖、脚手架、杂项 |
| `revert` | 回滚某次提交 |

### 范围（可选，推荐）

| 范围 | 说明 |
| --- | --- |
| `frontend` | `frontend/` |
| `backend` | `backend/` |
| `docs` | `docs/` |
| `deps` | 依赖与锁文件 |
| `ci` | 流水线配置 |

### 示例

```text
feat(frontend): 事件面板展示关联知识点与教材出处
fix(backend): 修复问答引用去重后页码丢失
docs: 新增 Git 提交与分支管理规范
refactor(frontend): 沙盘引擎改为 ESM 模块并移除全局命名空间
chore(deps): 升级 vite 到 6.4.5
revert: 回退「移除 vr360 模块」的改动，影响未评审完的演示
```

### 要求与反例

**要求**

- 说清做了什么，不写 `update`、`修改一下`、`fix bug`、`临时提交`；
- 标题 ≤ 50 字，结尾不加句号；
- 一次提交只对应一件事（不要「顺手改了三个模块」）；
- **不添加任何工具或 AI 署名**（`Co-authored-by:`、`Generated with ...`），提交信息只描述本次改动。

**反例**

| ✗ 不好 | ✓ 应改为 |
| --- | --- |
| `update` | `fix(backend): 修正验证码 60 秒内可重复发送` |
| `修改前端` | `feat(frontend): 沙盘时间轴支持拖动定位事件` |
| `fix bug` | `fix(frontend): 事件面板在 375px 宽度下溢出` |
| `WIP` | 拆成可验证的小提交再推 |

---

## 7. 命令速查

| 场景 | 命令 |
| --- | --- |
| 克隆 | `git clone https://github.com/Asukayanamii/history-atlas.git` |
| 从 dev 开新分支 | `git checkout frontend-dev && git pull && git checkout -b feat/xxx` |
| 提交 | `git add <路径> && git commit -m "feat(frontend): xxx"` |
| 同步 dev 最新 | `git fetch origin && git merge origin/frontend-dev` |
| 同步 main 到当前分支 | `git fetch origin && git merge origin/main` |
| 推送并建立跟踪 | `git push -u origin feat/xxx` |
| 删除已合并分支 | `git branch -d feat/xxx` / `git push origin --delete feat/xxx` |
| 查看冲突文件 | `git status` |
| 标记冲突已解决 | `git add <文件>` |
| 完成合并提交 | `git commit` |
| 放弃合并 | `git merge --abort` |
| 检查冲突残留 / 空白 | `git diff --check` |
| 查看某文件改动历史 | `git log --oneline -- frontend/src/engine/main.js` |
| 撤销未提交的改动 | `git checkout -- <文件>` |
| 撤销最近一次提交（保留改动） | `git reset --soft HEAD~1` |

---

## 8. 提交前检查清单

```text
[ ] git status 里没有 .env / node_modules / dist / 临时截图
[ ] 本地能跑：npm run build 通过；后端接口在 /docs 调通
[ ] git diff --check 无冲突残留与行尾空白
[ ] 提交信息符合「类型(范围): 说明」
[ ] 接口或需求有变更时，同一次 PR 带上文档更新
[ ] 没有 AI 署名、没有无关格式化改动
```

---

## 9. 待补充

后续按需追加：

- [ ] GitHub Actions：前端 `npm run build` + 后端 `pytest` 作为 PR 必过检查
- [ ] 版本号与 tag 策略（`v0.1.0` 里程碑打 tag）
- [ ] CHANGELOG 生成方式
- [ ] 回滚流程（revert PR / 重新部署上一版本）
- [ ] 仓库转公开或升级 Pro 后，落实 1.2 的保护分支配置
- [ ] `.gitattributes` 统一换行（避免每次提交都出现 LF→CRLF 警告）
