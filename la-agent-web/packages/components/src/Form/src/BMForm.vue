<template>
  <Form
    ref="bmFormRef"
    v-bind="objectPick(getFormProps, aFormPropKeys)"
    class="bm-form"
    :model="formModel"
    @keypress.enter="handleEnterPress">
    <Row v-bind="getRowConfig">
      <slot name="formHeader"></slot>
      <slot>
        <template v-for="schemaItem in formSchemasRef" :key="schemaItem.field">
          <BMFormItem
            v-model:form-model="formModel"
            :schema="schemaItem"
            :useMaxLengthRule="
              isNullOrUnDef(schemaItem.useMaxLengthRule) ? getFormProps.useMaxLengthRule : schemaItem.useMaxLengthRule
            "
            :style="{ zIndex: 99 }">
            <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
              <slot :name="item" v-bind="data || {}"></slot>
            </template>
          </BMFormItem>
        </template>
        <FormAction
          v-if="getFormProps.showActionButtonGroup"
          v-bind="getFormActionBindProps"
          @toggle-advanced="handleToggleAdvanced"
          @update:actionColOptions="updateActionColOptions">
          <template v-for="item in ['advanceBefore', 'resetBefore', 'submitBefore', 'submitAfter']" #[item]="data">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormAction>
      </slot>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>

<script lang="ts" setup>
  import { cloneDeep, objectPick, isNullOrUnDef } from '@bmos/utils';
  import { Form, Row } from 'ant-design-vue';
  import { useAttrs, ref, watch } from 'vue';
  import FormAction from './components/FormAction.vue';
  import {
    createFormContext,
    useAdvanced,
    useFormEvents,
    useFormMethods,
    useFormState,
    type BMFormType,
  } from './hooks/';
  import BMFormItem from './BMFormItem.vue';
  import { aFormPropKeys, bmFormEmits, bmFormProps } from './types/bm-form';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';

  defineOptions({
    name: 'BMForm',
  });

  const props = defineProps(bmFormProps);

  const emit = defineEmits(bmFormEmits);
  const attrs = useAttrs();
  // 表单内部状态
  const formState = useFormState({ props, attrs });
  const { formModel, getRowConfig, bmFormRef, getFormProps, getFormActionBindProps, formSchemasRef } = formState;

  // 表单内部方法
  const formMethods = useFormMethods({ ...formState });
  const { initFormValues, handleFormValues } = formMethods;

  // a-form表单事件二次封装和扩展
  const formEvents = useFormEvents({ ...formState, emit, handleFormValues });
  const { handleEnterPress } = formEvents;

  // 当前组件所有的状态和方法
  const instance = {
    ...formState,
    ...formEvents,
    ...formMethods,
  } as BMFormType;

  const actionColOptionsSpan = ref<number>(0);
  const updateActionColOptions = (span: number) => {
    actionColOptionsSpan.value = span;
  };

  // 搜索表单 展开/收起 表单项hooks
  const { handleToggleAdvanced } = useAdvanced({
    instance,
    emit,
    actionColOptionsSpan,
  });

  // initialValues 变化时，更新表单数据
  watch(
    () => props.initialValues,
    val => {
      if (val) {
        initFormValues(cloneDeep(val));
      } else {
        initFormValues();
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  // 绑定css
  mountStyle('-bmos-form', style);

  emit('register', instance);

  createFormContext(instance);

  defineExpose(instance);
</script>
