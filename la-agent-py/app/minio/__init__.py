# -*- coding: utf-8 -*-
# @Time    : 2025/3/31 16:26
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm
import os
import random
from tempfile import NamedTemporaryFile

import requests
from flask_openapi3 import FileStorage
from loguru import logger
from minio import Minio

from app.utils.file_util import get_size_of_storage_file
from app.utils.snowflake import snowflake
from app.exception.exception_handler import BmosException

DEFAULT_DIR = "default_images/"

class MinioClient(Minio):

    def __init__(self, endpoint: str, access_key: str, secret_key: str, bucket_name: str, secure: bool = False):
        self.endpoint = endpoint
        self.access_key = access_key
        self.secret_key = secret_key
        self.bucket_name = bucket_name
        super().__init__(endpoint, access_key, secret_key, secure=secure)

    def check_bucket_exist(self) -> bool:
        """检查桶是否存在"""
        return self.bucket_exists(self.bucket_name)

    def create_bucket(self):
        """创建桶"""
        self.make_bucket(self.bucket_name)

        # 设置桶权限
        policy = """
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Action": [
                        "s3:GetBucketLocation",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        "arn:aws:s3:::%s"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Resource": [
                        "arn:aws:s3:::%s/*"
                    ]
                }
            ]
        }
        """ % (self.bucket_name, self.bucket_name)
        self.set_bucket_policy(self.bucket_name, policy)

    def upload_file(self, file_path: str, path_name: str) -> str:
        """
        上传文件
        :param file_path: 上传文件path
        :param path_name: minio存储路径
        :return: 文件url
        """
        if not self.check_bucket_exist():
            self.create_bucket()
        result = self.fput_object(self.bucket_name, _generate_minio_path(path_name), file_path)
        # 返回minio文件url
        return f'http://{self.endpoint}/{result.bucket_name}/{snowflake.generate_id()}_{result.object_name}'

    def upload_file_storage(self, file_storage: FileStorage, path_name: str) -> str:
        """
        上传文件流
        :param file_storage: file_storage对象
        :param path_name: minio存储路径
        :return: 文件url
        """
        if not self.check_bucket_exist():
            self.create_bucket()
        size = get_size_of_storage_file(file_storage)
        result = self.put_object(self.bucket_name, _generate_minio_path(path_name), file_storage.stream, size, file_storage.content_type)
        return f'http://{self.endpoint}/{result.bucket_name}/{result.object_name}'

    def get_random_default_image(self) -> str:
        """
            从Minio默认目录随机获取一张图片URL
        """
        objects = self.list_objects(bucket_name=self.bucket_name, prefix=DEFAULT_DIR, recursive=True)

        # 过滤有效图片文件
        image_files = [
            obj.object_name for obj in objects
            if obj.object_name.lower().endswith(('.png', '.jpg', '.jpeg'))
        ]
        # 随机选择
        selected_image = random.choice(image_files)

        # 生成访问URL
        return self.presigned_get_object(bucket_name=self.bucket_name, object_name=selected_image).split("?")[0]

    @staticmethod
    def download_file_storage(url: str, tmp: NamedTemporaryFile):
        response = requests.get(url)
        if response.status_code == 200:
            tmp.write(response.content)
        logger.info(f'下载文件 {url} -> {tmp.name}')



def _generate_minio_path(origin_path: str) -> str:
    """配合雪花id生成minio存储路径 防止同名文件被覆盖"""
    path, name = os.path.split(origin_path.strip())
    if not path:
        return f'{snowflake.generate_id()}_{name}'
    return f'{path}/{snowflake.generate_id()}_{name}'


class DisabledMinioClient:
    def __getattr__(self, _name):
        raise BmosException('当前环境未启用 MinIO，请在配置中开启后重试')
