# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

全栈 AI Agent 平台，支持多租户、知识库管理、工具编排和实时流式对话。

- `la-agent-web/` — pnpm workspace 前端 monorepo
- `la-agent-py/` — Python Flask + LangGraph 后端

---

## Frontend (la-agent-web)

在 `la-agent-web/` 目录下执行：

```bash
pnpm i                          # 安装依赖
pnpm dev                        # 启动全部应用
pnpm dev:chat                   # 仅启动 chat-web（端口 8083）
pnpm dev:ai                     # 仅启动 admin-web（端口 8084）
pnpm app                        # 启动 React Native Metro
pnpm build                      # 构建全部应用
pnpm lint / pnpm lint:fix       # ESLint 检查/修复
pnpm --filter mobileApp test    # 移动端 Jest 测试
```

### 应用说明

| 应用 | 技术栈 | 用途 |
|------|--------|------|
| `apps/chat-web` | React 19 + Vite | 用户聊天界面，SSE 流式响应 |
| `apps/admin-web` | Vue 3 + Vite | 管理后台，含 AntV X6 流程图编辑器 |
| `apps/mobileApp` | React Native 0.76 | 跨平台移动客户端 |

### 共享包（packages/）

- `@bmos/axios` — 带拦截器的 axios 封装，所有应用统一使用，baseURL 为 `/api/app`
- `@bmos/components` — 基于 Ant Design Vue 的组件库
- `@bmos/i18n` — i18next 多语言封装
- `@bmos/messager` — 事件驱动消息系统
- `@bmos/utils` — 通用工具（加密、日期等）

新增通用能力优先沉淀到 `packages/*`，避免在应用内重复实现。

### 代码规范

- TypeScript，2 空格缩进，单引号，保留分号（见 `eslint.config.mjs`）
- React/Vue 组件文件 `PascalCase`，hooks 用 `useXxx`
- 跨应用变更时同步检查 `chat-web`、`admin-web`、`mobileApp` 兼容性

---

## Backend (la-agent-py)

在 `la-agent-py/` 目录下执行：

```bash
uv sync                                                    # 安装 Python 依赖（Python 3.12）
uv run python run.py                                       # 启动 Flask 开发服务器（端口 60400）
uv run celery -A app.celery worker -l INFO --pool=solo     # 启动 Celery worker

# Docker 服务（PostgreSQL 16、Redis 7、pgvector）
docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml ps
docker compose -f docker-compose.yml down
```

数据挂载目录：`la-agent-py/mount/postgres`、`la-agent-py/mount/redis`。镜像使用 `docker.1ms.run/*`，平台 `linux/arm64`。

### 架构说明

**Flask 应用**（`app/app_init.py`）：OpenAPI 3.0 + Swagger UI（`/openapi/swagger`），CORS 全开，SQLAlchemy + PostgreSQL，Redis 缓存，Minio 文件存储（可选）。

**API Blueprints**（`app/blueprints/`）：15+ 模块，核心端点：
- `POST /api/app/agent/chat/sse/generate` — SSE 流式对话
- `app/blueprints/agent_blueprint.py` — Agent CRUD
- `app/blueprints/document_blueprint.py` — 知识库文档管理
- `app/blueprints/tool_blueprint.py` — 工具/MCP 服务管理

**Agent 编排**（`app/core/agent/`）：
- LangGraph 状态图，支持 `plan_and_execute`、`re_act`、`agent_context` 三种流程
- LLM：ChatOllama / ChatOpenAI
- 工具：REST API 工具、MCP（Model Context Protocol）SSE 工具
- 知识库：sentence-transformers 向量化 + pgvector 检索，相似度阈值 0.85

**异步任务**（`app/celery/`）：Celery + Redis，处理关键词提取、文档向量化等后台任务。

**i18n**：Flask-Babel，翻译文件在 `app/translations/`。

```bash
# 更新翻译
pybabel extract -F babel.cfg -o messages.pot .
pybabel compile -d app/translations
```

---

## 前后端通信

- 所有请求经 `@bmos/axios` 发出，baseURL `/api/app`
- 请求头：`X-Access-Token`（认证令牌）、平台标识、语言偏好
- 响应格式：`{ code, data, message }`
- SSE 消息类型：`TextMessage`、`ToolCallingMessage`、`ToolResultMessage`、`RecommendedQuestionMessage`

---

## 提交规范

使用祈使句，例如：`feat(chat-web): add history panel`、`fix(mobileApp): handle token refresh`。不要将格式化、重命名和功能修改混在同一个 PR。
