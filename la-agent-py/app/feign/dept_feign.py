from ldj.feign.decorator.Api import Api
from ldj.feign.decorator.Feign import Feign
from ldj.feign.enums.Method import Method

from app.feign.feign_interceptor import FeignUserInterceptor
from app.models.common.resp import Resp


@Feign(prefix="/api/app/platform/dept", serviceId="bmos-platform-service", name="部门管理", interceptor=FeignUserInterceptor())
class DeptFeign:

    """获取当前登陆人的部门id"""
    @Api(method=Method.GET, uri="/id", name="获取当前登陆人的部门id以及其所在的上级部门")
    def get_dept_ids(self) -> Resp: ...

    """查询当前用户所在的部门信息"""
    @Api(method=Method.GET, uri="/mine/id", name="查询当前用户所在的部门信息")
    def mine_dept_ids(self) -> Resp: ...
