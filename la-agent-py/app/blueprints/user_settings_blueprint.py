from flask_openapi3 import Tag, APIBlueprint

from app.app_init import app
from app.auth.auth_content import get_context_user, get_context_user_id
from app.entities.user_config import BaUserConfig
from app.models.common.resp import Resp
from app.models.user_config import RecordUserConfigRequest, UserSettings

configs_tag = Tag(name='配置管理接口')
configs_bp = APIBlueprint('config', __name__, url_prefix='/configs')

@configs_bp.post("/record",summary="记录用户配置头像",tags=[configs_tag],responses={200: Resp})
def save_user_icon(body: RecordUserConfigRequest):
    user_id = get_context_user_id()
    with app.db.auto_commit_db():
        BaUserConfig.query.filter_by(user_id=user_id).delete()
        app.db.session.add(BaUserConfig(user_id=user_id,icon_url=body.url))
    return Resp.success()

@configs_bp.get("/user/get",summary="获取当前用户配置",tags=[configs_tag],responses={200: Resp})
def query_user_config():
    user = get_context_user()
    ba_user_config = BaUserConfig.query.filter_by(user_id=user.user_id).first()
    if not ba_user_config:
        return Resp.success()
    return Resp.success(UserSettings(user_id=ba_user_config.user_id,icon_url=ba_user_config.icon_url))