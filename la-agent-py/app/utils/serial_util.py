# -*- coding: utf-8 -*-
# @Time    : 2025/4/3 15:34
# @Author  : liang
# @FileName: serial_util.py
# @Software: PyCharm

"""流水号生成器"""

def generate_serial(prefix: str, length: int = 8) -> str:
    """
    生成流水号
    :param prefix: 流水号前缀
    :param length: 流水号长度
    :return: 流水号
    """
    import random
    import string
    return prefix + ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))