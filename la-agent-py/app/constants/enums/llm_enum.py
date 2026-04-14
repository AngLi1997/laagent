from enum import Enum


class KeyTypeEnum(str, Enum):
    OLLAMA = "OLLAMA"
    OPENAI = "OPENAI"