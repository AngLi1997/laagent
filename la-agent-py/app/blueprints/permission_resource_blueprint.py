from flask_openapi3 import Tag, APIBlueprint

from app.app_init import app
from app.entities.permission_resource import BaResources
from app.models.common.resp import Resp
from app.models.permission_resource import ResourcesCreateDTO, ResourcePath

resource_tag = Tag(name='数据权限')
resource_bp = APIBlueprint('resource', __name__, url_prefix='/resource')

@resource_bp.post('/create', tags=[resource_tag], description='创建数据权限', responses={200: Resp})
def save_resources_permission(body: ResourcesCreateDTO):
    resources = []
    # 删除旧的数据权限
    BaResources.query.filter_by(resource_id=body.resource_id).delete()
    for dept_id in body.dept_ids:
        resources.append(BaResources(dept_id=dept_id, resource_id=body.resource_id))
    with app.db.auto_commit_db():
        app.db.session.bulk_save_objects(resources)
    return Resp.success()

@resource_bp.get('/get/<int:resource_id>', tags=[resource_tag], description='获取数据权限', responses={200: Resp[list[str]]})
def get_resource(path: ResourcePath):
    resources = BaResources.query.filter_by(resource_id=path.resource_id).all()
    if not resources:
        return Resp.success([])
    return Resp.success([str(resource.dept_id) for resource in resources])