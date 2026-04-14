from enum import Enum


class MessageType(str, Enum):
    HUMAN = "HUMAN"
    AI = "AI"
    TOOL = "TOOL"