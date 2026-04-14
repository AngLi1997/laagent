<template>
  <Modal
    v-model:open="open"
    :title="type === '1' ? t('密码设置') : t('签名密码设置')"
    :mask-closable="false"
    @cancel="cancel"
  >
    <template #footer>
      <Button @click="cancel">
        {{ t('取消') }}
      </Button>
      <Button type="primary" @click="handleOk">
        {{ t('确定') }}
      </Button>
    </template>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      class="changePassWord"
      autocomplete="off"
      :wrapper-col="wrapperCol"
    >
      <Form.Item ref="oldPassWord" :label="type === '1' ? t('旧密码') : t('登录密码')" name="oldPassWord">
        <BMPasswordInput v-model:value="formState.oldPassWord" />
      </Form.Item>
      <Form.Item ref="newPassWord" :label="type === '1' ? t('新密码') : t('签名密码')" name="newPassWord">
        <BMPasswordInput v-model:value="formState.newPassWord" />
      </Form.Item>
      <Form.Item :label="t('确认密码')" name="checkPassWord">
        <BMPasswordInput v-model:value="formState.checkPassWord" />
      </Form.Item>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import type { UnwrapRef } from 'vue';
import { changeLoginUserPassword, changeSignPassword } from '@/api';
import { BMPasswordInput } from '@bmos/components';
import { t } from '@bmos/i18n';
import { sso } from '@bmos/messager';
import { Button, Form, message, Modal } from 'ant-design-vue';
import { reactive, ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: '1',
  },
});
const { navigatorLoginPage } = sso;
interface FormState {
  oldPassWord: string;
  newPassWord: string;
  checkPassWord: string;
}
const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 17, offset: 1 };
const formState: UnwrapRef<FormState> = reactive({
  oldPassWord: '',
  newPassWord: '',
  checkPassWord: '',
});

// 验证第一行密码
const validatePass0 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(props.type === '1' ? t('请输入旧密码') : t('请输入登录密码'));
  }
  else {
    return Promise.resolve();
  }
};

// 验证第二行密码
const validatePass1 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(props.type === '1' ? t('请输入新密码') : t('请输入签名密码'));
  }
  else {
    return Promise.resolve();
  }
};
  // 验证确认密码
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(t('请输入确认密码'));
  }
  else if (value !== formState.newPassWord) {
    return Promise.reject(t('两次密码不一致'));
  }
  else {
    return Promise.resolve();
  }
};
  // 表单校验
const rules: Record<string, Rule[]> = {
  oldPassWord: [{ required: true, validator: validatePass0, trigger: 'blur' }],
  newPassWord: [{ required: true, validator: validatePass1, trigger: 'blur' }],
  checkPassWord: [{ required: true, validator: validatePass2, trigger: 'blur' }],
};

const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
  // 修改密码确定
const handleOk = async () => {
  const passwordForm = await formRef.value?.validate();
  try {
    const data = {
      oldPassword: passwordForm.oldPassWord,
      newPassword: passwordForm.checkPassWord,
    };
    const data2 = {
      loginPassword: passwordForm.oldPassWord,
      signaturePassword: passwordForm.checkPassWord,
    };
    console.log(data);
    const res: any = props.type === '1' ? await changeLoginUserPassword(data) : await changeSignPassword(data2);
    if (props.type === '1') {
      if (res.code === 0) {
        message.success(t('修改成功'));
        open.value = false;
        // 退出登录操作
        navigatorLoginPage();
      }
      if (res.code === 8104001) {
        message.error(t('当前密码不正确'));
      }
    }
    else {
      message.success(t('修改成功'));
      formRef.value.resetFields();
      open.value = false;
    }
  }
  catch (error: any) {
    message.error(error.message);
  }
};
const cancel = () => {
  formRef.value.resetFields();
  open.value = false;
};
defineExpose({ showModal });
</script>

<style lang="less" scoped>
  .ant-modal-content {
  width: 430px !important;
  height: 260px !important;
}
.ant-modal .ant-modal-content {
  padding-right: 30px !important;
}
.changePassWord {
  margin-top: 40px !important;
}
</style>
