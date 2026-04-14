# Repository Guidelines

## Project Structure & Module Organization
本仓库主要代码位于 `la-agent-web/`，采用 `pnpm workspace` 管理多应用与共享包。`apps/chat-web` 是 React + Vite 聊天端，`apps/admin-web` 是 Vue 3 + Vite 管理端，`apps/mobileApp` 是 React Native 客户端。公共能力放在 `packages/`，如 `axios`、`components`、`i18n`、`utils`；说明文档放在 `docs/`。新增模块时，优先复用 `packages/*`，避免在应用内重复实现。

## Build, Test, and Development Commands
在 `la-agent-web/` 下执行命令：

- `pnpm i`：安装整个 monorepo 依赖。
- `pnpm dev`：启动全部应用开发模式。
- `pnpm dev:chat` / `pnpm dev:ai`：只启动单个 Web 应用。
- `pnpm build`：构建 `apps/*` 下目标应用。
- `pnpm app`：启动 React Native Metro。
- `pnpm android`：运行 Android 调试包。
- `pnpm lint` / `pnpm lint:fix`：运行 ESLint 检查并修复。
- `pnpm --filter mobileApp test`：执行移动端 Jest 测试。

## Coding Style & Naming Conventions
默认使用 TypeScript，统一 2 空格缩进、单引号、保留分号，规则来自 `eslint.config.mjs`。React/Vue 组件文件使用 `PascalCase`，hooks 使用 `useXxx`，工具模块使用语义化小写命名。页面、路由、store、services 按应用内现有结构归类；共享包导出应保持稳定，避免跨应用直接引用深层私有文件。

## Testing Guidelines
当前仓库自动化测试主要在 `apps/mobileApp/__tests__/`，框架为 Jest，建议测试文件使用 `*.test.tsx` 命名。Web 应用提交前至少执行 `pnpm lint` 和受影响应用的构建命令；涉及移动端改动时，再补充 `pnpm --filter mobileApp test`。新功能应优先补充关键路径测试，至少覆盖渲染、交互和回归场景。

## Change Scope & Architecture Notes
这是一个多端共享代码仓库，修改前先确认变更应落在 `apps/*` 还是 `packages/*`。通用 API 封装、国际化、基础组件和工具函数应优先沉淀到共享包；仅在端特有的页面、路由和交互逻辑中保留应用级实现。涉及接口或共享类型变更时，同步检查 `chat-web`、`admin-web` 与 `mobileApp` 的兼容性。

## Commit & Pull Request Guidelines
当前工作区未包含可读的 Git 历史，无法从 `git log` 提炼既有规范；建议统一使用简短的祈使句提交信息，例如 `feat(chat-web): add history panel`、`fix(mobileApp): handle token refresh`。PR 应说明影响范围、关联模块、验证步骤，并在 UI 变更时附截图或录屏。不要把无关格式化、重命名和功能修改混在同一个 PR。

## Security & Configuration Tips
不要提交 `.env`、密钥或接口凭证。移动端脚本依赖 `ENVFILE`，构建前确认环境文件与目标环境一致。新增依赖时优先使用 `pnpm --filter <package>` 定向安装，避免污染无关应用。

## Local Services For `la-agent-py`
`la-agent-py` 统一使用 `uv` 管理本地 Python 环境。在 [`la-agent-py`](/Users/liang/code/agent/la-agent-py) 下执行：

- `uv sync`：创建或更新 `.venv` 并安装 `pyproject.toml` 依赖。
- `uv run python run.py`：启动 Flask 服务。
- `uv run celery -A app.celery worker -l INFO --pool=solo`：启动 Celery worker。
- `docker compose -f la-agent-py/docker-compose.yml up -d`：启动 PostgreSQL 16、Redis 7 和 pgvector(pg16)。
- `docker compose -f la-agent-py/docker-compose.yml ps`：查看容器状态。
- `docker compose -f la-agent-py/docker-compose.yml down`：停止容器。

数据目录固定挂载到 [`la-agent-py/mount/postgres`](/Users/liang/code/agent/la-agent-py/mount/postgres) 和 [`la-agent-py/mount/redis`](/Users/liang/code/agent/la-agent-py/mount/redis)。镜像统一使用 `docker.1ms.run/*`，并显式指定 `linux/arm64`。
