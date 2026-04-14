# -*- coding: utf-8 -*-
# @Time    : 2025/4/8 15:40
# @Author  : liang
# @FileName: naocs.py.py
# @Software: PyCharm

"""
    run:
    celery -A app.celery worker -l INFO --pool=solo
"""

from celery import Celery, Task

from config import Config

celery = Celery('celery', broker=Config.REDIS_URL, include=['app.celery.celery_tasks'])

# 序列化使用pickle

celery.conf.update(
    accept_content = ['pickle'],
    task_serializer = 'pickle',
    result_serializer = 'pickle',
)

class ContextTask(Task):

    def __call__(self, *args, **kwargs):
        from app.app_init import app
        with app.app_context():
            return self.run(*args, **kwargs)

setattr(celery, 'Task', ContextTask)
# celery.Task = ContextTask