import { isNumber, isUnDef } from '@bmos/utils';
import type { Ref } from 'vue';
import { computed, ref, unref } from 'vue';
import type { FormProps } from '../types/bm-form';
import type { FormSchema } from '../types/form';

export function useItemLabelWidth(schemaRef: Ref<FormSchema>, formPropsRef: Ref<FormProps>) {
  return computed(() => {
    const schemaItem = unref(schemaRef);
    const { labelCol = {}, wrapperCol = {} } = schemaItem.formItemProps || {};
    const { labelWidth, disabledLabelWidth } = schemaItem;

    const {
      labelWidth: globalLabelWidth,
      labelCol: globalLabelCol,
      wrapperCol: globWrapperCol,
      layout,
    } = unref(formPropsRef);

    // 如果labelWidth是全局设置的，则会设置所有项
    if ((!globalLabelWidth && !labelWidth && !globalLabelCol) || disabledLabelWidth) {
      labelCol.style = {
        textAlign: 'left',
      };
      return { labelCol, wrapperCol };
    }
    let width = isUnDef(labelWidth) ? globalLabelWidth : labelWidth;
    const col = { ...globalLabelCol, ...labelCol };
    const wrapCol = { ...globWrapperCol, ...wrapperCol };

    if (width) {
      width = isNumber(width) ? `${width}px` : width;
    }

    const colOption = ref<any>({});
    if (layout === 'vertical') {
      colOption.value = {
        labelCol: { ...col },
        wrapperCol: { ...wrapCol },
      };
    } else {
      colOption.value = {
        labelCol: { style: { width }, ...col },
        wrapperCol: { style: { width: `calc(100% - ${width})` }, ...wrapCol },
      };
    }

    return {
      labelCol: colOption.value.labelCol,
      wrapperCol: colOption.value.wrapperCol,
    };
  });
}
