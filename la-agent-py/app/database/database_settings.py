# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 14:24
# @Author  : liang
# @FileName: database_settings.py
# @Software: PyCharm

"""数据库ORM"""

from contextlib import contextmanager
from datetime import datetime
from typing import Optional, Dict, Any

from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy.query import Query
from flask_sqlalchemy.session import Session
from loguru import logger
from pydantic import Field
from pydantic_core import PydanticUndefined
from referencing._core import _Unset
from sqlalchemy import DateTime, event, BigInteger, TypeDecorator
from sqlalchemy.orm import Mapped, mapped_column, ORMExecuteState, with_loader_criteria
from sqlalchemy.sql._orm_types import SynchronizeSessionArgument
from sqlalchemy_serializer import SerializerMixin

from app.auth.auth_content import get_context_user_id
from app.utils.snowflake import IdUtil


class IdType(TypeDecorator):
    impl = BigInteger
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if not value:
            return None
        # Python → 数据库：将字符串转为整数
        return int(value) if value is not None else None

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        # 数据库 → Python：将整数转为字符串
        return str(value) if value is not None else None
def insert_default():
    return get_context_user_id()

class Base(SerializerMixin):
    """数据库实体抽象基类"""
    id: Mapped[str] = mapped_column(IdType, primary_key=True, autoincrement=True, comment='主键',
                                    insert_default=IdUtil.generate_id)
    create_user: Mapped[str] = mapped_column(IdType, comment='创建人', insert_default=insert_default, nullable=True)
    create_time: Mapped[datetime] = mapped_column(DateTime, comment='创建时间', insert_default=lambda: datetime.now(), nullable=True)
    update_user: Mapped[str] = mapped_column(IdType, comment='更新人', insert_default=insert_default, onupdate= insert_default, nullable=True)
    update_time: Mapped[datetime] = mapped_column(DateTime, comment='更新时间', insert_default=lambda: datetime.now(),
                                                  onupdate=lambda: datetime.now(), nullable=True)
    delete_time: Mapped[datetime] = mapped_column(DateTime, comment='删除时间', nullable=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class BaseQuery(Query):
    """sql查询对象基类"""
    def delete(
            self,
            synchronize_session: SynchronizeSessionArgument = "auto",
            delete_args: Optional[Dict[Any, Any]] = None,
    ) -> int:
        """ 将query.delete修改为update """
        if len(self.column_descriptions) > 0 and not hasattr(self.column_descriptions[0]["entity"], "delete_time"):
            return super().delete(
                synchronize_session=synchronize_session,
            )
        return super().update(
            {"delete_time": datetime.now()},
            synchronize_session=synchronize_session,
            **(delete_args or {}),
        )


@event.listens_for(Session, "do_orm_execute")
def _add_filtering_deleted_at(execute_state: ORMExecuteState):
    """
        过滤逻辑删除的数据 使用以下方法可以获得被软删除的数据
        query.execution_options(include_deleted=True)
    """
    if (execute_state.is_select
            and not execute_state.is_column_load
            and not execute_state.is_relationship_load
            and not execute_state.execution_options.get("include_deleted", False)
    ):
        for desc in execute_state.statement.column_descriptions:
            entity = desc.get("entity")
            if entity and hasattr(entity, "delete_time"):
                execute_state.statement = execute_state.statement.options(
                    with_loader_criteria(
                        entity,
                        lambda cls: cls.delete_time.is_(None),
                        include_aliases=True
                    )
                )


@event.listens_for(Session, 'before_flush')
def _convert_delete_to_update(session, content, instance):
    """将db.delete操作替换为update"""
    for obj in session.deleted:
        if isinstance(obj, Base):
            obj.delete_time = datetime.now()
            # 从删除列表移除
            session.expunge(obj)
            # 自动触发UPDATE
            session.add(obj)


@event.listens_for(Base, 'before_insert')
def set_creator_before_insert(mapper, connection, target):
    if get_context_user_id() and hasattr(target, 'create_user'):
        target.create_user = get_context_user_id()


class BMSQLAlchemy(SQLAlchemy):
    @contextmanager
    def auto_commit_db(self):
        """自动处理事务 异常回滚"""
        try:
            yield
        except Exception as e:
            # 加入数据库commit提交失败，必须回滚！！！
            logger.info('异常，事务回滚')
            self.session.rollback()
            raise e
        else:
            logger.info('自动提交数据库事务')
            self.session.commit()


db = BMSQLAlchemy(query_class=BaseQuery)


def dynamic_str_field(default: Any = PydanticUndefined,
          description: str | None = _Unset):
    """动态字段 使用这个字段可以把int类型强行转化为str类型"""
    return Field(default, description=description, coerce_numbers_to_str=True)

def get_db_session():
    from app.app_init import app
    return app.db.session
