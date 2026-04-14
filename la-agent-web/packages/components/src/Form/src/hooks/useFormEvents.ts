import type { NamePath } from 'ant-design-vue/es/form/interface';
import type { Recordable } from '../../../common/types/index';
import type { BMFormEmitFn } from '../types/bm-form';
import type { FormSchema } from '../types/form';
import type { FormMethods, FormState } from './index';
import { cloneDeep, deepMerge, isArray, isFunction, isNullOrUnDef, isObject, isString, uniqBy } from '@bmos/utils';
import dayjs from 'dayjs';
import { toRaw, unref, watch } from 'vue';
import { dateItemType, handleInputNumberValue } from '../utils/helper';

type UseFormActionContext = FormState & {
  emit: BMFormEmitFn;
  handleFormValues: FormMethods['handleFormValues'];
};

export type FormEvents = ReturnType<typeof useFormEvents>;

export function useFormEvents(formActionContext: UseFormActionContext) {
  const {
    emit,
    formPropsRef,
    formSchemasRef,
    formModel,
    cacheFormModel,
    getFormProps,
    bmFormRef,
    defaultFormValues,
    originComponentPropsFnMap,
    handleFormValues,
  } = formActionContext;

  function getFormValues(): Recordable {
    const formEl = unref(bmFormRef);
    if (!formEl)
      return {};
    return handleFormValues(toRaw(unref(formModel)));
  }

  /**
   * @description: 判断是否是时间类型
   * @param {string} key
   * @return {*}
   */
  function itemIsDateType(key: string) {
    return unref(formPropsRef).schemas?.some((item: any) => {
      return item.field === key && isString(item.component) ? dateItemType.includes(item.component) : false;
    });
  }

  /**
   * @description: 设置表单字段值
   * @param {Recordable} values
   * @return {*}
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    const schemas = unref(formSchemasRef);
    const fields = schemas.map((item: { field: any }) => item.field.split('.')[0]).filter(Boolean);

    Object.assign(cacheFormModel, values);
    const validKeys: string[] = [];
    Object.keys(values).forEach((key) => {
      const schema = schemas.find((item: { field: string }) => item.field.split('.')[0] === key);
      let value = values[key];
      const hasKey = Reflect.has(values, key);
      if (isString(schema?.component)) {
        value = handleInputNumberValue(schema?.component, value);
      }
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(value)) {
            const arr: any[] = [];
            for (const ele of value) {
              arr.push(ele ? dayjs(ele) : null);
            }
            formModel[key] = arr;
          }
          else {
            const { componentProps } = schema || {};
            let _props = componentProps as any;
            if (isFunction(componentProps)) {
              _props = _props({ formPropsRef, formModel });
            }
            formModel[key] = value ? (_props?.valueFormat ? value : dayjs(value)) : null;
          }
        }
        else {
          formModel[key] = value;
        }
        validKeys.push(key);
      }
    });
    // validateFields(validKeys);
  }
  /**
   * @description 重置表单
   * @param {Partial<FormSchema> | Partial<FormSchema>[]} data
   */
  async function resetSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    // @ts-ignore
    unref(formPropsRef).schemas = updateData as FormSchema[];
  }

  /**
   * @description: 删除所有的 Schema
   * @param {string | string[]} fields 排除的字段
   */
  function removeAllSchema(fields?: string | string[]) {
    const schemaList: any = cloneDeep(unref(formSchemasRef));
    let fieldList: string[] = fields ? (isString(fields) ? [fields] : fields) : [];
    if (isString(fields)) {
      fieldList = [fields];
    }
    formPropsRef.value.schemas = schemaList.filter((item: { field: string }) => fieldList.includes(item.field));
  }

  /**
   * @description: 插入到指定 filed 后面，如果没传指定 field，则插入到最后,当 first = true 时插入到第一个位置
   * @param {FormSchema} schemaItem 插入的 schema
   * @param {string} prefixField 指定的 filed
   * @param {boolean} first 是否插入到第一个位置
   */
  async function appendSchemaByField(schemaItem: FormSchema, prefixField?: string, first = false) {
    const schemaList: any = cloneDeep(unref(formSchemasRef));

    const index = schemaList.findIndex((schema: { field: string | undefined }) => schema.field === prefixField);

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schemaItem) : schemaList.push(schemaItem);
      formModel[schemaItem.field] = schemaItem.defaultValue;
      formPropsRef.value.schemas = schemaList;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schemaItem);
    }
    formModel[schemaItem.field] = schemaItem.defaultValue;
    formPropsRef.value.schemas = schemaList;
  }

  /**
   * @description: 插入到指定 filed 后面，如果没传指定 field，则插入到最后,当 first = true 时插入到第一个位置
   * @param {FormSchema[]} schemaItem 插入的 schema 数组
   * @param {string} prefixField 指定的 filed
   * @param {boolean} first 是否插入到第一个位置
   */
  async function appendSchemasByField(schemaItem: FormSchema[], prefixField?: string, first = false) {
    const schemaList: any = cloneDeep(unref(formSchemasRef));

    const index = schemaList.findIndex((schema: { field: string | undefined }) => schema.field === prefixField);

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(...schemaItem) : schemaList.push(...schemaItem);
      schemaItem.forEach((item) => {
        if (!isNullOrUnDef(item.defaultValue)) {
          formModel[item.field] = item.defaultValue;
        }
      });
      formPropsRef.value.schemas = schemaList;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, ...schemaItem);
    }
    schemaItem.forEach((item) => {
      if (!isNullOrUnDef(item.defaultValue)) {
        formModel[item.field] = item.defaultValue;
      }
    });
    formPropsRef.value.schemas = schemaList;
  }

  /**
   * @description: 根据 field 删除 Schema
   * @param {string | string[]} fields field
   * @param {boolean} isInclude 是否是field包含的字符串 默认false
   * @return {*}
   */
  function removeSchemaByFiled(fields: string | string[], isInclude = false) {
    const schemaList: any = cloneDeep(unref(formSchemasRef));

    if (!fields) {
      return;
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields;
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      if (isString(field)) {
        const index = schemaList.findIndex((schema: { field: string }) => schema.field === field);
        if (index !== -1) {
          Reflect.deleteProperty(formModel, field);
          schemaList.splice(index, 1);
        }
        // 如果是包含的字符串， 找出所有包含的 schema，并删除
        if (isInclude) {
          const removeSchemaList = schemaList.filter((schema: { field: string }) => schema.field.includes(field));
          removeSchemaList.forEach((item: { field: string }) => {
            Reflect.deleteProperty(formModel, item.field);
            const i = schemaList.findIndex((schema: { field: string }) => schema.field === item.field);
            i !== -1 && schemaList.splice(i, 1);
          });
        }
      }
    }
    formPropsRef.value.schemas = schemaList;
  }

  /**
   * @description: 根据 field 查找 Schema
   * @param {string | string[]} fields field
   */
  function getSchemaByFiled(fields: string | string[]): FormSchema | undefined {
    const schemaList = unref(formSchemasRef);
    const fieldList = ([] as string[]).concat(fields);
    return schemaList.find((schema: { field: string }) => fieldList.includes(schema.field));
  }

  /**
   * @description  更新formItemSchema
   * @param {Partial<FormSchema> | Partial<FormSchema>[]} data
   * @return {*}
   */
  const updateSchema = (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every(
      item =>
        item.component === 'Divider' || item.component === 'FormGroup' || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      console.error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    const schemas: FormSchema[] = [];
    unref(formSchemasRef).forEach((val: FormSchema<string>) => {
      const isUpdate = updateData.find(item => item.field === val.field);
      if (isUpdate) {
        const newSchema = deepMerge(val, isUpdate);
        if (originComponentPropsFnMap.has(val.field)) {
          const originCompPropsFn = originComponentPropsFnMap.get(val.field)!;
          const compProps = { ...newSchema.componentProps };
          newSchema.componentProps = (opt: any) => {
            const res = {
              ...originCompPropsFn(opt),
              ...compProps,
            };
            return res;
          };
        }
        schemas.push(newSchema);
      }
      else {
        schemas.push(val);
      }
    });
    unref(formPropsRef).schemas = uniqBy(schemas, 'field');
  };

  /**
   * @description 重置表单
   */
  async function resetForm(): Promise<void> {
    const { resetFunc } = unref(getFormProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());
    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultFormValues[key];
    });

    emit('reset', formModel);
    setTimeout(clearValidate);
  }

  /**
   * @description 滚动到指定表单项
   * @param {NamePath} name 表单项的name
   * @param {ScrollOptions} options 滚动配置
   */
  async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
    await bmFormRef.value?.scrollToField(name, options);
  }

  /**
   * @description 校验表单
   * @param {NamePath[]} nameList 校验指定的表单项
   * @return {*}
   */
  async function validateFields(nameList?: NamePath[] | undefined) {
    return bmFormRef.value?.validateFields(nameList);
  }

  /**
   * @description 校验整个表单
   * @param {NamePath[]} nameList 校验指定的表单项
   * @return {*}
   */
  async function validate(nameList?: NamePath[] | undefined) {
    try {
      await bmFormRef.value?.validate(nameList);
      return getFormValues();
    }
    catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0 && getFormProps.value.scrollToError) {
        scrollToField(error.errorFields[0]?.name, {
          behavior: 'smooth',
        });
      }
      return Promise.reject(error);
    }
  }

  /**
   * @description 清除校验
   * @param {string | string[]} name
   */
  async function clearValidate(name?: string | string[]) {
    await bmFormRef.value?.clearValidate(name);
  }

  /**
   * @description  提交表单
   * @param {Event} e 事件 Event
   * @return {*}
   */
  async function handleSubmit(e?: Event) {
    e && e.preventDefault();
    const { submitFunc } = unref(getFormProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(bmFormRef);
    if (!formEl)
      return;
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit('submit', res);
      return res;
    }
    catch (error: any) {
      return Promise.reject(error);
    }
  }

  /**
   * @description 监听键盘事件
   * @param {KeyboardEvent} e 事件 KeyboardEvent
   */
  const handleEnterPress = (e: KeyboardEvent) => {
    const { autoSubmitOnEnter } = unref(formPropsRef);
    if (!autoSubmitOnEnter)
      return;
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const target: HTMLElement = e.target as HTMLElement;
      if (target && target.tagName && target.tagName.toUpperCase() === 'INPUT') {
        handleSubmit(e);
      }
    }
  };

  /**
   * @description 监听 formModel 变化
   */
  watch(
    () => unref(formModel),
    () => {
      emit('formModelChange', toRaw(unref(formModel)));
    },
    {
      deep: true,
      immediate: true,
    },
  );

  return {
    submit: handleSubmit,
    handleEnterPress,
    clearValidate,
    validate,
    validateFields,
    getFormValues,
    updateSchema,
    resetSchema,
    getSchemaByFiled,
    appendSchemaByField,
    appendSchemasByField,
    removeSchemaByFiled,
    removeAllSchema,
    resetForm,
    setFieldsValue,
    scrollToField,
  };
}
