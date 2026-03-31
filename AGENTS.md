# Repository Guidelines

## 项目结构与模块组织
本仓库是一个基于 Java 17 的 Spring Boot 服务。业务代码位于 `src/main/java/com/liang/laagent`，当前按职责分为 `controller` 与 `service` 两层；应用入口是 `LaagentApplication`。运行配置放在 `src/main/resources/application.yaml`，目前包含 Ollama 模型地址与模型名。测试代码位于 `src/test/java/com/liang/laagent`。`target/` 为构建产物目录，不应手动编辑。

## 构建、测试与开发命令

使用命令`jdk17`可以切换环境为`jdk17`

优先使用 Maven Wrapper，避免依赖本机 Maven 版本差异。

- `./mvnw spring-boot:run`：本地启动服务。
- `./mvnw test`：运行 JUnit 测试。
- `./mvnw clean package`：清理并打包可执行 Jar。
- `./mvnw clean verify`：执行完整校验，适合作为提交前检查。

启动前确认本地 Ollama 可用，并与 `application.yaml` 中的 `base-url`、`model-name` 保持一致。

## 编码风格与命名约定
遵循 Spring Boot 默认 Java 风格：4 空格缩进，类名使用 `PascalCase`，方法和变量使用 `camelCase`，包名全小写。控制器放在 `controller`，AI 服务接口放在 `service`。REST 路径保持简洁，例如 `/chat`。新增配置优先写入 `application.yaml`，键名按层级对齐，不要混用制表符。

## 测试规范
当前测试框架为 JUnit 5 与 `spring-boot-starter-test`。测试类命名使用 `*Tests`，与被测模块保持邻近目录结构。至少覆盖两类场景：Spring 上下文能否启动，以及控制器或服务的关键行为。运行示例：`./mvnw test`。

## 提交与 Pull Request 规范
当前目录未包含 `.git` 元数据，无法从历史中提炼既有提交风格；建议统一采用简洁祈使句，例如 `feat: add chat validation`、`fix: handle empty message`。PR 应说明变更目的、影响范围、配置变更，以及本地验证方式；若接口行为变更，附上示例请求与响应。

## 配置与安全提示
不要将真实密钥或私有模型地址硬编码进源码。若后续接入外部模型服务，优先通过环境变量或外部配置覆盖 `application.yaml`。提交前确认未误提交 `target/` 产物和本地调试配置。
