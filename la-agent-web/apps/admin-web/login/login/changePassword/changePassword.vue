<template>
  <Modal v-model:open="open" :title="t('修改密码')" @cancel="cancel">
    <template #footer>
      <Button @click="cancel">{{ t('取消') }}</Button>
      <Button type="primary" @click="handleOk">{{ t('确定') }}</Button>
    </template>
    <div style="margin-top: 30px">
      {{ !props.titleTip ? t('您使用的是系统默认密码登录，需修改密码。') : props.titleTip }}
    </div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      class="changePassWord"
      autocomplete="off"
      :wrapper-col="wrapperCol">
      <Form.Item ref="newPassWord" :label="t('新密码')" name="newPassWord">
        <BMPasswordInput v-model:value="formState.newPassWord"></BMPasswordInput>
      </Form.Item>
      <Form.Item :label="t('确认密码')" name="checkPassWord">
        <BMPasswordInput v-model:value="formState.checkPassWord"></BMPasswordInput>
      </Form.Item>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { changePassWord, expireUserChangePwd } from '../../api';
  import { message, Modal, Form, Button } from 'ant-design-vue';
  import { t } from '@bmos/i18n';
  import { BMPasswordInput } from '@bmos/components';

  const props = defineProps({
    userId: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
    titleTip: {
      type: String,
      default: '',
    },
    loginName: {
      type: String,
      default: '',
    },
  });
  interface FormState {
    newPassWord: string;
    checkPassWord: string;
  }
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 17, offset: 1 };
  const formState: UnwrapRef<FormState> = reactive({
    newPassWord: '',
    checkPassWord: '',
  });
  // 验证确认密码
  const validatePass2 = async (_rule: Rule, value: string) => {
    if (value === '') {
      return Promise.reject(t('确认密码不能为空'));
    } else if (value !== formState.newPassWord) {
      return Promise.reject(t('两次密码不一致'));
    } else {
      return Promise.resolve();
    }
  };
  // 表单校验
  const rules: Record<string, Rule[]> = {
    newPassWord: [{ required: true, message: t('新密码不能为空'), trigger: 'blur' }],
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
      // 使用的重置密码时候(未激活时候)
      if (!props.titleTip) {
        const data = {
          loginName: props.loginName,
          newPassword: passwordForm.checkPassWord,
        };
        const res = await changePassWord(data, props.token);
        if (res.data.code === 0) {
          message.success(t('修改成功'));
          formRef.value.resetFields();
          open.value = false;
          return;
        }
        message.error(t(res.data.message));
      } else {
        // 密码过期时候
        const data2 = {
          loginName: props.loginName,
          newPassword: passwordForm.checkPassWord,
        };
        const res = await expireUserChangePwd(data2, props.token);
        if (res.data.code === 0) {
          message.success(t('修改成功'));
          formRef.value.resetFields();
          open.value = false;
          return;
        }
        message.error(t(res.data.message));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cancel = (e: MouseEvent) => {
    console.log(e);
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
    margin-top: 30px !important;
  }
</style>
