from enum import Enum


class ToolType(str, Enum):
    MCP = "MCP"
    PYTHON = "PYTHON"
    REST = "REST"

class HttpMethod(str,Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"

class ParamType(str,Enum):
    INT = "int"
    STRING = "string"
    ARRAY = "array"
    OBJECT = "object"
    BOOLEAN = "boolean"

class ContentType(str,Enum):
    JSON = "application/json"
    FORM_URLENCODED = "application/x-www-form-urlencoded"
    FORM_DATA = "multipart/form-data"