# LaAgent(智能体平台)



| 组件              | 应用                     |
| ----------------- |:-----------------------|
| 主开发语言        | Python 3.12.9          |
| 环境管理          | uv                     |
| LLM框架           | langgraph              |
| LLM服务           | Ollama                 |
| web框架           | Flask 3.1.0            |
| 服务发现/配置中心 | Nacos 2.0.3            |
| 持久层框架        | Flask-SQLAlchemy 3.1.1 |
| 主数据库          | PostgreSQL 16.8        |
| 向量数据库        | pgvector               |
| 文件服务器        | minio                  |
| 图数据库          | neo4j 2025.02.0        |
| 消息队列          | redis + celery         |

#### 环境部署
~~~bash
  # 安装 uv
  curl -LsSf https://astral.sh/uv/install.sh | sh

  # 进入项目
  cd la-agent-py

  # 安装 Python 3.12 并同步依赖
  uv python install 3.12
  uv sync
~~~


#### swagger

http://127.0.0.1:8080/openapi/swagger

#### Start
```bash

  # 启动依赖容器
  docker compose -f docker-compose.yml up -d

  # 配置优先级：命令行参数 > Nacos配置 > Config参数
  
  # 无参数启动
  uv run python run.py
  
  或
  
  uv run gunicorn -c gunicorn.config.py run:app
  
  # Celery消息队列worker启动
  uv run celery -A app.celery worker -l INFO --pool=solo
  
  # 或者 执行脚本(包含Flask服务和Celery)
  sh start.sh
``` 

#### flask-babel
```bash
    # 当新增或修改需要翻译文件 按以下顺序执行编译即可
    pybabel extract -F babel.cfg -o messages.pot .
    # 末尾的zh代表翻译的语言种类
    pybabel init -i messages.pot -d translations -l zh
    # 编译语言目录
    pybabel compile -d translations
```
