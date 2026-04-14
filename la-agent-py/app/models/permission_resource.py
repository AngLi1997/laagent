from pydantic import BaseModel, Field


class ResourcesCreateDTO(BaseModel):
    """创建数据权限DTO"""

    dept_ids: list[int | str] = Field(description="部门id集合")
    """部门id集合"""

    resource_id: int | str = Field(description="资源id")
    """资源id"""

class ResourcePath(BaseModel):
    """数据权限在url上的资源Path"""

    resource_id: int | str = Field(description="资源id")
    """资源id"""