<template>
  <Modal v-model:open="open" :title="t('语言设置')" @cancel="cancel">
    <template #footer>
      <Button @click="cancel">
        {{ t('取消') }}
      </Button>
      <Button type="primary" @click="handleOk">
        {{ t('确定') }}
      </Button>
    </template>
    <Form ref="formRef" :model="formState" :label-col="labelCol" autocomplete="off" :wrapper-col="wrapperCol">
      <Form.Item ref="languageValue" :label="t('系统语言')" name="languageValue">
        <Select
          v-model:value="formState.languageValue"
          :placeholder="t('请选择')"
          :options="languageList"
          style="width: 280px"
          @change="ChangeLanguage"
        />
      </Form.Item>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import { updateLangResource } from '@/utils/handleLang';
import { changeLanguage, t } from '@bmos/i18n';
import { Button, Form, Modal, Select } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';

defineProps({
  userId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['changeLang']);
const formRef = ref();
const labelCol = { span: 6 };
const wrapperCol = { span: 19, offset: 0 };
const formState = reactive({
  languageValue: '',
  // languageValue: '',
});
const languageList = ref<any>([
  { label: t('简体中文'), value: 'zh_CN' },
  { label: t('英文'), value: 'en_US' },
  { label: t('俄语'), value: 'ru_RU' },
]);
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
  // 切换语言下拉
const ChangeLanguage = async (val: any) => {
  console.log(val);
};
  // 切换语言确定
const handleOk = async () => {
  const res = await formRef.value?.validate();
  changeLanguage(res.languageValue);
  emit('changeLang', res.languageValue);
  await updateLangResource(res.languageValue);
  open.value = false;
};
const cancel = () => {
  formRef.value.resetFields();
  open.value = false;
};
defineExpose({ showModal });
onMounted(() => {
  // 回显下拉框语言
  const language = localStorage.getItem('LANG') || 'zh_CN';
  formState.languageValue = language;
});
</script>

<style lang="less" scoped>
  .ant-form {
  margin-top: 30px;
  margin-bottom: 60px;
}
.ant-modal-content {
  width: 430px !important;
  height: 260px !important;
}
.ant-modal .ant-modal-content {
  padding-right: 30px !important;
}
</style>
