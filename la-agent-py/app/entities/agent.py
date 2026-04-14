from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.constants.enums.common_enum import EnableStatus
from app.database.database_settings import Base, IdType, db


class BaAgent(db.Model, Base):
    __tablename__ = 'ba_agent'
    __table_args__ = {'extend_existing': True}

    name: Mapped[str] = mapped_column(String,comment="应用名称")
    description: Mapped[str] = mapped_column(String,comment="应用描述")
    category_id: Mapped[int] = mapped_column(IdType,comment="分类id")
    status: Mapped[EnableStatus] = mapped_column(comment="启停")
    args: Mapped[str] = mapped_column(String,comment="智能体配置参数")
    icon_url: Mapped[str] = mapped_column(String,comment="智能体图标")

    def __init__(self, name, category_id, description, status, argument, icon_url):
        super().__init__()
        self.name = name
        self.category_id = category_id
        self.description = description
        self.status = status
        self.args = argument
        self.icon_url = icon_url

    def __repr__(self):
        return f"<BaAgent(name={self.name}, category_id={self.category_id}, description={self.description}, status={self.status}, args={self.args}, icon_url={self.icon_url})>"

class BaAgentCategory(db.Model, Base):
    __tablename__ = 'ba_agent_category'
    __table_args__ = {'extend_existing': True}

    name: Mapped[str] = mapped_column(String,comment="智能体分类名称")
    parent_id: Mapped[str] = mapped_column(IdType,comment="父分类id")

    def __init__(self, name, parent_id):
        super().__init__()
        self.name = name
        self.parent_id = parent_id


    @classmethod
    def get_all_children(cls,parent_id: str) -> list["BaAgentCategory"]:
        if parent_id is None:
            return BaAgentCategory.query.all()
        # 定义初始查询（起始节点）
        initial_query = db.session.query(
            BaAgentCategory.id,
            BaAgentCategory.parent_id,
            BaAgentCategory.name
        ).filter(BaAgentCategory.id == parent_id).cte(name='recursive_cte', recursive=True)

        # 定义递归部分
        from sqlalchemy.orm import aliased
        parent_alias = aliased(initial_query, name='parent')
        child_alias = aliased(BaAgentCategory, name='child')

        recursive_query = initial_query.union_all(
            db.session.query(
                child_alias.id,
                child_alias.parent_id,
                child_alias.name
                # 通过 parent_id 关联
            ).filter(child_alias.parent_id == parent_alias.c.id)
        )
        return db.session.query(recursive_query).all()
