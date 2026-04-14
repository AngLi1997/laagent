from sqlalchemy import String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import db


class BaUserConfig(db.Model):
    __tablename__ = 'ba_user_config'
    __table_args__ = {'extend_existing': True}
    user_id: Mapped[int] = mapped_column(BigInteger,comment="用户id",primary_key=True)
    icon_url: Mapped[str] = mapped_column(String,comment="头像地址")

    def __init__(self, icon_url,user_id):
        super().__init__()
        self.icon_url = icon_url
        self.user_id = user_id
