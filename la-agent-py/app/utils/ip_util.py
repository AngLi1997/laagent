# -*- coding: utf-8 -*-
# @Time    : 2025/3/31 11:56
# @Author  : liang
# @FileName: ip_util.py
# @Software: PyCharm
import socket

def get_lan_ip():
    """获取局域网ip"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))
    ip = s.getsockname()[0]
    s.close()
    return ip