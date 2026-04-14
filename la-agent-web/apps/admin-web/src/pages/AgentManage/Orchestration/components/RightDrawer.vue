<template>
  <Drawer
    v-model:open="open"
    class="right-drawer-config"
    root-class-name="right-drawer-config-root"
    :title="t('节点配置')"
    :footer="footer"
    destroy-on-close
    :mask-closable="false"
    placement="right"
  >
    <BMForm ref="setFormRef" v-bind="setFormProps" />
  </Drawer>
</template>

<script lang="tsx" setup>
import type { formInstance, Recordable } from '@bmos/components';
import type { RightDrawerProps } from '../type';
import { BMForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { cloneDeep, isNullOrUnDef } from '@bmos/utils';
import { Button, Drawer, message, Space } from 'ant-design-vue';
import { useDrawerForm } from '../hooks';

const props = withDefaults(defineProps<RightDrawerProps>(), {
  nodeId: '',
  nodeFormData: () => ({}),
  isView: false,
  flowDataForDrawer: () => [],
  nodesDetail: () => [],
});
const emit = defineEmits(['updateFormValue']);
const open = defineModel<boolean>('open', {
  default: false,
});
const setFormRef: Ref<formInstance> = ref({});

const cancelDrawer = () => {
  open.value = false;
};

const savaFun = async () => {
  try {
    const res: Recordable = await setFormRef.value?.validate();
    const isHasName = props.flowDataForDrawer?.find((item: any) => item.node_name === res?.node_name);
    if (isHasName) {
      message.error(t('节点已存在'));
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject();
    }
    emit('updateFormValue', props.nodeId, res);
    isFormChange.value = false;
    return Promise.resolve();
  }
  catch (error) {
    return Promise.reject(error);
  }
};

const ok = async () => {
  try {
    await savaFun();
    open.value = false;
  }
  catch (_error) {
    // console.log(error);
  }
};

const {
  setFormProps,
  isFormChange,
} = useDrawerForm({
  props,
  setFormRef,
  emit,
});

const okBtnLoading = ref<boolean>(false);
const footer = (
  <Space class="footer-action">
    {/* 如果 isView 为 true, 不显示 确定按钮 */}
    {!props.isView && (
      <>
        <Button type="primary" loading={okBtnLoading.value} onClick={() => ok()}>
          {t('确定')}
        </Button>
      </>
    )}
    <Button onClick={() => cancelDrawer()}>{t('取消')}</Button>
  </Space>
);

const setNodeFormData = async (val: Recordable) => {
  await nextTick();
  console.log('setNodeFormData', val);
  Object.keys(cloneDeep(val)).forEach((key) => {
    if (key === 'label' && !val.node_name) {
      setFormRef.value?.setFormModel('node_name', val[key]);
    }
    setFormRef.value?.setFormModel(key, isNullOrUnDef(val[key]) ? undefined : val[key]);
  });
};

watch(
  () => open.value,
  async (val) => {
    isFormChange.value = false;
    await nextTick();
    if (val) {
      setNodeFormData(props.nodeFormData);
      if (props.isView) {
        setFormRef.value?.setFormProps({
          disabled: true,
        });
      }
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="less">
.right-drawer-config {
  .ant-drawer-header-title {
    flex-direction: row-reverse;
    .ant-drawer-close {
      margin-right: 0;
    }
  }

  .ant-drawer-footer {
    .footer-action {
      display: flex;
      justify-content: end;
      flex-direction: row-reverse;
    }
  }
  .clear-label {
    position: absolute;
    right: 20%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 99;
  }
}
</style>
