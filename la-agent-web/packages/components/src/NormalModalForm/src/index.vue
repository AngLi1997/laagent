<template>
  <Modal
    ref="normalModalFormRef"
    v-bind="objectPick(getNormalModalFormProps, aNormalModalFormPropKeys)"
    :confirmLoading="confirmLoading"
    :open="openRef"
    @ok="ok"
    @cancel="cancel">
    <template #footer>
      <template v-if="slots.footer">
        <slot name="footer" v-bind="instance"></slot>
      </template>
      <template v-else>
        <Button
          v-if="getNormalModalFormProps.showCancelButton"
          v-bind="getNormalModalFormProps.cancelButtonProps"
          @click="cancel">
          {{ getNormalModalFormProps.cancelButtonText ?? t('取消') }}
        </Button>
        <Button
          v-if="getNormalModalFormProps.showOkButton"
          type="primary"
          :loading="confirmLoading"
          v-bind="getNormalModalFormProps.okButtonProps"
          @click="ok">
          {{ getNormalModalFormProps.okButtonText ?? t('确定') }}
        </Button>
      </template>
    </template>
    <template v-for="item in Object.keys(omit(slots, ['footer', 'default']))" #[item]="data" :key="item">
      <slot :name="item" v-bind="{ ...data, ...instance }"></slot>
    </template>
    <Form ref="formRef" :model="formState" v-bind="getNormalModalFormProps.formProps">
      <slot v-bind="instance"></slot>
    </Form>
  </Modal>
  <template v-if="openUndefined">
    <span class="bmos-normal-modal-form-trigger" @click="innerOpenModal">
      <slot name="trigger" v-bind="instance">
        <Button v-bind="getTriggerButtonProps">
          {{ getNormalModalFormProps.triggerButtonText ?? t('新建') }}
        </Button>
      </slot>
    </span>
  </template>
</template>
<script lang="tsx" setup>
  import { Modal, Button, Form } from 'ant-design-vue';
  import { normalNormalModalFormProps, normalNormalModalFormEmits, aNormalModalFormPropKeys } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { objectPick, omit } from '@bmos/utils';
  import { useAttrs, useSlots } from 'vue';
  import {
    useNormalModalFormState,
    useNormalModalFormEvents,
    useNormalModalFormMethods,
    createNormalModalFormContext,
    type NormalModalFormType,
  } from './hooks/';
  import { t } from '@bmos/i18n';

  defineOptions({
    name: 'BMNormalModalForm',
    inheritAttrs: false,
  });
  const props = defineProps(normalNormalModalFormProps);
  const emit = defineEmits(normalNormalModalFormEmits);
  const slots = useSlots();
  const attrs = useAttrs();

  // normalNormalModalForm内部状态
  const normalNormalModalFormState = useNormalModalFormState({
    props,
    attrs,
    emit,
  });
  const {
    formState,
    openRef,
    normalModalFormRef,
    formRef,
    getNormalModalFormProps,
    confirmLoading,
    openUndefined,
    getTriggerButtonProps,
  } = normalNormalModalFormState;

  // normalNormalModalForm 事件处理
  const normalNormalModalFormMethods = useNormalModalFormMethods({
    ...normalNormalModalFormState,
    emit,
  });
  mountStyle('-bmos-normalNormalModalForm', style);

  const { innerOpenModal } = normalNormalModalFormMethods;

  const normalNormalModalFormEvents = useNormalModalFormEvents({
    ...normalNormalModalFormState,
    ...normalNormalModalFormMethods,
    emit,
    props,
  });
  const { ok, cancel } = normalNormalModalFormEvents;

  // 当前组件所有的状态和方法
  // @ts-ignore
  const instance = {
    ...normalNormalModalFormState,
    ...normalNormalModalFormEvents,
    ...normalNormalModalFormMethods,
  } as NormalModalFormType;

  emit('register', instance);

  createNormalModalFormContext(instance);

  defineExpose(instance);
</script>
