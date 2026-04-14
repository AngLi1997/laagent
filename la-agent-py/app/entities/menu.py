from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import Base, db


class BaMenu(Base, db.Model):
    __tablename__ = 'ba_menu'
    __table_args__ = {'extend_existing': True}

    code: Mapped[int] = mapped_column(Integer, unique=True, nullable=False, index=True, comment='归一化菜单编码，从1开始递增')
    menu_key: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True, comment='兼容前端的菜单标识')
    parent_menu_key: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True, comment='父级菜单标识')
    name: Mapped[str] = mapped_column(String(128), nullable=False, comment='菜单名称')
    menu_type: Mapped[str] = mapped_column(String(16), nullable=False, default='MENU', comment='菜单类型: ROOT/MENU/PAGE/FUNC')
    path: Mapped[str | None] = mapped_column(String(255), nullable=True, comment='路由路径')
    component: Mapped[str | None] = mapped_column(String(255), nullable=True, comment='组件路径')
    icon: Mapped[str | None] = mapped_column(String(128), nullable=True, comment='图标')
    sort_no: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment='排序号')
    terminal_type: Mapped[int] = mapped_column(Integer, nullable=False, default=1, comment='终端类型')
    is_outside: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment='是否外链')
    hidden: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment='是否隐藏')
    enabled: Mapped[int] = mapped_column(Integer, nullable=False, default=1, comment='是否启用')
    remark: Mapped[str | None] = mapped_column(Text, nullable=True, comment='备注')
