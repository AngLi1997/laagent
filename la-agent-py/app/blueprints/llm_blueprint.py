import json

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint

from app.app_init import app
from app.constants.constants.bable_constants import TRANSLATIONS
from app.entities.llm import BaLLM
from app.exception.exception_handler import BmosException
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.llm import ModelQueryResponse, ModelQueryRequest, ModelRequest
from app.utils import user_util

models_tag = Tag(name='模型配置接口')
models_bp = APIBlueprint('models', __name__, url_prefix='/models')

@models_bp.post('/create', summary="新增模型配置", tags=[models_tag], responses={200: Resp})
def create_model(body: ModelRequest):
    db_model = BaLLM.query.filter_by(name=body.name).first()
    if db_model is not None:
        return Resp.error(_(TRANSLATIONS['name_exist']))

    model = BaLLM(
        name=body.name,
        version=body.version,
        description=body.description,
        argument=body.args,
        temperature=_normalize_temperature(body.temperature),
        url=body.url,
        api_key=body.api_key,
        key_type=body.key_type
    )
    with app.db.auto_commit_db():
        app.db.session.add(model)
    return Resp.success(model.id)

@models_bp.post('/query', summary="分页查询列表", tags=[models_tag], responses={200: Resp[PageResponse[ModelQueryResponse]]})
def query_models(body: ModelQueryRequest):
    # 构建基础查询
    query = BaLLM.query

    if body.name:
        query = query.filter(BaLLM.name.like(f"%{body.name}%"))

    pagination = query.paginate(
        page=body.page_num,
        per_page=body.page_size,
        error_out=False
    )

    pagination.items = [
        ModelQueryResponse(
            id=model.id,
            name=model.name,
            version=model.version,
            description=model.description,
            args=model.args,
            temperature=_display_temperature(model.temperature),
            update_time=model.update_time,
            update_user=user_util.get_user_name(model.update_user),
            url=model.url,
            type=model.key_type
        )
        for model in pagination.items
    ]

    # 构造返回结果
    return Resp.success(data=PageResponse(pagination))

def _normalize_temperature(temperature: float | str | dict):
    if isinstance(temperature, dict):
        return json.dumps(temperature, ensure_ascii=False)
    if isinstance(temperature, int | float):
        return json.dumps({'temperature': temperature}, ensure_ascii=False)
    if isinstance(temperature, str):
        temp_str = temperature.strip()
        if not temp_str:
            raise BmosException('创造力不能为空')
        try:
            parsed = json.loads(temp_str)
            if isinstance(parsed, int | float):
                return json.dumps({'temperature': parsed}, ensure_ascii=False)
            if isinstance(parsed, dict):
                return json.dumps(parsed, ensure_ascii=False)
        except json.JSONDecodeError:
            try:
                parsed_float = float(temp_str)
                return json.dumps({'temperature': parsed_float}, ensure_ascii=False)
            except ValueError:
                pass
    raise BmosException('创造力配置格式错误')

def _display_temperature(temperature: str):
    if not temperature:
        return ''
    try:
        parsed = json.loads(temperature)
        if isinstance(parsed, dict):
            return str(parsed.get('temperature', temperature))
        return str(parsed)
    except Exception:
        return temperature
