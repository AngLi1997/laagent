from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.constants.enums.tool_enum import ToolType
from app.database.database_settings import Base, db


class BaTool(db.Model, Base):
    __tablename__ = 'ba_tool'
    __table_args__ = {'extend_existing': True}
    name: Mapped[str] = mapped_column(String,comment="工具名称")
    type: Mapped[ToolType] = mapped_column(comment="工具类型")
    description: Mapped[str] = mapped_column(String,comment="工具描述")
    attribute: Mapped[str] = mapped_column(String,comment="属性")

    def __init__(self, name, type, description, attribute):
        super().__init__()
        self.name = name
        self.type = type
        self.description = description
        self.attribute = attribute

    def __repr__(self):
        return f"<BaTool(name={self.name}, type={self.type}, description={self.description}, attribute={self.attribute})>"
