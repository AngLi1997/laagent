import { I18nLanguageEnum, getLanguage, t } from '@bmos/i18n';
import { isNumber, isString } from '@bmos/utils';
import type { RuleObject } from 'ant-design-vue/es/form/';
import dayjs from 'dayjs';
import { Component, VNode } from 'vue';
import { JSX } from 'vue/jsx-runtime';
import type { Recordable } from '../../../common/types/index';
import type { ComponentMapType } from '../types/component';

function getPlaceholder(prefix: string, labelResult: string): string {
  const language = getLanguage();
  return language === I18nLanguageEnum.ZH_CN ? `${prefix}${labelResult}` : `${prefix} ${labelResult}`;
}

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(
  component: ComponentMapType,
  label: Component | VNode | string | JSX.Element | undefined = '',
) {
  const labelResult = isString(label) ? `${label}` : '';
  if (component.includes('Input') || component.includes('Complete')) {
    return getPlaceholder(t('请输入'), labelResult);
  }
  const chooseTypes: ComponentMapType[] = [
    'Select',
    'Cascader',
    'Checkbox',
    'CheckboxGroup',
    'Switch',
    'TreeSelect',
    'RadioGroup',
  ];
  if (component.includes('Picker') || chooseTypes.includes(component)) {
    return getPlaceholder(t('请选择'), labelResult);
  }
  if (component.includes('RangePicker')) {
    return [getPlaceholder(t('开始'), labelResult), getPlaceholder(t('结束'), labelResult)];
  }
  if (component.includes('Upload')) {
    return getPlaceholder(t('点击上传'), labelResult);
  }
  if (component.includes('Rate')) {
    return getPlaceholder(t('请评分'), labelResult);
  }
  if (component.includes('Slider')) {
    return getPlaceholder(t('请滑动'), labelResult);
  }
  if (component.includes('Transfer')) {
    return getPlaceholder(t('请选择'), labelResult);
  }
  if (component.includes('Mentions')) {
    return getPlaceholder(t('请输入'), labelResult);
  }
  return getPlaceholder(t('请输入'), '');
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
  return [...DATE_TYPE, 'RangePicker'];
}

export function setComponentRuleType(rule: RuleObject, component: ComponentMapType, valueFormat: string) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object';
  } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array';
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number';
  }
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr;
  if (valueFormat) {
    // attr.value = isObject(value) ? dayjs(value).format(valueFormat) : value
  } else if (DATE_TYPE.includes(component) && value) {
    attr.value = dayjs(attr.value);
  }
}

export function handleInputNumberValue(component?: ComponentMapType, val?: any) {
  if (!component) return val;
  if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
    return val && isNumber(val) ? `${val}` : val;
  }
  return val;
}

/**
 * 时间字段
 */
export const dateItemType = genType();
