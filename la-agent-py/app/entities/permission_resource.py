from sqlalchemy import BigInteger, PrimaryKeyConstraint
from sqlalchemy.orm import mapped_column, Mapped

from app.database.database_settings import db


class BaResources(db.Model):
    """数据权限表"""

    __tablename__ = 'ba_resources'


    resource_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=False, comment='资源ID')
    dept_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, comment='部门ID')

    __table_args__ = (
        PrimaryKeyConstraint('resource_id', 'dept_id'),
        {'extend_existing': True}# 指定 resource_id 和 dept_id 为组合主键
    )

    def __init__(self, dept_id, resource_id):
        self.dept_id = dept_id
        self.resource_id = resource_id
