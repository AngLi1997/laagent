import {
  cloneDeep,
  dateUtil,
  deepMerge,
  isArray,
  isFunction,
  isNullOrUnDef,
  isObject,
  isString,
  omit,
  set,
} from '@bmos/utils';
import { DefineComponent, unref } from 'vue';
import type { Key, Recordable } from '../../../common/types/index';
import type { FormProps } from '../types/bm-form';
import type { FormState } from './useFormState';

type UseFormMethodsContext = FormState;

export type FormMethods = ReturnType<typeof useFormMethods>;

export const useFormMethods = (formMethodsContext: UseFormMethodsContext) => {
  const { compRefMap, formModel, formPropsRef, cacheFormModel, defaultFormValues, getFormProps } = formMethodsContext;

  /**
   * @description 设置表单组件实例
   * @param field 字段
   */
  const setItemRef = (field: string) => {
    return (el: DefineComponent<any>) => {
      if (el) {
        compRefMap.set(field, el);
      }
    };
  };

  /**
   * @description 设置某个字段的值
   * @param key 字段
   * @param value 值
   */
  const setFormModel = (key: string, value: any) => {
    const keys = key.split('.');
    set(formModel, keys, value);
    set(cacheFormModel, keys, value);
    // const { validateTrigger } = unref(getFormProps);
    // if (!validateTrigger || validateTrigger === 'change') {
    //   bmFormRef.value?.validateFields([key]);
    // }
  };

  /**
   * @description 设置formModel的值
   * @param values 表单数据
   */
  const setFormModels = (values: any) => {
    for (const [key, value] of Object.entries(cloneDeep(values) as Record<string, any>)) {
      setFormModel(key, value);
    }
  };

  /**
   * @description 替换formModel的值
   * @param values 表单数据
   */
  const replaceFormModels = (values: any) => {
    for (const [key, value] of Object.entries(cloneDeep(values) as Record<string, any>)) {
      setFormModel(key, value);
    }
    for (const [key, _value] of Object.entries(cloneDeep(values) as Record<string, any>)) {
      if (!values[key]) {
        delFormModel(key);
      }
    }
  };

  /**
   * @description 获取某个字段的值
   * @param key 字段
   * @returns any
   */
  const getFormModelByField = (keys: Key | Key[]) => {
    if (isArray(keys)) {
      const values: Recordable = {};
      keys.forEach(key => {
        values[key] = formModel[key];
      });
      return values;
    } else {
      return formModel[keys];
    }
  };

  /**
   * @description 删除某个字段
   * @param key 字段
   * @returns boolean
   */
  const delFormModel = (key: Key) => {
    return Reflect.deleteProperty(formModel, key);
  };

  /**
   * @description 设置表单配置
   * @param formProps 表单配置
   */
  const setFormProps = (formProps: Partial<FormProps>) => {
    if (unref(formPropsRef).schemas) {
      formPropsRef.value = deepMerge(unref(formPropsRef) || {}, omit(cloneDeep(formProps), ['schemas']) as FormProps);
    } else {
      formPropsRef.value = deepMerge(unref(formPropsRef) || {}, formProps as FormProps);
    }
  };

  /**
   * @description 处理表单数据
   * @param values 表单数据
   */
  function handleFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {};
    }
    const res: Recordable = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if (!key || isFunction(value)) {
        continue;
      }
      const transformDateFunc = unref(getFormProps).transformDateFunc;
      if (isObject(value)) {
        value = transformDateFunc?.(value);
      }

      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map(item => transformDateFunc?.(item));
      }
      // Remove spaces
      if (isString(value)) {
        value = value.trim();
      }
      set(res, key, value);
    }
    return handleRangeTimeValue(res);
  }

  /**
   * @description 处理时间范围
   * @param values 表单数据
   */
  function handleRangeTimeValue(values: Recordable) {
    const fieldMapToTime = unref(getFormProps).fieldMapToTime;

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }

    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) {
        continue;
      }

      const [startTime, endTime]: string[] = values[field];
      if (!startTime || !endTime) {
        continue;
      }
      values[startTimeKey] = dateUtil(startTime).format(format);
      values[endTimeKey] = dateUtil(endTime).format(format);
      Reflect.deleteProperty(values, field);
    }

    return values;
  }

  const setNestedFormModel = (formModel: Recordable, keys: string[], defaultValue: any) => {
    let current = formModel;
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!current[key] || !isObject(current[key])) {
        current[key] = {};
      }
      if (i === keys.length - 1) {
        current[key] = defaultValue;
      }
      current = current[key];
    }
  };

  /**
   * @description 初始化表单数据
   */
  const initFormValues = (initialValues?: Recordable) => {
    try {
      unref(formPropsRef).schemas?.forEach((item: { field?: any; defaultValue?: any }) => {
        const { defaultValue } = item;
        const namePath = isArray(item.field) ? item.field : item.field.split('.');
        if (namePath.length > 1) {
          setNestedFormModel(formModel, namePath, defaultValue);
          setNestedFormModel(cacheFormModel, namePath, defaultValue);
          setNestedFormModel(defaultFormValues, namePath, defaultValue);
        } else if (!isNullOrUnDef(defaultValue)) {
          formModel[item.field] = defaultValue;
          cacheFormModel[item.field] = defaultValue;
          defaultFormValues[item.field] = defaultValue;
        }
      });
      if (initialValues && isObject(initialValues)) {
        Object.keys(initialValues).forEach(key => {
          defaultFormValues[key] = !isNullOrUnDef(initialValues[key]) ? initialValues[key] : undefined;
          cacheFormModel[key] = !isNullOrUnDef(initialValues[key]) ? initialValues[key] : undefined;
          formModel[key] = !isNullOrUnDef(initialValues[key]) ? initialValues[key] : undefined;
        });
      }
    } catch (error) {}
  };

  return {
    setItemRef,
    initFormValues,
    setFormModel,
    setFormModels,
    delFormModel,
    replaceFormModels,
    setFormProps,
    handleFormValues,
    getFormModelByField,
  };
};
