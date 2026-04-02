# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 技术栈

- Java 17 + Spring Boot 3.5.x
- LangChain4j 1.12.2-beta22（Ollama 集成、Spring Boot Starter、Reactor 流式支持）
- 前端：原生 HTML/CSS/JS（静态资源托管于 Spring Boot）

## 常用命令

切换 JDK 环境：
```
jdk17
```

优先使用 Maven Wrapper：
```bash
./mvnw spring-boot:run       # 本地启动
./mvnw test                  # 运行测试
./mvnw clean package         # 打包可执行 Jar
./mvnw clean verify          # 完整校验（提交前使用）
```

运行单个测试类：
```bash
./mvnw test -Dtest=LaagentApplicationTests
```

## 架构概览

```
controller/ChatController   ← GET /chat?memoryId=&message=  返回 SSE 流
service/Assistant           ← LangChain4j @AiService 接口，绑定 Ollama 流式模型
config/AgentConfig          ← 注册 ChatMemoryProvider（InMemory，每会话最多 10 条消息）
```

**请求流程**：前端通过 `EventSource` 连接 `/chat`，Controller 调用 `Assistant.chat(memoryId, message)`，LangChain4j 将请求转发至本地 Ollama，以 `Flux<String>` 形式流式返回 token，最终以 SSE 推送给浏览器。

**会话记忆**：`memoryId` 由前端生成并随每次请求携带，服务端以此为 key 在内存中维护对话历史（重启后清空）。

## 配置

`application.yaml` 中的关键配置：
- `langchain4j.ollama.streaming-chat-model.base-url`：Ollama 服务地址（默认 `http://localhost:11434`）
- `langchain4j.ollama.streaming-chat-model.model-name`：使用的模型名称

启动前确认本地 Ollama 已运行，且模型名与配置一致。

## 编码约定

- 4 空格缩进，类名 `PascalCase`，方法/变量 `camelCase`，包名全小写
- 新增 AI 服务接口放 `service`，HTTP 入口放 `controller`，Bean 配置放 `config`
- 新增配置写入 `application.yaml`，键名按层级对齐
