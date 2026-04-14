# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:33
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm
import asyncio
import json

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint
from loguru import logger
from mcp import ClientSession
from mcp.client.sse import sse_client

from app.app_init import app
from app.blueprints.permission_resource_blueprint import save_resources_permission
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.tool_enum import ToolType
from app.core.agent.tools.api_invoke import execute
from app.core.agent.tools.mcp.mcp_client import McpClient
from app.data_permission.data_perm import data_permission
from app.entities.permission_resource import BaResources
from app.exception.exception_handler import BmosException
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.permission_resource import ResourcesCreateDTO
from app.models.tool import ToolRequest, ToolQueryRequest, \
    ApiRequest, ToolQueryResponse, ToolResponse, ToolJson, McpAttribute, ToolCheckResult, ToolInfo, ToolInvokeRequest
from app.utils import user_util
from app.utils.str_util import string_to_dict

tools_tag = Tag(name='工具接口')
tools_bp = APIBlueprint('tools', __name__, url_prefix='/tools')

@tools_bp.post('/create', summary="新增工具配置", tags=[tools_tag], responses={200: Resp})
def create_tool(body: ToolRequest):
    from app.entities.tool import BaTool
    db_tool = BaTool.query.filter_by(name=body.name).first()
    if db_tool is not None:
        return Resp.error(_(TRANSLATIONS['tool_name_exist']))

    tool = BaTool(name=body.name,type=body.type,description=body.description,attribute=body.attribute)
    with app.db.auto_commit_db():
        app.db.session.add(tool)

    save_resources_permission(ResourcesCreateDTO(dept_ids=body.dept_ids, resource_id=tool.id))
    return Resp.success(tool.id)


@tools_bp.post('/query', summary="分页查询工具列表", tags=[tools_tag], responses={200: Resp[PageResponse[ToolQueryResponse]]})
@data_permission()
def query_tools(body: ToolQueryRequest):
    from app.entities.tool import BaTool
    # 构建基础查询
    query = BaTool.query

    # 添加筛选条件
    if body.name:
        query = query.filter(BaTool.name.like(f"%{body.name}%"))

    # 执行分页查询
    pagination = query.paginate(
        page=body.page_num,
        per_page=body.page_size,
        error_out=False  # 页码超出范围不报错，返回空结果
    )

    pagination.items = [
        ToolQueryResponse(
            id=str(tool.id),
            name=tool.name,
            type=tool.type,
            description=tool.description,
            attribute=tool.attribute,
            update_time=tool.update_time,
            update_user=user_util.get_user_name(tool.update_user)
        )
        for tool in pagination.items
    ]

    # 构造返回结果
    return Resp.success(PageResponse(pagination))


@tools_bp.delete('/remove', summary="根据ID删除工具", tags=[tools_tag], responses={200: Resp})
def delete_tool(body: IdDTO):
    from app.entities.tool import BaTool
    tool = BaTool.query.get(body.id)

    app.db.session.delete(tool)
    app.db.session.commit()
    return Resp.success()


@tools_bp.put('/update', summary="根据ID更新工具", tags=[tools_tag], responses={200: Resp})
def update_tool(body: ToolRequest):
    from app.entities.tool import BaTool
    tool = BaTool.query.get(body.id)
    if not tool:
        return Resp.error(_(TRANSLATIONS['tool_not_exist']))
    if BaTool.query.filter(BaTool.name == body.name, BaTool.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['tool_name_exist']))
    with app.db.auto_commit_db():
        BaTool.query.filter_by(id=body.id).update(
            {"name": body.name, "description": body.description, "type": body.type, "attribute":body.attribute})

    return Resp.success()

@tools_bp.post('/request', summary="调用配置好的REST接口", tags=[tools_tag], responses={200: Resp})
def request(body: ApiRequest):
    return Resp.success(execute(body))

@tools_bp.get("/find",summary="根据id获取工具详情",tags=[tools_tag], responses={200: Resp[ToolResponse]})
def find_tool(query: IdDTO):
    from app.entities.tool import BaTool
    tool = BaTool.query.get(query.id)
    if not tool:
        return Resp.error(message=_(TRANSLATIONS['tool_not_exist']))

    dept_ids = [r.dept_id for r in BaResources.query.filter_by(resource_id=tool.id).all()]
    if tool.type == "REST":
        input_dict = json.loads(tool.attribute)
        api = ApiRequest.model_validate(input_dict)
        return Resp.success(ToolResponse(id=tool.id,name=tool.name,type=tool.type,restAttr=api,description=tool.description,dept_ids=dept_ids))
    elif tool.type == "MCP":
        return Resp.success(ToolResponse(id=tool.id, name=tool.name, type=tool.type, mcpAttr=tool.attribute,description=tool.description,dept_ids=dept_ids))
    else:
        return Resp.fail(_(TRANSLATIONS['tool_type_error']))

@tools_bp.post('/check/mcpserver', summary="检查MCP服务是否正常", tags=[tools_tag])
def check_mcp_server(body: ToolJson):
    try:
        tool_json = body.tool_json.replace('\\', '\\\\')
        tool_dict = json.loads(tool_json)
        mcp_attribute = McpAttribute.model_validate(tool_dict)
        mcp_client = McpClient(mcp_attribute.command, mcp_attribute.args, mcp_attribute.env)
        return Resp.success(ToolCheckResult(check=asyncio.run(mcp_client.check_mcp_server())))
    except Exception as e:
        logger.error('异常捕获器初始化成功', e)
        return Resp.success(ToolCheckResult(check=False))

@tools_bp.post('/test/mcpserver', summary="连接mcp服务端并返回工具列表", tags=[tools_tag])
async def test_mcp_server(body: ToolJson):
    tool_json = body.tool_json.replace('\\', '\\\\')
    tool_dict = extract_mcp_info(tool_json)
    if tool_dict['type'] == 'sse':
        async with sse_client(tool_dict['url']) as streams:
            async with ClientSession(streams[0], streams[1]) as session:
                await session.initialize()
                response = await session.list_tools()
                tools = response.tools
                return Resp.success({"tools": _transform_tools_json(tools)})
    else:
        raise BmosException('暂不支持的类型')

@tools_bp.post('/test/mcpserver/invoke', summary="调用指定mcp服务的某个工具并返回结果", tags=[tools_tag])
async def test_mcp_server_invoke(body: ToolInfo):
    async with sse_client(body.url) as streams:
        async with ClientSession(streams[0], streams[1]) as session:
            await session.initialize()
            try:
                res = await session.call_tool(name=body.tool_name, arguments=string_to_dict(body.argument))
            except Exception as e:
                logger.error(f"工具调用失败，异常信息:{e}")
                return Resp.success(f"工具调用失败:{e}")
            return Resp.success(res.content[0].text)

@tools_bp.post('/invoke', summary="调用工具", tags=[tools_tag])
def tool_invoke(body: ToolInvokeRequest):
    from app.entities.tool import BaTool

    ba_tool = BaTool.query.get(body.tool_id)
    if not ba_tool:
        raise BmosException("工具不存在！")
    global result
    try:
        if ba_tool.type == ToolType.REST:
            api = ApiRequest.parse_raw(ba_tool.attribute)
            api.request_data = body.arguments
            result = execute(api)
        elif ba_tool.type == ToolType.MCP:
            tool_dict = extract_mcp_info(ba_tool.attribute)
            body.arguments['url'] = tool_dict['url']
            tool_info = ToolInfo.model_validate(body.arguments)
            result = asyncio.run(test_mcp_server_invoke(tool_info))['data']
        else:
            raise BmosException("不支持的工具类型")
    except Exception as e:
        logger.error(f"工具调用失败，异常信息:{e}")
        raise BmosException("工具调用失败")
    return Resp.success(result)

def extract_mcp_info(json_str):
    """
    从 MCP 服务端配置中提取所有子项的 type 和 baseUrl
    """
    try:
        data = json.loads(json_str)
        result = {}

        # 遍历外层的 mcpServers 下的所有子项（键名动态变化）
        for server_key, server_config in data.get("mcpServers", {}).items():
            # 提取 type 和 baseUrl
            server_type = server_config.get("type")
            base_url = server_config.get("baseUrl")

            result['type'] = server_type
            result['url'] = base_url
            result['server_name'] = server_key

        return result
    except (json.JSONDecodeError, AttributeError) as e:
        print(f"解析错误: {e}")
        return []


def _transform_tools_json(tools):
    """
    转换工具列表格式，将inputSchema.properties转换为扁平化数组
    并将required信息合并到每个字段中

    :param tools: List[Tool] 工具对象列表
    :return: 转换后的工具字典列表
    """
    transformed_tools = []

    for tool in tools:
        # 创建新的tool结构
        transformed_tool = {
            "name": tool.name,
            "description": tool.description,
            "inputSchema": []  # 改为数组形式
        }

        # 获取required字段列表
        required_fields = tool.inputSchema.get("required", [])

        if tool.inputSchema.get("properties"):
            # 处理每个property
            for prop_name, prop_data in tool.inputSchema["properties"].items():
                # 构建新的字段描述对象
                field_schema = {
                    "field": prop_name,
                    "type": prop_data["type"],
                    "description": prop_data.get("description", ""),
                    "required": prop_name in required_fields
                }

                # 添加额外的属性（如果有）
                if "example" in prop_data:
                    field_schema["example"] = prop_data["example"]
                if "enum" in prop_data:
                    field_schema["enum"] = prop_data["enum"]

                transformed_tool["inputSchema"].append(field_schema)
        transformed_tools.append(transformed_tool)

    return transformed_tools



if __name__ == '__main__':
    with app.app_context():
        print(tool_invoke(ToolInvokeRequest(tool_id='1917069405724868608', arguments={"tool_name": "查询工艺数据", "arguments": ""})))