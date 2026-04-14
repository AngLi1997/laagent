# -*- coding: utf-8 -*-
# @Time    : 2025/4/3 14:09
# @Author  : liang
# @FileName: file_util.py
# @Software: PyCharm

"""文件工具"""

import os
from tempfile import NamedTemporaryFile

from flask_openapi3 import FileStorage
from langchain_community.document_loaders import Docx2txtLoader, TextLoader, PyMuPDFLoader, CSVLoader, \
    UnstructuredExcelLoader
from langchain_community.document_loaders.parsers import RapidOCRBlobParser
from langchain_core.documents import Document
from loguru import logger
from lxml import etree


def get_size_of_storage_file(file_storage: FileStorage) -> int:
    """
    获取FileStorage的文件大小
    :param file_storage: 文件对象
    :return: 文件大小
    """
    tf = file_storage.stream
    tf.seek(0, os.SEEK_END)
    size = tf.tell()
    tf.seek(0)
    return size


def get_size_of_tmp_file(file_storage: NamedTemporaryFile) -> int:
    """
    获取NamedTemporaryFile的文件大小
    :param file_storage: 文件对象
    :return: 文件大小
    """
    return os.path.getsize(file_storage.name)


def get_file_type(file_name: str) -> str:
    """
    获取FileStorage的文件类型
    :param file_name: 文件名称
    :return: 文件类型
    """
    return file_name.rsplit('.', 1)[1].lower() if '.' in file_name else None


def read_text_summary_from_storage(file: NamedTemporaryFile, file_type: str, max_length: int = 200) -> str | None:
    """
    获取NamedTemporaryFile的文件摘要
    :param file: 文件对象
    :param file_type: 文件类型
    :param max_length: 最大截取长度
    :return: 文本摘要
    """
    return read_multy_document_text_info(file, file_type, max_length)


def convert_file_storage_to_document(file: NamedTemporaryFile, file_type: str) -> [Document]:
    """
    file_storage转langchain document对象
        后面加更多类型可以参考：https://python.langchain.com/docs/integrations/document_loaders/#all-document-loaders
    :param file: 文件
    :param file_type: 文件类型
    :return: [Document]
    """
    result = []
    if file_type in ['txt', 'md', 'sql', 'html']:
        result = TextLoader(file.name).load()
    elif file_type in ['doc', 'docx']:
        result = Docx2txtLoader(file.name).load()
    elif file_type in ['csv']:
        result = CSVLoader(file.name).load()
    elif file_type in ['xls', 'xlsx']:
        result = UnstructuredExcelLoader(file.name).load()
        for res in result:
            if res.metadata.get('text_as_html'):
                res.page_content = parse_html_table_to_format_str(res.metadata.get('text_as_html'))
            else:
                res.page_content = res.page_content
    elif file_type in ['pdf']:
        result = PyMuPDFLoader(file.name,
                               mode='single',
                               images_inner_format='markdown-img',
                               images_parser=RapidOCRBlobParser()).load()
    else:
        result = []
    return result

def read_multy_document_text_info(file: NamedTemporaryFile, file_type:str, max_length: int = None) -> str | None:
    """
    读取各种类型文档信息
    :param file: 文件对象
    :param file_type: 文件类型
    :param max_length: 截取长度
    :return: 文本内容
    """
    docs = convert_file_storage_to_document(file, file_type)
    separator = f"\n{'-' * 10}\n"
    result = separator.join([doc.page_content for doc in docs]) if docs else None
    logger.info(f'文档读取结果: {result[:200]}')
    return result[:max_length] if max_length else result


def parse_html_table_to_format_str(html_table: str):

    if html_table:
        return ""

    table_format_str = "<bmos:table:start>\n"
    u = etree.HTML(html_table)
    rows = u.xpath('//table/tr')
    for row in rows:
        line = ' | '.join(row.xpath('./td/text()'))
        table_format_str += f"{line} \n"
    table_format_str += "<bmos:table:end>"
    return table_format_str


if __name__ == '__main__':
    with open("/Users/liang/Desktop/bmos知识库搭建/实施手册/MES系统版本功能和参数对比清单2025.04.xlsx", "rb") as f:
        file = NamedTemporaryFile(delete=False)
        file.write(f.read())
        print(read_text_summary_from_storage(file, 'xlsx'))
