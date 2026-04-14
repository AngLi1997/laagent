<template>
  <div v-for="(item, index) in list" :key="item.key" class="list-item">
    <BMForm :ref="(el: any) => getFormRefs(el, item)" v-bind="formProps" />
    <div v-if="item.type === PromptsTypeEnum.User" class="delete-btn">
      <BMIcons
        v-show="!isView && index > 0"
        class="delete-icon"
        icon="Delete"
        @click="() => deleteList(item)"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import type { SelectValue } from 'ant-design-vue/es/select';
import { BMForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Form } from 'ant-design-vue';
import { PromptsTypeEnum } from '../type';

defineOptions({
  name: 'PromptsItem',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    list?: Array<Recordable>;
    isView?: boolean;
  }>(),
  {
    list: () => [],
    isView: false,
  },
);

const emit = defineEmits<{
  (e: 'update:list', list: Array<Recordable>): void;
  (e: 'change', list: Array<Recordable>): void;
  (e: 'deleteItem', item: Recordable): void;
}>();

const formItemContext = Form.useInjectFormItemContext();
const triggerChange = (changedValue: Recordable) => {
  const newList = props.list.map((item: Recordable) => {
    if (item.key === changedValue.key) {
      return { ...item, ...changedValue };
    }
    return item;
  });
  emit('update:list', newList);
  emit('change', newList);
  formItemContext.onFieldChange();
};
const deleteList = (item: Recordable) => {
  // Modal.confirm({
  //   title: t('删除提示词信息'),
  //   icon: h(ExclamationCircleOutlined),
  //   content: t('是否删除该条提示词信息'),
  //   async onOk() {
  //     try {
  //       const newList = props.list.filter((conditionItem: Recordable) => conditionItem.key !== item.key);
  //       emit('update:list', newList);
  //       emit('change', newList);
  //       emit('deleteItem', item);
  //       formItemContext.onFieldChange();
  //       return Promise.resolve();
  //     }
  //     catch (error: any) {
  //       return Promise.reject(error);
  //     }
  //   },
  // });
  const newList = props.list.filter((conditionItem: Recordable) => conditionItem.key !== item.key);
  emit('update:list', newList);
  emit('change', newList);
  emit('deleteItem', item);
  formItemContext.onFieldChange();
};
const onChange = (value: SelectValue, key: string, item: Recordable) => {
  triggerChange({
    ...item,
    [key]: value,
  });
};

const formRefs = ref<Recordable>({});
const getFormRefs = (el: any, item: Recordable) => {
  if (el) {
    formRefs.value[item.key] = el;
  }
};

watch(
  () => props.list,
  async () => {
    await nextTick();
    Object.keys(formRefs.value).forEach((key) => {
      const materialItem = props.list.find((item: any) => {
        return item.key?.toString() === key?.toString();
      });
      if (materialItem) {
        formRefs.value[key].setFormModels(materialItem);
      }
    });
  },
  {
    immediate: true,
    deep: true,
  },
);

watch(
  () => props.isView,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      await nextTick();
      Object.keys(formRefs.value).forEach((key) => {
        formRefs.value[key].setFormProps({
          disabled: true,
        });
      });
    }
  },
  { immediate: true },
);

const formProps: Ref<FormProps> = ref({
  layout: 'vertical',
  showAdvancedButton: false,
  showActionButtonGroup: false,
  baseColProps: {
    span: 24,
  },
  schemas: [
    {
      component: 'Select',
      label: t('类型'),
      field: 'type',
      required: true,
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          // 遍历 PromptsTypeEnum enum 构成下拉框的选项
          options: Object.values(PromptsTypeEnum).map((value) => {
            return {
              label: value,
              value,
              disabled: value === PromptsTypeEnum.System,
            };
          }),
          onChange: (value: SelectValue, _option: any) => {
            onChange(value, 'type', formModel as Recordable);
          },
          disabled: formModel.type === PromptsTypeEnum.System,
          popupClassName: 'prompts-select-dropdown',
        };
      },
      formItemProps: {
        htmlFor: `type${Math.random()}`,
      },
    },
    {
      component: 'InputTextArea',
      label: t('提示词'),
      field: 'prompt',
      required: true,
      useMaxLengthRule: false,
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          onChange: () => {
            onChange(formModel.prompt, 'prompt', formModel as Recordable);
          },
        };
      },
      formItemProps: {
        htmlFor: `prompt${Math.random()}`,
      },
    },
  ],
});

const validateForm = async () => {
  try {
    const formRefList = Object.values(formRefs.value);
    const validateResult = await Promise.all(formRefList.map((formInstance: any) => formInstance.validate()));
    return Promise.resolve(validateResult);
  }
  catch (error) {
    return Promise.reject(error);
  }
};

defineExpose({
  validateForm,
  formRefs,
});
</script>

<style lang="less" scoped>
.list-item {
  background-color: var(--bmos-background-color);
  padding: var(--bmos-padding-mini);
  margin-bottom: var(--bmos-margin-large);
  .label {
    display: inline-block;
    color: var(--bmos-third-level-text-color);
    margin-bottom: var(--bmos-margin-small);
    margin-top: var(--bmos-margin-large);
  }
  .delete-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--bmos-margin-large);
    .delete-icon {
      color: var(--bmos-danger-color);
    }
  }
}
</style>

<style lang="less">
  .prompts-select-dropdown {
  .ant-select-item-option-disabled {
    display: none;
  }
}
</style>
