# -*- coding: utf-8 -*-
"""本地配置中心。"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Any

import yaml
from loguru import logger


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG_PATH = BASE_DIR / 'config' / 'local.yaml'
ENV_FILE = BASE_DIR / '.env'
LOG_DIR = BASE_DIR / 'log'
LOG_DIR.mkdir(parents=True, exist_ok=True)


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _load_yaml(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    with path.open('r', encoding='utf-8') as file:
        return yaml.safe_load(file) or {}


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return
    with path.open('r', encoding='utf-8') as file:
        for raw_line in file:
            line = raw_line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


_load_env_file(ENV_FILE)


parser = argparse.ArgumentParser(description='本地启动参数')
parser.add_argument('--config', type=str, required=False, help='本地配置文件路径')
parser.add_argument('--port', type=int, required=False, help='服务端口号')
args, _unknown = parser.parse_known_args()

config_path = Path(os.getenv('CONFIG_FILE') or args.config or DEFAULT_CONFIG_PATH).resolve()
file_config = _load_yaml(config_path)


class Config:
    DEBUG = False
    SECRET_KEY = 'BMOS'
    PORT = 60400
    SQLALCHEMY_DATABASE_URI = 'postgresql://bmos:bmos@127.0.0.1:5432/la-agent-py'
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_POOL_SIZE = 20
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = 'redis://127.0.0.1:6379/0'
    OLLAMA_BASE_URL = 'http://127.0.0.1:11434'
    IGNORE_URL = [
        r'^/openapi/.*',
        r'^/api/app/agent/auth/login$',
        r'^/api/app/platform/user/login$',
        r'^/api/app/agent/auth/health$',
        r'^/api/app/platform/i18n/config$',
    ]
    ALLOW_ANONYMITY = False
    AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 12
    AUTO_CREATE_TABLES = True
    MINIO_ENABLED = False
    MINIO_ENDPOINT = '127.0.0.1:9000'
    MINIO_ACCESS_KEY = 'minioadmin'
    MINIO_SECRET_KEY = 'minioadmin'
    MINIO_BUCKET_NAME = 'bmos-agent'
    VECTOR_STORE_ENABLED = True
    PARAMETERS = {
        'platform.sys.web-lock-screen-time': '30',
        'platform.sys.web-lock-screen-hotkey': '["Ctrl","Q"]',
        'platform.sys.language': '{"中文":"zh_CN","English":"en_US","Русский":"ru_RU"}',
        'platform.sys.outside_url': '{}',
    }


yaml_config = _deep_merge(
    {
        'server': {'port': Config.PORT, 'debug': Config.DEBUG, 'secret_key': Config.SECRET_KEY},
        'database': {
            'uri': Config.SQLALCHEMY_DATABASE_URI,
            'echo': Config.SQLALCHEMY_ECHO,
            'pool_size': Config.SQLALCHEMY_POOL_SIZE,
        },
        'redis': {'url': Config.REDIS_URL},
        'auth': {
            'ignore_url': Config.IGNORE_URL,
            'allow_anonymity': Config.ALLOW_ANONYMITY,
            'token_ttl_seconds': Config.AUTH_TOKEN_TTL_SECONDS,
        },
        'storage': {
            'minio': {
                'enabled': Config.MINIO_ENABLED,
                'endpoint': Config.MINIO_ENDPOINT,
                'access_key': Config.MINIO_ACCESS_KEY,
                'secret_key': Config.MINIO_SECRET_KEY,
                'bucket_name': Config.MINIO_BUCKET_NAME,
            },
        },
        'features': {
            'auto_create_tables': Config.AUTO_CREATE_TABLES,
            'vector_store_enabled': Config.VECTOR_STORE_ENABLED,
        },
        'llm': {'ollama_base_url': Config.OLLAMA_BASE_URL},
        'parameters': Config.PARAMETERS,
    },
    file_config,
)

Config.DEBUG = bool(yaml_config['server'].get('debug', False))
Config.SECRET_KEY = yaml_config['server'].get('secret_key', Config.SECRET_KEY)
Config.PORT = int(os.getenv('PORT') or args.port or yaml_config['server'].get('port', Config.PORT))
Config.SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI') or yaml_config['database'].get('uri', Config.SQLALCHEMY_DATABASE_URI)
Config.SQLALCHEMY_ECHO = str(os.getenv('SQLALCHEMY_ECHO') or yaml_config['database'].get('echo', Config.SQLALCHEMY_ECHO)).lower() == 'true'
Config.SQLALCHEMY_POOL_SIZE = int(os.getenv('SQLALCHEMY_POOL_SIZE') or yaml_config['database'].get('pool_size', Config.SQLALCHEMY_POOL_SIZE))
Config.REDIS_URL = os.getenv('REDIS_URL') or yaml_config['redis'].get('url', Config.REDIS_URL)
Config.OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL') or yaml_config['llm'].get('ollama_base_url', Config.OLLAMA_BASE_URL)
Config.IGNORE_URL = list(yaml_config['auth'].get('ignore_url', Config.IGNORE_URL))
Config.ALLOW_ANONYMITY = str(os.getenv('ALLOW_ANONYMITY') or yaml_config['auth'].get('allow_anonymity', Config.ALLOW_ANONYMITY)).lower() == 'true'
Config.AUTH_TOKEN_TTL_SECONDS = int(os.getenv('AUTH_TOKEN_TTL_SECONDS') or yaml_config['auth'].get('token_ttl_seconds', Config.AUTH_TOKEN_TTL_SECONDS))
Config.AUTO_CREATE_TABLES = str(os.getenv('AUTO_CREATE_TABLES') or yaml_config['features'].get('auto_create_tables', True)).lower() == 'true'
Config.VECTOR_STORE_ENABLED = str(os.getenv('VECTOR_STORE_ENABLED') or yaml_config['features'].get('vector_store_enabled', True)).lower() == 'true'
Config.MINIO_ENABLED = str(os.getenv('MINIO_ENABLED') or yaml_config['storage']['minio'].get('enabled', False)).lower() == 'true'
Config.MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT') or yaml_config['storage']['minio'].get('endpoint', Config.MINIO_ENDPOINT)
Config.MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY') or yaml_config['storage']['minio'].get('access_key', Config.MINIO_ACCESS_KEY)
Config.MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY') or yaml_config['storage']['minio'].get('secret_key', Config.MINIO_SECRET_KEY)
Config.MINIO_BUCKET_NAME = os.getenv('MINIO_BUCKET_NAME') or yaml_config['storage']['minio'].get('bucket_name', Config.MINIO_BUCKET_NAME)
Config.PARAMETERS = yaml_config.get('parameters', Config.PARAMETERS)

logger.add(sink=str(LOG_DIR / 'la-agent-py_info.log'), enqueue=True)
logger.add(sink=str(LOG_DIR / 'la-agent-py_error.log'), level='ERROR', enqueue=True)

logger.info(f'[启动参数]配置文件: {config_path}')
logger.info(f'[启动参数]端口号: {Config.PORT}')
logger.info(f'[启动参数]数据库: {Config.SQLALCHEMY_DATABASE_URI}')
logger.info(f'[启动参数]Redis: {Config.REDIS_URL}')
