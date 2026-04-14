import requests
from flask import g
from ldj.feign.enums.Method import Method
from ldj.feign.interceptor.Interceptor import Interceptor, ProcessRequest

from app.models.common.resp import Resp


class FeignUserInterceptor(Interceptor):
    def encode(self, method: Method, headers: dict = None,
               params: dict = None, body: dict = None,
               data: object = None) -> ProcessRequest:
        user = g.login_user
        if user is not None:
            headers["Content-Type"] = "application/json;charset=UTF-8"
            headers["bmos-access-token"] = user.token
        pr = ProcessRequest()
        pr.method = method
        pr.headers = headers
        pr.params = params
        pr.body = body
        pr.data = data
        return pr

    def decode(self, resp: requests.Response) -> Resp:
        return Resp(**resp.json())

class FeignNoAuthUserInterceptor(Interceptor):

    def encode(self, method: Method, headers: dict = None,
               params: dict = None, body: dict = None,
               data: object = None) -> ProcessRequest:
        pr = ProcessRequest()
        pr.method = method
        pr.headers = headers
        pr.params = params
        pr.body = body
        pr.data = data
        return pr

    def decode(self, resp: requests.Response) -> Resp:
        return Resp(**resp.json())