# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:32
# @Author  : liang
# @FileName: snowflake.py
# @Software: PyCharm

import logging
import time

class SnowflakeGenerator:
    def __init__(self, datacenter_id=0, worker_id=0, epoch=1288834974657):
        # 参数校验
        if datacenter_id < 0 or datacenter_id > 31:
            raise ValueError("Datacenter ID 必须在 0-31 之间")
        if worker_id < 0 or worker_id > 31:
            raise ValueError("Worker ID 必须在 0-31 之间")

        self.datacenter_id = datacenter_id
        self.worker_id = worker_id
        self.epoch = epoch  # Twitter 雪花算法起始时间戳（2010-11-04）
        self.sequence = 0
        self.last_timestamp = -1

    def _current_time(self):
        """获取当前毫秒级时间戳（相对于起始epoch）"""
        return int((time.time() * 1000) - self.epoch)

    def generate_id(self):
        """生成雪花算法ID"""
        timestamp = self._current_time()

        if timestamp < self.last_timestamp:
            logging.error("时钟回拨！当前时间戳 %d 小于上次时间 %d", timestamp, self.last_timestamp)
            raise ValueError("系统时钟回拨异常")

        # 同一毫秒内递增序列号
        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 0xFFF  # 12位序列号最大值4095
            if self.sequence == 0:
                # 序列号耗尽，等待下一毫秒
                timestamp = self._wait_next_millis(self.last_timestamp)
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        # 组合各段二进制值
        return ((timestamp << 22) |
                (self.datacenter_id << 17) |
                (self.worker_id << 12) |
                self.sequence)

    def _wait_next_millis(self, last_timestamp):
        """等待至下一毫秒"""
        timestamp = self._current_time()
        while timestamp <= last_timestamp:
            time.sleep(0.001)
            timestamp = self._current_time()
        return timestamp

    @staticmethod
    def parse_id(snowflake_id, epoch=1288834974657):
        """反解析雪花算法ID"""
        timestamp = (snowflake_id >> 22) + epoch
        datacenter_id = (snowflake_id >> 17) & 0x1F  # 5位掩码
        worker_id = (snowflake_id >> 12) & 0x1F
        sequence = snowflake_id & 0xFFF
        return {
            "timestamp": timestamp / 1000.0,  # 转换为秒
            "datetime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp / 1000)),
            "datacenter": datacenter_id,
            "worker": worker_id,
            "sequence": sequence
        }

snowflake = SnowflakeGenerator()

class IdUtil:
    @classmethod
    def generate_id(cls):
        """生成雪花算法ID"""
        return snowflake.generate_id()