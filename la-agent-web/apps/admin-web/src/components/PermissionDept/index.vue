<template>
  <NormalModalForm
    v-model:open="permissionOpen"
    :title="t('数据权限')"
    :submit="okModal"
    destroy-on-close
    wrap-class-name="modalSizeMedium"
    class="permission-modal"
  >
    <DepartMent ref="departMentRef" :record="resourceId" :is-add="isAdd" :checks="checks" :type="type" />
  </NormalModalForm>
</template>

<script setup lang="tsx">
import { reqAgentResourceCreate } from '@/api';
import DepartMent from '@/components/DepartMent/index.vue';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { computed } from 'vue';

defineOptions({
  name: 'PermissionModal',
  inheritAttrs: false,
});

const props = defineProps({
  permissionOpen: {
    type: Boolean,
    default: false,
  },
  isAdd: {
    type: Boolean,
    default: false,
  },
  resourceId: {
    type: [String, Number],
    default: '',
  },
  // 是否获取全量数据， true: 全量数据， false: 部分部门权限数据
  type: {
    type: Boolean,
    default: true,
  },
  // 选中的数据
  checks: {
    type: Array,
    default: () => [],
  },
  saveImmediate: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(['update:permissionOpen', 'ok']);
const departMentRef = ref();

const permissionOpen = computed<boolean>({
  get() {
    return props.permissionOpen;
  },
  set(val) {
    emits('update:permissionOpen', val);
  },
});

const okModal = async () => {
  try {
    const checkedKeys = departMentRef.value.getSelectKeys();
    // 如果没选部门， 提示
    if (!checkedKeys.length) {
      message.error(t('请选择部门'));
      return Promise.reject(new Error(t('请选择部门')));
    }
    if (!props.saveImmediate) {
      emits('ok', checkedKeys);
      permissionOpen.value = false;
      return Promise.resolve();
    }
    await reqAgentResourceCreate({
      dept_ids: checkedKeys,
      resource_id: props.resourceId,
    });
    message.success(t('保存数据权限成功'));
    emits('ok');
    permissionOpen.value = false;
    return Promise.resolve();
  }
  catch (error: any) {
    error.message && message.error(error.message);
    return Promise.reject(error);
  }
};
</script>

<style lang="less"></style>
