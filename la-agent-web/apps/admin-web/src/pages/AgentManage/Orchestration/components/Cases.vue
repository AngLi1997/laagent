<template>
  <div v-for="(item, index) in list.slice(0, list.length - 1)" :key="item.key" class="list-item">
    <BMForm :ref="(el: any) => getFormRefs(el, item)" v-bind="formProps" :merge-dynamic-data="{ caseIndex: index }" />
  </div>
  <div v-if="!isView" class="elif-container" @click="() => addList()">
    <BMIcons icon="Add" style="width: 14px; height: 14px" />
    ELSE IF
  </div>
  <div class="else-container">
    <div class="else-title">
      ELSE
    </div>
    <div class="else-text">
      {{ t('用于定义当IF条件不满足是应执行的逻辑。') }}
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import type { SelectValue } from 'ant-design-vue/es/select';
import { BMForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { getUUID } from '@bmos/utils';
import { Button, Form } from 'ant-design-vue';
import Condition from './Condition.vue';

defineOptions({
  name: 'Cases',
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
  const newList = props.list.filter((conditionItem: Recordable) => conditionItem.key !== item.key);
  emit('update:list', newList);
  emit('change', newList);
  emit('deleteItem', item);
  formItemContext.onFieldChange();
};

const codeArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const addCondition = (caseIndex: number) => {
  const newList = [...props.list];
  // 通过 index 获取当前的条件
  const currentCondition = newList[caseIndex];
  if (currentCondition.conditions?.length) {
    // 获取最后一个条件condition的key
    const lastConditionKey = currentCondition.conditions[currentCondition.conditions.length - 1].key;
    currentCondition.conditions.push({
      // lastConditionKey 的后一个 codeArr
      key: codeArr[codeArr.indexOf(lastConditionKey) + 1] || codeArr[0],
    });
  }
  else {
    currentCondition.conditions = [
      {
        key: codeArr[0],
      },
    ];
  }
  emit('update:list', newList);
  emit('change', newList);
  formItemContext.onFieldChange();
};
const deleteCondition = (caseIndex: number, code: string) => {
  const newList = [...props.list];
  const currentCondition = newList[caseIndex];
  currentCondition.conditions = currentCondition.conditions?.filter((item: any) => item.key !== code);
  emit('update:list', newList);
  emit('change', newList);
  formItemContext.onFieldChange();
};

const updateCondition = (conditions: Array<Recordable>, caseIndex: number) => {
  const newList = [...props.list];
  const currentCondition = newList[caseIndex];
  currentCondition.conditions = conditions;
  emit('update:list', newList);
  emit('change', newList);
  formItemContext.onFieldChange();
};

const addList = () => {
  const newList = [...props.list];
  // 添加一个新的条件 在 倒数第二个位置
  newList.splice(newList.length - 1, 0, {
    key: getUUID('case'),
    conditions: [],
  });
  emit('update:list', newList);
  emit('change', newList);
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
      component: ({ formModel, values }: RenderCallbackParams) => {
        return (
          <Condition
            v-model:list={formModel.conditions}
            isView={props.isView}
            onDeleteList={(code: string) => deleteCondition(values.caseIndex, code)}
            onUpdate={(conditions) => {
              updateCondition(conditions, values.caseIndex);
            }}
          />
        );
      },
      label: ({ formModel, values }: RenderCallbackParams) => {
        return !formModel.conditions?.length
          ? (
              <div class="case-label">
                <span class="title">{ values.caseIndex ? 'ELIF' : 'IF'}</span>
                {
                  props.isView
                    ? null
                    : (
                        <>
                          <Button
                            type="link"
                            style={{
                              gap: '4px',
                              height: '18px',
                              padding: '0',
                              lineHeight: '18px',
                            }}
                            icon={(
                              <BMIcons
                                icon="Add"
                                style="width: 14px; height: 14px"
                              />
                            )}
                            onClick={() => {
                              addCondition(values.caseIndex);
                            }}
                          >
                            {t('添加条件')}
                          </Button>
                          {
                            values.caseIndex
                              ? (
                                  <div style={{ flex: 1, textAlign: 'right' }}>
                                    <Button
                                      type="link"
                                      style={{
                                        gap: '4px',
                                        height: '18px',
                                        padding: '0',
                                        lineHeight: '18px',
                                        color: 'var(--bmos-danger-color)',
                                      }}
                                      icon={(
                                        <BMIcons
                                          icon="Delete"
                                          style="width: 14px; height: 14px; color: var(--bmos-danger-color)"
                                        />
                                      )}
                                      onClick={() => {
                                        deleteList(formModel);
                                      }}
                                    >
                                      {t('移除')}
                                    </Button>
                                  </div>
                                )
                              : null
                          }

                        </>
                      )
                }

              </div>
            )
          : (
              <div class="case-label">
                <span class="title">{ values.caseIndex ? 'ELIF' : 'IF'}</span>
                <span class="case">{`case ${values.caseIndex + 1}`}</span>
              </div>
            );
      },
      field: 'conditions',
      formItemProps: {
        htmlFor: `case${Math.random()}`,
      },
    },
    {
      component: ({ formModel, values }: RenderCallbackParams) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="link"
              style={{
                gap: '4px',
                height: '18px',
                padding: '0',
                lineHeight: '18px',
              }}
              icon={(
                <BMIcons
                  icon="Add"
                  style="width: 14px; height: 14px"
                />
              )}
              onClick={() => {
                addCondition(values.caseIndex);
              }}
            >
              {t('添加条件')}
            </Button>
            {
              values.caseIndex
                ? (
                    <Button
                      type="link"
                      style={{
                        gap: '4px',
                        height: '18px',
                        padding: '0',
                        lineHeight: '18px',
                        color: 'var(--bmos-danger-color)',
                      }}
                      icon={(
                        <BMIcons
                          icon="Delete"
                          style="width: 14px; height: 14px; color: var(--bmos-danger-color)"
                        />
                      )}
                      onClick={() => {
                        deleteList(formModel);
                      }}
                    >
                      {t('移除')}
                    </Button>
                  )
                : null
            }

          </div>
        );
      },
      field: 'addCase',
      noLabel: true,
      noFormItemMarginBottom: true,
      vIf: ({ formModel }: RenderCallbackParams) => formModel.conditions?.length && !props.isView,
    },
    {
      component: 'Input',
      label: t('逻辑表达式'),
      field: 'logic',
      required: true,
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          onChange: () => {
            onChange(formModel.logic, 'logic', formModel as Recordable);
          },
        };
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.conditions?.length,
      formItemProps: {
        htmlFor: `logic${Math.random()}`,
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
  padding: var(--bmos-padding-mini) var(--bmos-padding-mini) 0 var(--bmos-padding-mini);
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
.else-container {
  border-radius: 4px;
  background: #f5f7fa;
  font-style: normal;
  height: 70px;
  padding: 12px 14px;
  .else-title {
    color: var(--bmos-first-level-text-color);
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    margin-bottom: 12px;
  }
  .else-text {
    color: var(--bmos-third-level-text-color);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }
}
.elif-container {
  display: flex;
  padding: 6px 16px;
  justify-content: center;
  color: var(--bmos-third-level-text-color);
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  border: 1px solid #c8cacc;
  background: #fff;
  cursor: pointer;
  margin-bottom: var(--bmos-margin-large);
}
:deep(.case-label) {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  .title {
    color: #18191a;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
  }
  .case {
    color: #606266;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
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
