# Git 提交与分支管理规范

> 参考 `personalized-learning-space` 项目的《代码提交规范》改写，按本项目调整：托管在 **GitHub**，采用 **主干开发 + 按功能模块的短命分支**，不设前后端长期集成分支。
>
> **为什么不分前后端**：本项目由 AI 辅助开发，前后端通常在一次改动里一起完成（一个功能 = 接口 + 页面 + 文档）。按「功能模块」切分支，PR 边界与需求条目（FR）对齐，评审时能一次性看完一个闭环；按前后端切反而会把一个功能劈成两半、互相等待。

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

**③ 从最新 main 新开自己的功能分支**

```bash
git checkout main
git pull origin main                  # 先拉最新，很重要
git checkout -b feat/atlas-event-panel
```

**④ 开发、自测、提交 PR**（流程见第 2 章）。

> GUI（VS Code / PyCharm / GitHub Desktop）的 Git 功能完全等价，不强制敲命令。

**⑤ 认证方式**：GitHub 已禁用账号密码推送，使用 **Personal Access Token（PAT）** 或 **SSH key**。

---

## 1. 分支模型

```text
feat/<模块>   ─┐
fix/<问题>    ─┤──► PR（Squash）──► main（受保护，随时可演示）
docs/<主题>   ─┤
chore/<事项>  ─┤
hotfix/<故障> ─┘（线上紧急修复，同样走 PR，可加急评审）
```

| 分支 | 用途 | 生命周期 |
| --- | --- | --- |
| `main` | 唯一常驻分支。随时可运行、可演示、可部署；**只接受 PR** | 永久 |
| `feat/xxx` | 功能模块分支，一个模块/一个 FR 一条 | 合并即删 |
| `fix/xxx` | 缺陷修复分支 | 合并即删 |
| `docs/xxx` | 文档大改（需求/接口/规范重写） | 合并即删 |
| `chore/xxx` | 构建、依赖、脚手架、目录调整 | 合并即删 |
| `hotfix/xxx` | 线上紧急修复，从 `main` 新开，合并后同样删 | 合并即删 |

**核心规则**

1. **没有长期 dev 分支**：不设 `backend-dev` / `frontend-dev`，所有改动最终都进 `main`。
2. **一条分支只做一件事**：一个功能模块、或一个 FR 编号、或一个缺陷。
3. **分支由功能负责人自行维护**：自己负责与 `main` 同步、解冲突、提 PR、删分支，不设「集成分支管理员」。
4. **分支寿命 ≤ 2 周**：超过 2 周未合并的，要么拆小合并，要么关闭重来。
5. **一个分支可以同时改前后端**：同一功能涉及的 `frontend/`、`backend/`、`docs/` 改动放在**同一个 PR** 里，保证 main 上不会出现「接口有了、页面没有」的半成品。

### 1.1 分支命名（按模块，小写 + 连字符）

| 模块 | 建议分支名 |
| --- | --- |
| 沙盘索引 | `feat/atlas-index`、`feat/atlas-event-panel` |
| 资源库 | `feat/resource-library`、`feat/resource-upload` |
| 问答 | `feat/rag-qa`、`feat/qa-citations` |
| 练习与学情 | `feat/practice`、`feat/mistake-book`、`feat/mastery-stats` |
| 账号与教师端 | `feat/auth`、`feat/teacher-portal` |
| 搜索 | `feat/global-search` |
| 基础设施 | `chore/ci`、`chore/gitattributes` |
| 缺陷 | `fix/citation-missing`、`fix/mistake-dedup` |
| 文档 | `docs/api-v1`、`docs/prd-revision` |

> 分支名不要出现中文、空格、下划线；不要用 `dev`、`test`、`temp`、`wip` 这类无信息名字。

### 1.2 在 GitHub 上创建 PR

```text
仓库页 → Pull requests → New pull request
  → base: main
  → compare: feat/atlas-event-panel
  → 标题符合第 6 章格式
  → 描述按第 2 章模板填写（做了什么 / 怎么验证 / 关联 FR）
  → Create pull request
```

要点：

- base 永远是 `main`，不要选反；
- 标题就是将来进 `main` 的提交信息（Squash 后保留标题）；
- 有冲突时 GitHub 显示 `This branch has conflicts`，按第 3 章在本地解决后重新推送。

### 1.3 保护分支（已开启）

仓库已转为 **公开仓库**，`main` 已配置保护规则：

| 规则 | 配置值 | 说明 |
| --- | --- | --- |
| 禁止直接推送 | 是（含管理员） | 只能通过 PR 合并进 main |
| 禁止强制推送 | 是 | 防覆盖历史 |
| 禁止删除分支 | 是 | 防误删 |
| 合并前必须走 PR | 是 | 单人阶段批准数 = 0，可直接合并自己的 PR |
| 要求线性历史 | 是 | 与 Squash 合并配合，main 历史一条一条 |
| 新提交后重置评审 | 是 | 评审通过后再推提交需重新确认 |

> **批准数为什么是 0**：当前只有一名维护者，GitHub 不允许自己批准自己的 PR。等加入第二位协作者后，在 Settings → Branches 把 *Require approvals* 改为 **1**，并勾选 *Dismiss stale pull request approvals*。
>
> 紧急情况下需要直接改 main：临时在 Settings → Branches 关闭保护，改完立刻恢复——**不要长期关闭**。

### 1.4 与参考项目的差异

| 项 | personalized-learning-space | 本项目 |
| --- | --- | --- |
| 托管 | 阿里云效 Codeup | GitHub |
| 「PR」叫法 | 合并请求 | Pull Request |
| 主机分支 | `master` | `main` |
| 集成分支 | `backend-dev` / `frontend-dev` | **不设**，功能分支直接合 main |
| 功能分支合并方式 | Merge | **Squash**（main 历史线性） |
| 保护分支 | 平台已配置 | 已配置（公开仓库，见 1.3） |

---

## 2. 开发流程

### 第 1 步：从 main 新开功能分支

```bash
git checkout main
git pull origin main
git checkout -b feat/atlas-event-panel
```

### 第 2 步：开发 + 提交（可多次）

```bash
git add frontend/src backend/app
git status                              # 先看一眼，别把本地配置带上
git commit -m "feat(atlas): 事件面板展示关联知识点与教材出处"
```

一个功能可以拆多次提交，**一次提交只做一件事**。

### 第 3 步：本地自测

| 端 | 最低要求 |
| --- | --- |
| 前端 | `npm run build` 通过；`npm run dev` 下主流程可走通，控制台无 error |
| 后端 | 服务能起；核心接口在 `/docs`（Swagger）调通；`pytest` 通过 |
| 文档 | `git diff --check` 无冲突残留与行尾空白 |

**没跑通的东西不要提 PR。**

### 第 4 步：同步 main 最新代码

```bash
git fetch origin
git merge origin/main
```

用 `merge` 而不是 `rebase` 改公共分支历史；冲突处理见第 3 章。

### 第 5 步：推送并提 PR

```bash
git push -u origin feat/atlas-event-panel
```

在 GitHub 创建 PR：**`feat/atlas-event-panel` → `main`**。

**PR 描述模板**：

```markdown
## 做了什么
- 事件面板新增「关联知识点 / 教材出处」区块
- 点击知识点跳转反查事件列表（FR-ATL-03）

## 怎么验证
- npm run build 通过
- 打开 /?theme=wudai&event=wudai-e06，点击面板资源项，控制台无报错
- 截图：<贴图>

## 影响范围
- 前端：src/App.vue、src/engine/ui.js
- 后端：无

## 关联
- 需求：docs/需求文档.md FR-ATL-03
- 接口：docs/接口文档.md 7.3
```

### 第 6 步：Squash 合并并删除分支

- 自查通过（或协作者评审通过）后，选 **Squash and merge**，提交信息沿用 PR 标题；
- 合并后点 **Delete branch**；
- 本地清理：`git branch -d feat/atlas-event-panel`。

### 第 7 步：里程碑打 tag（替代 dev 分支）

以前靠 dev 分支承载「阶段性稳定版本」，现在用 **tag**：

```bash
git checkout main && git pull
git tag -a v0.1.0 -m "MVP：沙盘索引接通数据"
git push origin v0.1.0
```

> 打 tag 前确认：`npm run build` 通过、后端可起、`main` 上无已知阻塞缺陷。

### 单人 vs 多人

| 场景 | 做法 |
| --- | --- |
| 单人维护 | 自己提 PR、自查、合并（批准数 0） |
| 有协作者 | 至少 1 人 review 后合并；reviewer 不合并自己没看过的 PR |
| 多人并行 | 按模块切 PR；不要两人同时改同一个文件（见第 3.6 节） |

---

## 3. 解决冲突

### 3.1 什么时候会遇到

两个分支改了**同一文件的同一块区域**。常见于 `git merge origin/main`，以及 PR 页面提示 `This branch has conflicts that must be resolved`。

**最好的办法是提前避免**：提 PR 之前先执行第 2 章第 4 步，把冲突在本地解决掉。

### 3.2 冲突长什么样

```text
<<<<<<< HEAD
const threshold = 0.5;      // 你分支上的代码
=======
const threshold = 0.55;     // main 上的代码
>>>>>>> origin/main
```

| 标记 | 含义 |
| --- | --- |
| `<<<<<<< HEAD` ~ `=======` | 当前分支的内容 |
| `=======` ~ `>>>>>>> origin/main` | 要合进来的 main 的内容 |

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
| 你的改动已废弃 | 用 main 的版本 |
| 拿不准 | 去问改这块的人，别乱猜 |

> ⚠️ 不要直接删掉别人的代码。冲突不是二选一，是合出一个两边都对的版本。

### 3.5 中途放弃与自检

```bash
git merge --abort     # 回到合并前
git diff --check      # 检查是否还有残留的 <<<<<<< 标记与行尾空白
```

### 3.6 减少冲突的习惯

- 开工前先 `git pull origin main`；
- 每天收工前把 main 合进来一次，冲突小、好解决；
- 按模块划清边界（`src/engine/**`、`src/data/**`、`backend/**`、`docs/**`）；
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

**万一已经提交了密钥**：立刻更换对应密码 / 密钥（旧的随之作废），并在团队里说明——只删文件没用，git 历史里仍查得到。**仓库现已公开，密钥泄露的后果更直接，务必先检查再提交。**

### 5.1 本项目的特殊约定

| 对象 | 规则 |
| --- | --- |
| `frontend/src/data/dem/regions.js`（约 3MB） | **生成物**，只在重跑 `tools/build_dem.py` 时随代码一起提交，单独一条提交，说明重跑原因 |
| 事件插画 / 全景（`public/assets/**`） | 单文件 ≤ 600KB，JPEG；新增资源必须同时更新 `src/data/assets.js` 清单与 `license.js` 出处 |
| `package-lock.json` | **必须提交**，锁版本；只随依赖变更单独提交（`chore(deps): ...`） |
| Word 文档（`docs/*.docx`） | diff 不可读，每次改动**单独一条提交**，提交信息写清改了哪一章 |
| 中文文件名 | 保持现状（`docs/需求文档.md`），不要为了兼容改英文名 |

---

## 6. 提交信息

格式（Conventional Commits 简化版）：

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
| `docs` | 文档变更（需求 / 接口 / README / 规范） |
| `refactor` | 重构（不改变对外行为） |
| `style` | 格式调整（空格、分号、排版，不改逻辑） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建、依赖、脚手架、杂项 |
| `revert` | 回滚某次提交 |

### 范围（推荐，按模块）

`atlas`（沙盘索引）、`resource`（资源库）、`qa`（问答）、`practice`（练习学情）、`auth`（账号）、`teacher`（教师端）、`deps`、`ci`、`docs`。

### 示例

```text
feat(atlas): 事件面板展示关联知识点与教材出处
feat(qa): 问答返回教材出处并支持低相似度兜底
fix(practice): 修复错题重复写入
docs: 新增 Git 提交与分支管理规范
refactor(frontend): 沙盘引擎改为 ESM 模块并移除全局命名空间
chore(deps): 升级 vite 到 6.4.5
revert: 回退「移除 vr360 模块」的改动
```

### 要求与反例

**要求**

- 说清做了什么，不写 `update`、`修改一下`、`fix bug`、`临时提交`；
- 标题 ≤ 50 字，结尾不加句号；
- 一次提交只对应一件事；
- **不添加任何工具或 AI 署名**（`Co-authored-by:`、`Generated with ...`），提交信息只描述本次改动。

**反例**

| ✗ 不好 | ✓ 应改为 |
| --- | --- |
| `update` | `fix(auth): 修正验证码 60 秒内可重复发送` |
| `修改前端` | `feat(atlas): 沙盘时间轴支持拖动定位事件` |
| `fix bug` | `fix(atlas): 事件面板在 375px 宽度下溢出` |
| `WIP` | 拆成可验证的小提交再推 |

---

## 7. 命令速查

| 场景 | 命令 |
| --- | --- |
| 克隆 | `git clone https://github.com/Asukayanamii/history-atlas.git` |
| 从 main 开新分支 | `git checkout main && git pull && git checkout -b feat/xxx` |
| 提交 | `git add <路径> && git commit -m "feat(模块): xxx"` |
| 同步 main | `git fetch origin && git merge origin/main` |
| 推送并建立跟踪 | `git push -u origin feat/xxx` |
| 删除已合并分支 | `git branch -d feat/xxx`（远程用 PR 页 Delete branch） |
| 查看冲突文件 | `git status` |
| 标记冲突已解决 | `git add <文件>` |
| 完成合并提交 | `git commit` |
| 放弃合并 | `git merge --abort` |
| 检查冲突残留 / 空白 | `git diff --check` |
| 查看某文件改动历史 | `git log --oneline -- frontend/src/engine/main.js` |
| 撤销未提交的改动 | `git checkout -- <文件>` |
| 撤销最近一次提交（保留改动） | `git reset --soft HEAD~1` |
| 打里程碑 tag | `git tag -a v0.1.0 -m "..." && git push origin v0.1.0` |
| 切回 main 并更新 | `git checkout main && git pull` |

---

## 8. 提交前检查清单

```text
[ ] git status 里没有 .env / node_modules / dist / 临时截图
[ ] 本地能跑：npm run build 通过；后端接口在 /docs 调通
[ ] git diff --check 无冲突残留与行尾空白
[ ] 提交信息符合「类型(范围): 说明」
[ ] 接口或需求有变更时，同一次 PR 带上文档更新
[ ] 没有 AI 署名、没有无关格式化改动
[ ] 分支是从最新 main 开的，且寿命 < 2 周
```

---

## 9. 待补充

后续按需追加：

- [ ] GitHub Actions：前端 `npm run build` + 后端 `pytest` 作为 PR 必过检查（配合 main 的 *Require status checks*）
- [ ] 版本号与 tag 规范（`v0.1.0` / `v0.2.0`，语义化版本）
- [ ] CHANGELOG 生成方式
- [ ] 回滚流程（revert PR / 重新部署上一版本）
- [ ] 加入协作者后把批准数改为 1，并开启 stale review 重置
- [ ] `.gitattributes` 统一换行（当前每次提交都有 LF→CRLF 警告）
