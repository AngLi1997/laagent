"""
平台参数配置的code
"""
"""
平台系统授权码
"""
PLATFORM_SYS_LICENSE_IS_REQUIRED = "platform.sys.license.isRequired"

"""
用户密码字符集（多选，分隔符#），大写字符：U，小写字符：L，数字：N，其他字符：E（!,#,$,%,*,(,),[,],{,},,,.,,:,-,_,?,=,+,-,|）
"""
PLATFORM_USER_PWD_RULE_CHARACTER = "platform.user.pwd-rule.character"

"""
用户密码最小密码长度，限制6-24内整数
"""
PLATFORM_USER_PWD_RULE_MIN_LEN = "platform.user.pwd-rule.minLen"

"""
用户密码尝试次数，限制0-24内整数
"""
PLATFORM_USER_PWD_RULE_TRY_NUM = "platform.user.pwd-rule.tryNum"

"""
用户历史密码个数
"""
PLATFORM_USER_PWD_RULE_HIS_NUM = "platform.user.pwd-rule.hisNum"
"""
用户密码有效期，单位为：天
"""
PLATFORM_USER_PWD_RULE_VALIDITY = "platform.user.pwd-rule.validity"
APPLICATION = "application"
PLATFORM_SYS_TIME_FORMAT = "platform.sys.time-format"
PLATFORM_SYS_APP_LOCK_SCREEN_TIME = "platform.sys.app-lock-screen-time"
PLATFORM_SYS_WEB_LOCK_SCREEN_TIME = "platform.sys.web-lock-screen-time"
PLATFORM_SYS_WEB_LOCK_SCREEN_HOTKEY = "platform.sys.web-lock-screen-hotkey"
PLATFORM_SYS_CLIENT_NAME = "platform.sys.client-name"
PLATFORM_SYS_LANGUAGE = "platform.sys.language"
PLATFORM_SYS_APP_MSG_POLLING_TIME = "platform.sys.app-msg-polling-time"
PLATFORM_SYS_WEB_MSG_POLLING_TIME = "platform.sys.web-msg-polling-time"
PLATFORM_SYS_PROJECT_CONFIG = "platform.sys.project-config"
PLATFORM_SYS_LICENSE_ISREQUIRED = "platform.sys.license.isRequired"
MES_RECORD_MARGIN = "mes.record.margin"
MES_RECORD_EMPTY_DATA = "mes.record.empty-data"
MES_RECORD_ERROR_DATA = "mes.record.error-data"
MES_SCHEDULE_PLAN_INVALID = "mes.schedule.plan-invalid"
MES_RELEASE_OVER_LEVEL_DATA = "mes.release.over-level-data"
MES_PRODUCTION_PLAN_TYPE = "mes.ProductionPlanType"
MES_RECORD_FONT_SIZE = "mes.record.font.size"
MES_RECORD_DEFAULT_FONT = "mes.record.default.font"
MES_WEIGH_REQUIRE_ADVANCE = "mes.weigh.require.advance"

"""
物料临期提醒默认提前多少日
"""
MES_MATERIAL_DYING_PERIOD = "mes.material.dying.period"

"""
数值趋势分析
"""
MES_FIELD_TREND_ANALYSIS = "mes.field.trend.analysis"

"""
时间组件计算格式化
"""
PLATFORM_SYS_TIME_FORMAT_CONFIGURATION = "platform.sys.time-format.configuration"


"""
系统已经激活的服务
"""
PLATFORM_SYS_ACTIVED_SERVICE = "platform.sys.actived.service"

"""
签名密码复杂度配置
"""
PLATFORM_SIGNATURE_PWD_RULE_CHARACTER = "platform.user.sign-pwd-rule.character"

"""
签名密码最小长度
"""
PLATFORM_SIGNATURE_PWD_RULE_MIN_LEN = "platform.user.sign-pwd-rule.minLen"

"""
密码有效期提醒天数
"""
PLATFORM_USER_PWD_EXPIRED_REMIND_PERIOD = "platform.user.pwd-expired.remind-period"

"""
密码锁定用户自动解锁时间，单位：分钟
"""
PLATFORM_USER_LOGIN_AUTO_UNLOCK_TIME = "platform.user.login-auto-unlock-time"

"""
密码锁定用户自动解锁时间永久锁定标识：-1
"""
PERMANENT_UNLOCK_PLACEHOLDER = -1

"""
水印字体存放路径
"""
PLATFORM_SYS_WATERMARK_FONT_PATH = "platform.sys.watermark-font-path"

"""
签名时间默认格式
"""
PLATFORM_SIGNATURE_TIME_FORMAT = "platform.sys.signature.time-format"

"""
mes批签发归档占位符正则
"""
MES_ARCHIVE_PHOTOS_REGULAR = "mes.record.archive-photos-regular"