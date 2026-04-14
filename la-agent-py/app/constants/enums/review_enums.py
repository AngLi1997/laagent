from enum import Enum

class HandleMethodEnum(str, Enum):
    """
    处理方式
    """

    STRAIGHT_ANSWER = "STRAIGHT_ANSWER"
    """直接回答"""

    FUZZY_COVER = "FUZZY_COVER"
    """模糊覆盖"""