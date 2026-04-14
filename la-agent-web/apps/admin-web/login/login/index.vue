<template>
  <div class="pc-login">
    <!--左上角logo-->
    <div class="left-top-logo">
      <img :src="getLogoUrl('login-logo.svg')" style="width: 100%" />
    </div>
    <!-- 右上角切换语言下拉框 -->
    <div class="selectLanguage">
      <Select
        v-model:value="languageValue"
        :placeholder="t('请选择')"
        :bordered="false"
        style="width: 120px"
        @change="ChangeLanguage">
        <template #suffixIcon>
          <BMIcons icon="SelectIcon" style="width: 12px; height: 12px; transform: translateX(-6px)"></BMIcons>
        </template>
        <SelectOption v-for="item in languageList" :key="item.value" :value="item.value">
          <BMIcons icon="EN" style="width: 14px; height: 14px"></BMIcons>
          {{ item.label }}
        </SelectOption>
      </Select>
    </div>
    <div class="middle">
      <div class="middle_left" :style="middleLeftBgStyle"></div>
      <div class="middle_right">
        <div class="title">{{ t('账号登录') }}</div>
        <!-- 用户账号密码输入表单 -->
        <Form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <Form.Item ref="username" label="" name="username">
            <Input
              v-model:value="formState.username"
              autocomplete="off"
              spellcheck="false"
              :placeholder="t('请输入账号')">
              <template #prefix>
                <BMIcons icon="Zhanghao" style="width: 21px; height: 22px"></BMIcons>
              </template>
            </Input>
          </Form.Item>
          <Form.Item label="" name="password">
            <BMPasswordInput v-model:value="formState.password" class="inputPassword" @keyup.enter="login">
              <template #prefix>
                <BMIcons icon="Password" style="width: 21px; height: 22px" />
              </template>
            </BMPasswordInput>
          </Form.Item>
        </Form>
        <Button type="primary" class="login" @click="login">
          {{ t('登录') }}
        </Button>
      </div>
    </div>
    <!-- 提示修改密码弹窗 -->
    <changePassword
      :id="id"
      ref="changePasswordRef"
      :userId="userId"
      :token="token"
      :titleTip="titleTip"
      :loginName="loginName"></changePassword>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { userLogin } from '../api';
  import { message } from 'ant-design-vue';
  import { Modal, Select, Form, Input, Button, SelectOption } from 'ant-design-vue';
  import changePassword from './changePassword/changePassword.vue';
  import { setUser } from '../utils';
  import { SERVICE_TYPE, TerminalType } from './const';
  import { t, changeLanguage, I18nLanguageType } from '@bmos/i18n';
  import { clearLockStatus } from '../../src/components/Layout/lock';
  import { BMIcons } from '@bmos/icons';
  import { getLogoUrl } from '@bmos/utils';
  import { BMPasswordInput } from '@bmos/components';

  interface FormState {
    username: string;
    password: string | undefined;
  }

  const middleLeftBgStyle = computed(() => {
    return {
      backgroundImage: `url('${getLogoUrl('login-img.png')}')`,
    };
  });
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 20, offset: 2 };
  const changePasswordRef = ref();
  const userId = ref();
  const token = ref('');
  const id = ref();
  const titleTip = ref('');
  const loginName = ref('');
  const props = defineProps({
    lang: {
      type: String,
      default: 'zh_CN',
    },
  });
  const languageValue = ref(props.lang);
  const languageList = ref([
    { label: t('简体中文'), value: 'zh_CN' },
    { label: t('英文'), value: 'en_US' },
    { label: t('俄语'), value: 'ru_RU' },
  ]);
  const formState: UnwrapRef<FormState> = reactive({
    username: '',
    password: '',
  });
  const emit = defineEmits(['changeLang']);
  const normalizeActiveStatus = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const status = Number(value);
    return Number.isNaN(status) ? null : status;
  };

  const handleLoginSuccess = (userData: any) => {
    userId.value = userData.userId;
    clearLockStatus(userId.value);
    message.success(t('登录成功'));
    setUser(userData);
  };

  // 账号验证 只能英文 数字
  const validatorAccount = async (_rule: any, value: string) => {
    if (!value) {
      return Promise.reject(t('账号不能为空'));
    } else if (
      !/^[a-zA-Z0-9]{2,18}$/.test(value) //2-18位且有数字 字母
    ) {
      return Promise.reject(t('账号输入有误'));
    } else {
      return Promise.resolve();
    }
  };
  // 表单校验
  const rules: Record<string, Rule[]> = {
    username: [{ required: true, validator: validatorAccount, trigger: 'blur' }],
    password: [{ required: true, trigger: 'blur', message: t('密码不能为空') }],
  };
  // 切换语言
  const ChangeLanguage = async (val: any) => {
    changeLanguage(val as I18nLanguageType);
    emit('changeLang', val);
  };
  // 登录按钮
  const login = async () => {
    const passwordForm = await formRef.value?.validate();
    try {
      const data = {
        loginName: passwordForm.username,
        password: passwordForm.password,
        serviceType: SERVICE_TYPE,
        terminalType: TerminalType.PC,
      };
      const res: any = await userLogin(data);
      if (res.code === 0) {
        const activeStatus = normalizeActiveStatus(res.data?.activeStatus);
        switch (activeStatus) {
          case 0:
            message.error(t('账号未激活，请先激活账号'));
            userId.value = res.data.userId;
            id.value = res.data.id;
            loginName.value = res.data.loginName;
            token.value = res.data.token;
            changePasswordRef.value.showModal();
            formState.password = undefined;
            break;
          case 2:
            message.error(t('您的密码已过有效期,需修改密码'));
            titleTip.value = t('您的密码已过有效期,需修改密码');
            token.value = res.data.token;
            loginName.value = res.data.loginName;
            changePasswordRef.value.showModal();
            formState.password = undefined;
            break;
          case 1:
            if (res.data.remindExpire) {
              Modal.confirm({
                title: t('提示'),
                content: t('您的密码即将到期，请尽快更换以保持账户安全。'),
                okText: t('确定'),
                cancelButtonProps: {
                  // @ts-ignore
                  style: {
                    display: 'none',
                  },
                },
                keyboard: false,
                onOk() {
                  handleLoginSuccess(res.data);
                },
              });
            } else {
              handleLoginSuccess(res.data);
            }
            break;
          default:
            if (res.data?.token) {
              handleLoginSuccess(res.data);
            }
            break;
        }
      }
    } catch (error: any) {
      message.error(t(error.message));
      // 新加密码过期让修改密码
      if (error.code === 8104008) {
        titleTip.value = t('您的密码已过有效期,需修改密码');
        loginName.value = passwordForm.username;
        changePasswordRef.value.showModal();
        formState.password = undefined;
      }
    }
  };
  onMounted(async () => {
    sessionStorage.clear();
  });
</script>

<style scoped lang="less">
  // 大背景
  .pc-login {
    // 左上角logo
    .left-top-logo {
      position: absolute;
      top: 80px;
      left: 100px;
      z-index: 1;
    }
    // 语言下拉样式
    :deep(.ant-select-selector) {
      border: 1px solid #fff;
    }

    .selectLanguage {
      border-radius: 4px;
    }
    .selectLanguage:hover {
      background: #f0f1f2;
    }
    :deep(.ant-select-item-option:hover .selectLanguage) {
      background: #f0f1f2;
    }

    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    min-width: 1280px;
    min-height: 700px;
    background-color: #fff;
    background-image: url('../assets/img/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    .selectLanguage {
      position: absolute;
      top: 24px;
      right: 48px;
    }
    .download-link {
      position: absolute;
      top: 24px;
      right: 200px;
      line-height: 36px;
      cursor: pointer;
      color: var(--bmos-first-level-text-color);
    }
    // 中间区域
    .middle {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      box-sizing: border-box;
      width: 100%;
      height: 65%;
      // 中左图标
      .middle_left {
        width: 51%;
        height: 100%;
        background-position: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      // 右边表单
      .middle_right {
        width: 23%;
        height: 82%;
        min-height: 425px;
        margin-right: 100px;
        border: 1px solid #d3d8f7;
        box-shadow: 0px 0px 40px 1px rgba(10, 58, 153, 0.1);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        position: relative;
        .title {
          margin-top: 40px;
          margin-bottom: 10.5%;
          text-align: center;
          font-size: 30px;
          color: #303133;
        }
        .login {
          width: 84%;
          height: 52px;
          border-radius: 4px;
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
          position: absolute;
          bottom: 13%;
          left: 8%;
        }

        //  密码小眼睛
        :deep(.ant-input-affix-wrapper .anticon.ant-input-password-icon) {
          color: #0d376a;
          font-size: 16px;
        }
        // 语言下拉框 // 下拉框
        :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
          border: none;
        }
        :deep(.ant-input-affix-wrapper .ant-input-prefix) {
          margin-inline-end: 16px;
        }

        // 表单上下间距
        :deep(.ant-form-item) {
          margin-bottom: 5px;
        }
        .inputPassword {
          margin-top: 10%;
        }
        .user-icon {
          width: 21px;
          height: 22px;
        }
        .svg-icon {
          cursor: inherit;
        }
        // 去除输入框蓝色背景
        :deep(input:-webkit-autofill) {
          background: transparent;
          transition: background-color 50000s ease-in-out 0s;
          -webkit-text-fill-color: unset;
        }
      }
    }
  }
</style>

<style lang="less">
  .pc-login {
    // 表单输入框样式
    .ant-input-affix-wrapper {
      height: 52px;
      border-radius: 4px;
      border-color: var(--bmos-first-level-border-color);
      font-size: 18px;
      padding-left: 20px;
    }
    // 输入框点中时
    .ant-input-affix-wrapper-focused {
      border-color: #3c77e2;
    }
    :deep(.ant-input-affix-wrapper > input.ant-input) {
      padding-left: 10px;
    }
    // 校验失败时候的提示文字
    :deep(.ant-form .ant-form-item-explain-error) {
      font-size: 13px;
    }
    // placeholder字体样式 苹方
    :global(.ant-input::-webkit-input-placeholder) {
      color: #95a2b7;
      font-family: 'Sans-Serif' !important;
    }

    // 校验错误的时候输入框点击时候的颜色
    :deep(
        .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(
            .ant-input-affix-wrapper-borderless
          ).ant-input-affix-wrapper
      ) {
      color: red !important;
    }
  }
</style>
