from pydantic import BaseModel, Field

from app.database.database_settings import dynamic_str_field


class LoginRequest(BaseModel):
    login_name: str = Field(alias='loginName', description='登录名')
    password: str = Field(description='密码')


class ChangePasswordRequest(BaseModel):
    old_password: str | None = Field(default=None, alias='oldPassword', description='旧密码')
    new_password: str | None = Field(default=None, alias='newPassword', description='新密码')
    login_name: str | None = Field(default=None, alias='loginName', description='登录名')
    login_password: str | None = Field(default=None, alias='loginPassword', description='登录密码')
    signature_password: str | None = Field(default=None, alias='signaturePassword', description='签名密码')


class UserLoginResponse(BaseModel):
    user_id: str = Field(alias='userId')
    user_name: str = Field(alias='userName')
    login_name: str = Field(alias='loginName')
    token: str
    active_status: int = Field(default=1, alias='activeStatus')
    state: int = 1
    remind_expire: bool = Field(default=False, alias='remindExpire')


class ParameterResponse(BaseModel):
    code: str
    value: str


class UserUpdateRequest(BaseModel):
    user_id: str | int | None = dynamic_str_field(default=None, description='用户id')
