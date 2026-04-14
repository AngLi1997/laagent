from pydantic import BaseModel, Field

from app.database.database_settings import dynamic_str_field


class RecordUserConfigRequest(BaseModel):
    url: str = Field(description="头像路径")


class UserSettings(BaseModel):
    user_id: str | int = dynamic_str_field(description = "user_id")
    icon_url: str | int = dynamic_str_field(description = "头像地址")