<template>
  <Modal
    ref="modalFormRef"
    v-bind="objectPick(getModalFormProps, aModalFormPropKeys)"
    :confirmLoading="confirmLoading"
    :open="openRef"
    @ok="ok"
    @cancel="cancel">
    <!-- 表单之前的插槽 -->
    <div v-if="slots.formBefore" style="padding-bottom: 20px">
      <slot name="formBefore" v-bind="instance"></slot>
    </div>

    <BMForm
      v-if="!isUnDef(getModalFormProps.formProps)"
      ref="formRef"
      v-bind="getModalFormProps.formProps"
      @formModelChange="handleFormModelChange">
      <template
        v-for="item in Object.keys(omit(slots, ['default', 'cancelText', 'closeIcon', 'footer', 'okText', 'title']))"
        #[item]="data"
        :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BMForm>
    <template #footer>
      <template v-if="slots.footer">
        <slot name="footer" v-bind="instance"></slot>
      </template>
      <template v-else>
        <Button v-if="getModalFormProps.showCancelButton" v-bind="getModalFormProps.cancelButtonProps" @click="cancel">
          {{ getModalFormProps.cancelButtonText ?? t('取消') }}
        </Button>
        <Button
          v-if="getModalFormProps.showOkButton"
          type="primary"
          :loading="confirmLoading"
          v-bind="getModalFormProps.okButtonProps"
          @click="ok">
          {{ getModalFormProps.okButtonText ?? t('确定') }}
        </Button>
      </template>
    </template>
    <template v-for="item in Object.keys(omit(slots, ['footer']))" #[item]="data" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
  <template v-if="openUndefined">
    <span class="bmos-modal-form-trigger" @click="innerOpenModal">
      <slot name="trigger" v-bind="instance">
        <Button v-bind="getTriggerButtonProps">
          {{ getModalFormProps.triggerButtonText ?? t('新建') }}
        </Button>
      </slot>
    </span>
  </template>
</template>
<script lang="ts" setup>
  import { Modal, Button } from 'ant-design-vue';
  import { modalFormProps, modalFormEmits, aModalFormPropKeys } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { isUnDef, objectPick, omit } from '@bmos/utils';
  import { useAttrs, useSlots } from 'vue';
  import {
    useModalFormState,
    useModalFormEvents,
    useModalFormMethods,
    createModalFormContext,
    type ModalFormType,
  } from './hooks/';
  import { BMForm } from '../../Form';
  import { t } from '@bmos/i18n';

  defineOptions({
    name: 'BMModalForm',
  });
  const props = defineProps(modalFormProps);
  const emit = defineEmits(modalFormEmits);
  const slots = useSlots();
  const attrs = useAttrs();

  // modalForm内部状态
  const modalFormState = useModalFormState({ props, attrs, emit });
  const {
    openRef,
    modalFormRef,
    formRef,
    getModalFormProps,
    confirmLoading,
    openUndefined,
    getTriggerButtonProps,
    formModal,
  } = modalFormState;

  // modalForm 事件处理
  const modalFormMethods = useModalFormMethods({ ...modalFormState, emit });
  mountStyle('-bmos-modalForm', style);

  const { innerOpenModal } = modalFormMethods;

  const modalFormEvents = useModalFormEvents({
    ...modalFormState,
    ...modalFormMethods,
    emit,
    props,
  });
  const { ok, cancel } = modalFormEvents;

  const handleFormModelChange = (formModel: Record<string, any>) => {
    formModal.value = formModel;
  };

  // 当前组件所有的状态和方法
  const instance = {
    ...modalFormState,
    ...modalFormEvents,
    ...modalFormMethods,
    formModal,
  } as ModalFormType;

  emit('register', instance);

  createModalFormContext(instance);

  defineExpose(instance);
</script>
