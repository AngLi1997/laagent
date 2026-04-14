from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.constants.enums.llm_enum import KeyTypeEnum
from app.database.database_settings import Base, db


class BaLLM(db.Model, Base):
    __tablename__ = 'ba_llm'
    __table_args__ = {'extend_existing': True}
    name: Mapped[str] = mapped_column(String, comment="模型名称")
    version: Mapped[str] = mapped_column(String, comment="模型版本")
    description: Mapped[str] = mapped_column(String, comment="模型描述")
    args: Mapped[str] = mapped_column(String, comment="参数大小")
    temperature: Mapped[str] = mapped_column(String, comment="创造力")
    url: Mapped[str] = mapped_column(String, comment="模型地址")
    api_key: Mapped[str] = mapped_column(String, comment="链接密钥")
    key_type: Mapped[KeyTypeEnum] = mapped_column(comment="密钥类型")


    def __init__(self, name, version, description, argument, temperature, url, api_key, key_type, *arg, **kwargs):
        super().__init__(*arg, **kwargs)
        self.name = name
        self.version = version
        self.description = description
        self.args = argument
        self.temperature = temperature
        self.url = url
        self.api_key = api_key
        self.key_type = key_type
