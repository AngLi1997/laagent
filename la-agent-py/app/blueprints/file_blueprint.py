from flask import request
from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint, FileStorage

from app.app_init import app
from app.constants.constants.bable_constants import TRANSLATIONS
from app.models.common.resp import Resp

files_tag = Tag(name='文件管理接口')
files_bp = APIBlueprint('file', __name__, url_prefix='/file')

FILE_SUFFIX = ["png", "jpg", "jpeg", "gif", "bmp", "pdf", "xls", "xlsx", "docx", "txt", "ppt", "pptx", "tf", "md"]

@files_bp.post('/upload',summary="文件上传接口",tags=[files_tag],responses={200: Resp})
def upload_file():
    if 'file' not in request.files:
        return Resp.error(_(TRANSLATIONS['upload_file_not_exist']))

    file = request.files['file']

    if not _allowed_file(file.filename):
        return Resp.error(_(TRANSLATIONS['upload_file_type_error']))

    if _get_stream_size(file) > 10 * 1024 * 1024:
        return Resp.error(_(TRANSLATIONS['upload_file_not_exceed_10']))

    return Resp.success(app.minio_client.upload_file_storage(file, file.filename))


def _allowed_file(filename: str) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in FILE_SUFFIX


def _get_stream_size(file: FileStorage):
    # 保存原始指针位置
    original_position = file.stream.tell()

    # 移动到文件末尾
    file.stream.seek(0, 2)  # 0 表示偏移量，2 表示从文件末尾开始
    file_size = file.stream.tell()

    # 恢复指针位置
    file.stream.seek(original_position)
    return file_size