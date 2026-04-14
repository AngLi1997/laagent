<template>
  <Col v-if="getShow.isIfShow" v-show="getShow.isShow" v-bind="getColConfig(schema.colProps)" class="from-col">
    <template v-if="schema.component === 'Divider'">
      <div class="bmos-form-divider-container">
        <div v-if="getComponentProps.showLeftBorder" class="bmos-form-divider-border" />
        <Divider v-bind="objectPick(getComponentProps, aDividerPropKeys)" class="bmos-form-divider">
          <component :is="renderLabelHelpMessage" />
        </Divider>
      </div>
    </template>
    <template v-else-if="schema.component === 'FormGroup'">
      <component :is="formGroupLabel" />
    </template>
    <template v-else-if="schema.component === 'TableTitle'">
      <BMTableTitle v-bind="getComponentProps" :title="renderTableTitle" />
    </template>
    <Form.Item
      v-else
      :class="[
        noFormItemMarginBottom ? 'no-margin-bottom' : '',
        schema.labelFullWidth ? 'label-full-width' : '',
        schema.noLabel ? 'no-label' : '',
      ]"
      v-bind="{ ...schema.formItemProps }"
      :name="namePath"
      :label-col="itemLabelWidthProp.labelCol"
      :wrapper-col="itemLabelWidthProp.wrapperCol"
      :rules="getRules"
    >
      <template #label>
        <component :is="renderLabelHelpMessage" v-if="labelIsFunction" />
        <component :is="renderLabelHelpMessage" v-else />
      </template>
      <slot v-if="schema.slot" :name="schema.slot" v-bind="getValues" />
      <component
        :is="getComponent"
        v-else-if="!componentIsString"
        :ref="setItemRef(schema.field)"
        v-model:[modelValueType]="modelValue"
        :allow-clear="true"
        v-bind="getComponentProps"
        :disabled="getDisable"
        :loading="schema.loading"
        v-on="componentEvents"
      />
      <component
        :is="getComponent"
        v-else-if="getComponent"
        :ref="setItemRef(schema.field)"
        v-model:[modelValueType]="modelValue"
        :allow-clear="true"
        v-bind="getComponentProps"
        :disabled="getDisable"
        :loading="schema.loading"
        v-on="componentEvents"
      >
        <template v-if="Object.is(schema.loading, true)" #notFoundContent>
          <Spin size="small" />
        </template>
        <template v-for="(slotFn, slotName) in getComponentSlots" #[slotName]="slotData" :key="slotName">
          <component :is="slotFn?.({ ...getValues, slotData }) ?? slotFn" :key="slotName" />
        </template>
      </component>
    </Form.Item>
  </Col>
</template>

<script setup lang="tsx">
import type { RuleObject } from 'ant-design-vue/es/form/';
import type { Recordable } from '../../common/types';
import type { ColEx, ComponentProps, CustomRenderFn, FormSchema, RenderCallbackParams } from './types/';
import type { ComponentMapType } from './utils/componentMap';
import { t } from '@bmos/i18n';
import {
  cloneDeep,
  debounce,
  deepMerge,
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isObject,
  isString,
  objectPick,
} from '@bmos/utils';
import { Col, Divider, Form, Spin } from 'ant-design-vue';
import { computed, isVNode, nextTick, onMounted, toRefs, unref, watch } from 'vue';
import { BMTableTitle } from '../../TableTitle';
import BasicHelp from './components/Help.vue';
import { useFormContext } from './hooks/useFormContext';
import { useItemLabelWidth } from './hooks/useLabelWidth';
import { bmFormItemProps } from './types/bm-form-item';
import { aDividerPropKeys } from './types/component';
import { componentMap } from './utils/componentMap';
import { createPlaceholderMessage } from './utils/helper';

defineOptions({
  name: 'BMFormItem',
});

const props = defineProps(bmFormItemProps);

const emit = defineEmits(['update:formModel']);

// bmForm组件实例
const formContext = useFormContext();
const { formPropsRef, setItemRef, updateSchema, getSchemaByFiled, appendSchemaByField } = formContext;

const { schema } = toRefs(props);

// 获取 col 的配置
const getColConfig = (colProps: Partial<ColEx> | undefined): Recordable => {
  const { baseColProps } = unref(formPropsRef);
  const config = deepMerge({ ...baseColProps }, { ...colProps });
  return config;
};
  // @ts-ignore
const itemLabelWidthProp = useItemLabelWidth(schema, formPropsRef);

const noFormItemMarginBottom = computed(() => {
  const { noFormItemMarginBottom } = schema.value;
  return noFormItemMarginBottom || false;
});

const namePath = computed<string[]>(() => {
  return isArray(schema.value.field) ? schema.value.field : schema.value.field.split('.');
});

const modelValue = computed({
  get() {
    return namePath.value.reduce((prev, field) => prev?.[field], props.formModel);
  },
  set(val) {
    const namePath = schema.value.field.split('.');
    const prop = namePath.pop()!;
    const target = namePath.reduce((prev, field) => (prev[field] ??= {}), props.formModel);
    target[prop] = val;
    emit('update:formModel', props.formModel);
  },
});

const modelValueType = computed<string>(() => {
  const { component, componentProps } = schema.value;
  if (!isFunction(componentProps) && componentProps?.vModelKey) {
    return componentProps.vModelKey;
  }
  const isCheck = isString(component) && ['Switch', 'Checkbox'].includes(component);
  const isUpload = component === 'Upload';
  return {
    true: 'value',
    [`${isCheck}`]: 'checked',
    [`${isUpload}`]: 'file-list',
  }.true;
});

const getValues = computed<RenderCallbackParams>(() => {
  const { formModel, schema } = props;

  const { mergeDynamicData } = unref(formPropsRef);
  return {
    field: schema.field,
    formInstance: formContext,
    formModel,
    values: {
      ...mergeDynamicData,
      ...formModel,
    } as Recordable,
    schema,
  };
});

const getShow = computed<{ isShow: boolean; isIfShow: boolean }>(() => {
  const { vShow, vIf, isAdvanced = false } = unref(schema);
  const { showAdvancedButton } = unref(formPropsRef);
  const itemIsAdvanced = showAdvancedButton ? (isBoolean(isAdvanced) ? isAdvanced : true) : true;

  let isShow = true;
  let isIfShow = true;

  if (isBoolean(vShow)) {
    isShow = vShow;
  }
  if (isBoolean(vIf)) {
    isIfShow = vIf;
  }
  if (isFunction(vShow)) {
    isShow = vShow(unref(getValues));
  }
  if (isFunction(vIf)) {
    isIfShow = vIf(unref(getValues));
  }
  isShow = isShow && itemIsAdvanced;

  return { isShow, isIfShow };
});

const getDisable = computed(() => {
  const { disabled: globDisabled } = unref(formPropsRef);
  const { dynamicDisabled } = props.schema;
  const { disabled: itemDisabled = false } = unref(getComponentProps);
  let disabled = !!globDisabled || itemDisabled;
  if (isBoolean(dynamicDisabled)) {
    disabled = dynamicDisabled;
  }
  if (isFunction(dynamicDisabled)) {
    disabled = dynamicDisabled(unref(getValues));
  }
  return disabled;
});

const vNodeFactory = (
  component: FormSchema['componentSlots'] | FormSchema['component'],
  values = unref(getValues),
): any => {
  if (isString(component)) {
    return <>{component}</>;
  }
  else if (isVNode(component)) {
    return component;
  }
  else if (isFunction(component)) {
    return vNodeFactory((component as CustomRenderFn)(values));
  }
  else if (isObject(component)) {
    const compKeys = Object.keys(component);
    // 如果是组件对象直接return
    if (compKeys.some(n => n.startsWith('_') || ['setup', 'render'].includes(n))) {
      return component;
    }
    return compKeys.reduce<Recordable<CustomRenderFn>>((slots, slotName) => {
      slots[slotName] = (...rest: any) =>
      // @ts-ignore
        vNodeFactory(component[slotName], ...rest);
      return slots;
    }, {});
  }
  return component;
};

/**
 * @description 当前表单项组件是否为 string
 */
const componentIsString = computed(() => {
  const component = props.schema.component;
  return isString(component);
});

/**
 * @description 当前表单项组件
 */
const getComponent = computed(() => {
  const component = props.schema.component;
  return isString(component)
    ? (componentMap[component] ?? vNodeFactory(component)) // @ts-ignore
    : vNodeFactory(component);
});

/**
 * @description 当前表单项组件的插槽
 */
const getComponentSlots = computed<Recordable<CustomRenderFn>>(() => {
  const componentSlots = props.schema.componentSlots ?? {};
  return isString(componentSlots) || isVNode(componentSlots)
    ? {
        default: (...rest: any) => vNodeFactory(componentSlots, rest),
      }
    : vNodeFactory(componentSlots);
});

const getLabel = computed(() => {
  const label = props.schema.label;
  return isFunction(label) ? label(unref(getValues)) : label;
});
const labelIsFunction = computed(() => isFunction(props.schema.label));

/**
 * @description 表单组件props
 */
const getComponentProps = computed(() => {
  const { schema } = props;
  let { componentProps = {}, component } = schema;
  if (isFunction(componentProps)) {
    componentProps = componentProps(unref(getValues)) ?? {};
  }

  if (component !== 'RangePicker' && isString(component)) {
    componentProps.placeholder ??= createPlaceholderMessage(component, getLabel.value);
  }
  if (schema.component === 'Divider') {
    componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
      orientation: 'left',
      plain: true,
    });
  }
  if (schema.component === 'TreeSelect' || schema.component === 'Select') {
    componentProps = Object.assign(
      {
        virtual: false,
        showArrow: true,
      },
      componentProps,
    );
  }
  if (schema.component === 'TreeSelect') {
    componentProps = Object.assign(
      {
        showSearch: true,
        treeNodeFilterProp: componentProps.fieldNames?.label || 'label',
      },
      componentProps,
    );
  }
  if (schema.component === 'Select') {
    componentProps = Object.assign(
      {
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return (
          // @ts-ignore
            option[componentProps.fieldNames?.label || 'label']?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
          );
        },
      },
      componentProps,
    );
  }
  if (isVNode(getComponent.value)) {
    Object.assign(componentProps, getComponent.value.props);
  }
  return componentProps;
});

/**
 * @description 表单组件事件
 */
const componentEvents = computed(() => {
  const componentProps = props.schema?.componentProps || {};
  return Object.keys(componentProps).reduce((prev, key) => {
    // eslint-disable-next-line regexp/no-unused-capturing-group
    if (/on([A-Z])/.test(key)) {
      // eg: onChange => change
      const eventKey = key.replace(/on([A-Z])/, '$1').toLocaleLowerCase();
      // @ts-ignore
      prev[eventKey] = componentProps[key];
    }
    return prev;
  }, {});
});

const renderLabelHelpMessage = computed(() => {
  const { helpMessage, helpComponentProps, subLabel } = props.schema;
  const renderLabel = subLabel
    ? (
        <span>
          {getLabel.value}
          {' '}
          <span class="text-secondary">{subLabel}</span>
        </span>
      )
    : (
        vNodeFactory(getLabel.value)
      );
  const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage;
  if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
    return renderLabel;
  }
  return (
    <span>
      {renderLabel}
      <BasicHelp placement="top" class="mx-1" text={getHelpMessage} {...helpComponentProps} />
    </span>
  );
});

const renderTableTitle = computed(() => {
  const { label } = props.schema;
  if (!isString(label)) {
    return '';
  }
  return label;
});

const formGroupLabel = computed(() => {
  const renderLabel = vNodeFactory(getLabel.value);
  return (
    <div class="form-group-label" style={getComponentProps.value.style}>
      {renderLabel}
    </div>
  );
});

function setComponentRuleType(rule: RuleObject, component: ComponentMapType, valueFormat: string) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object';
  }
  else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array';
  }
  else if (['InputNumber'].includes(component)) {
    rule.type = 'number';
  }
}

const getRules = computed(() => {
  const { rules: defRules = [], component, rulesMessageJoinLabel, dynamicRules, required } = props.schema;

  if (isFunction(dynamicRules)) {
    const newRules = dynamicRules(unref(getValues)) as RuleObject[];
    if ((component === 'Input' || component === 'AutoComplete') && props.useMaxLengthRule) {
      newRules.push({
        validator: (rule: any, value: any) => {
          if (value && value.toString().length > 100) {
            return Promise.reject(t('输入内容过长, 不能超过100字符'));
          }
          return Promise.resolve();
        },
      });
    }
    if (component === 'InputTextArea' && props.useMaxLengthRule) {
      newRules.push({
        validator: (rule: any, value: any) => {
          if (value && value.toString().length > 200) {
            return Promise.reject(t('输入内容过长, 不能超过200字符'));
          }
          return Promise.resolve();
        },
      });
    }
    return newRules;
  }

  let rules: RuleObject[] = cloneDeep(defRules);
  const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = unref(formPropsRef);

  const joinLabel = Reflect.has(unref(formPropsRef), 'rulesMessageJoinLabel')
    ? rulesMessageJoinLabel
    : globalRulesMessageJoinLabel;
  const defaultMsg = isString(component)
    ? `${createPlaceholderMessage(component, getLabel.value)}${joinLabel ? getLabel.value : ''}`
    : undefined;

  const getRequired = isFunction(required) ? required(unref(getValues)) : required;

  function validator(rule: any, value: any) {
    const msg = rule.message || defaultMsg;

    if (value === undefined || isNull(value)) {
      // 空值
      return Promise.reject(msg);
    }
    else if (Array.isArray(value) && value.length === 0) {
      // 数组类型
      return Promise.reject(msg);
    }
    else if (typeof value === 'string' && value.trim() === '') {
      // 空字符串
      return Promise.reject(msg);
    }
    else if (
      typeof value === 'object'
      && Reflect.has(value, 'checked')
      && Reflect.has(value, 'halfChecked')
      && Array.isArray(value.checked)
      && Array.isArray(value.halfChecked)
      && value.checked.length === 0
      && value.halfChecked.length === 0
    ) {
      // 非关联选择的tree组件
      return Promise.reject(msg);
    }
    return Promise.resolve();
  }

  if ((!rules || rules.length === 0) && getRequired) {
    rules = [{ required: getRequired, validator }];
  }
  if ((component === 'Input' || component === 'AutoComplete') && props.useMaxLengthRule) {
    rules = [
      ...rules,
      {
        validator: (rule: any, value: any) => {
          if (value && value.toString().length > 100) {
            return Promise.reject(t('输入内容过长, 不能超过100字符'));
          }
          return Promise.resolve();
        },
      },
    ];
  }

  if (component === 'InputTextArea' && props.useMaxLengthRule) {
    rules = [
      ...rules,
      {
        validator: (rule: any, value: any) => {
          if (value && value.toString().length > 200) {
            return Promise.reject(t('输入内容过长, 不能超过200字符'));
          }
          return Promise.resolve();
        },
      },
    ];
  }

  const requiredRuleIndex: number = rules.findIndex(
    (rule: object) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
  );

  if (requiredRuleIndex !== -1) {
    const rule = rules[requiredRuleIndex];

    if (component && isString(component)) {
      if (!Reflect.has(rule, 'type')) {
        rule.type = component === 'InputNumber' ? 'number' : 'string';
      }

      rule.message = rule.message || defaultMsg;

      if (component.includes('Input') || component.includes('Textarea')) {
        rule.whitespace = true;
      }
      const valueFormat = unref(getComponentProps)?.valueFormat;
      setComponentRuleType(rule, component, valueFormat);
    }
  }

  // Maximum input length rule check
  const characterInx = rules.findIndex((val: RuleObject) => val.max);
  if (characterInx !== -1 && !rules[characterInx].validator) {
    rules[characterInx].message
        = rules[characterInx].message || `${t('最大长度为')}${[rules[characterInx].max] as Recordable}`;
  }

  return rules;
});

const fetchRemoteData = async (request: any) => {
  if (request) {
    const { component } = unref(schema);
    let newSchema = {
      ...unref(schema),
      loading: true,
      componentProps: {
        ...unref(getComponentProps),
        options: [],
      } as ComponentProps,
    };
    try {
      const result = await request();
      newSchema = {
        ...unref(schema),
        loading: true,
        componentProps: {
          ...unref(getComponentProps),
          options: [],
        } as ComponentProps,
      };
      if (isString(component)) {
        if (['Select', 'RadioGroup', 'CheckBoxGroup'].includes(component)) {
          newSchema.componentProps.options = result;
        }
        else if (['TreeSelect', 'Tree'].includes(component)) {
          newSchema.componentProps.treeData = result;
        }
      }
      if (newSchema.componentProps) {
        newSchema.componentProps.requestResult = result;
      }
      newSchema.loading = false;
      updateSchema(newSchema);
    }
    catch (_error) {
      newSchema.loading = false;
      updateSchema(newSchema);
    }
    finally {
      nextTick(() => {
        schema.value.loading = false;
      });
    }
  }
};

const initRequestConfig = () => {
  const request = getComponentProps.value.request;
  if (request) {
    if (isFunction(request)) {
      fetchRemoteData(request);
    }
    else {
      const { watchFields = [], options = {}, wait = 0, callback } = request;
      const params = watchFields.map((field: any) => () => props.formModel[field]);
      watch(
        params,
        debounce(() => {
          fetchRemoteData(callback);
        }, wait),
        {
          ...options,
        },
      );
    }
  }
};

// watch(
//   () => props.schema,
//   () => {
//     initRequestConfig();
//   },
// );

onMounted(async () => {
  if (!getSchemaByFiled(props.schema.field)) {
    appendSchemaByField(props.schema);
  }
  await nextTick();
  initRequestConfig();
});
</script>
