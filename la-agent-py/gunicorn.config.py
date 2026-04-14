# -*- coding: utf-8 -*-
# @Time    : 2025/4/15 11:38
# @Author  : liang
# @FileName: gunicorn.config.py
# @Software: PyCharm
"""gunicorn配置"""
import os

from config import Config

bind=f"0.0.0.0:{Config.PORT}"
workers=int(os.getenv('GUNICORN_WORKERS', '2'))
threads=int(os.getenv('GUNICORN_THREADS', '4'))
# 每个工作进程的协程数量
worker_connections = 1000
# 保持连接数
keepalive = 2
# 超时时间(秒)
timeout = 120
# 最大并发请求数
max_requests = 1000
max_requests_jitter = 50
preload_app=True
proc_name='la-agent-py'
