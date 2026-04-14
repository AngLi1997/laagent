from flask import request

def get_locale():
    lang = request.headers.get("language", "").split("_")[0].strip()
    if lang:
        return lang
    return "zh"
# class BmosDomain(Domain):
#     """自定义 Domain 类，重写翻译加载逻辑"""
#     def get_translations(self, ctx=None):
#         # 保留原始上下文检查逻辑
#         if ctx is None:
#             return NullTranslations()
#
#         # 复用缓存机制
#         cache = self.get_translations_cache(ctx)
#         locale = str(self.get_locale(ctx))  # 通过 Domain 方法获取语言
#
#         cache_key = (locale, self.domain)
#
#         # 若缓存命中，直接返回
#         if cache_key in cache:
#             return cache[cache_key]
#
#         # 核心修改：从 Nacos 加载翻译
#         try:
#             trans = NacosTranslations(locale)
#             cache[cache_key] = trans
#             return trans
#         except Exception as e:
#             return NullTranslations()
#
# class BmosBabel(Babel):
#     """自定义 Babel 类，返回 NacosDomain 实例"""
#     @property
#     def domain_instance(self):
#         return BmosDomain
#
# class NacosTranslations(Translations):
#     def __init__(self, locale):
#         super().__init__(locale)
#         self._load_nacos_translations(locale)
#
#     def _load_nacos_translations(self, locale):
#         """从 Nacos 获取翻译数据并合并到当前翻译目录"""
#         try:
#             # 1. 构建 Nacos 的 data_id（例如 i18n_zh）
#             data_id = f"i18n_{locale}"
#
#             # 2. 从 Nacos 拉取配置
#             content = client.get_config(data_id, group="DEFAULT_GROUP")
#
#             # 3. 解析 JSON 数据并合并到翻译目录
#             translations = json.loads(content)
#             self._catalog.update(translations)
#             print(f"成功加载 Nacos 翻译配置：{data_id}")
#
#         except Exception as e:
#             print(f"从 Nacos 加载翻译失败（{locale}）: {str(e)}")
#             # 此处可回退到本地翻译文件或抛出异常
