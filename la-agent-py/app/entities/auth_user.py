from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import IdType, db


class BaAuthUser(db.Model):
    __tablename__ = 'ba_auth_user'
    __table_args__ = {'extend_existing': True}

    id: Mapped[str] = mapped_column(IdType, primary_key=True)
    user_name: Mapped[str] = mapped_column(String(64), nullable=False, comment='用户名称')
    login_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, comment='登录名')
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False, comment='密码哈希')
    active_status: Mapped[int] = mapped_column(Integer, nullable=False, default=1, comment='激活状态')
    state: Mapped[int] = mapped_column(Integer, nullable=False, default=1, comment='状态')
    signature_password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True, comment='签名密码哈希')
