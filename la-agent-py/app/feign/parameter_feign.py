from ldj.feign.decorator.Api import Api
from ldj.feign.decorator.Feign import Feign
from ldj.feign.enums.Method import Method

from app.feign.feign_interceptor import FeignNoAuthUserInterceptor
from app.models.common.resp import Resp


@Feign(prefix="/api/app/platform/business/parameter/feign", serviceId="bmos-platform-service", name="平台配置", interceptor=FeignNoAuthUserInterceptor())
class BusinessParameterFeign:

    @Api(method=Method.GET, uri="/detailByCode", name="根据编码获取查询参数")
    def detail_by_code(self, code: str) -> Resp:...