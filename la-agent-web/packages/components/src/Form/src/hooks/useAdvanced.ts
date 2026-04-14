import { isBoolean, isFunction, isNumber, isObject } from '@bmos/utils';
import { Ref, computed, unref, watch } from 'vue';
import type { BMFormEmitFn } from '../types/bm-form';
import type { ColEx } from '../types/component';
import type { BMFormType } from './';
import { useBreakpoint } from './useBreakpoint';

const BASIC_COL_LEN = 24;
const BASIC_LINE_HIDDEN = 1;

type UseAdvancedContext = {
  instance: BMFormType;
  emit: BMFormEmitFn;
  actionColOptionsSpan: Ref<number>;
};

export const useAdvanced = ({ instance, emit, actionColOptionsSpan }: UseAdvancedContext) => {
  const { realWidthRef, screenEnum, screenRef } = useBreakpoint();
  const { advanceState, getFormProps, formSchemasRef, formModel, defaultFormValues } = instance;
  const getEmptySpan = computed((): number => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // 对于某些特殊情况，需要手动指定额外的空行
    const emptySpan = unref(getFormProps).emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isObject(emptySpan)) {
      // @ts-ignore
      const { span = 0 } = emptySpan;
      const screen = unref(screenRef) as string;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  });

  watch(
    [formSchemasRef, () => advanceState.isAdvanced, () => unref(realWidthRef)],
    () => {
      const { showAdvancedButton } = unref(getFormProps);
      if (showAdvancedButton) {
        updateAdvanced();
      }
    },
    { immediate: true },
  );

  function getAdvanced(itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) {
    const width = unref(realWidthRef);

    const mdWidth =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN;

    const lgWidth = parseInt(itemCol.lg as string) || mdWidth;
    const xlWidth = parseInt(itemCol.xl as string) || lgWidth;
    const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth;
    if (width <= screenEnum.LG) {
      itemColSum += mdWidth;
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth;
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth;
    } else {
      itemColSum += xxlWidth;
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false;
      if (itemColSum <= BASIC_COL_LEN * (unref(getFormProps).autoAdvancedLine || BASIC_LINE_HIDDEN)) {
        // 小于等于1行时，不显示折叠和展开按钮
        advanceState.hideAdvanceBtn = true;
        advanceState.isAdvanced = true;
      } else if (
        // eslint-disable-next-line no-dupe-else-if
        itemColSum > BASIC_COL_LEN * (unref(getFormProps).autoAdvancedLine || BASIC_LINE_HIDDEN) &&
        itemColSum <= BASIC_COL_LEN * (unref(getFormProps).autoAdvancedLine || BASIC_LINE_HIDDEN)
      ) {
        advanceState.hideAdvanceBtn = false;

        // 默认超过 1 行折叠
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }
    if (
      itemColSum >
      BASIC_COL_LEN * (unref(getFormProps).alwaysShowLines || unref(getFormProps).autoAdvancedLine || BASIC_LINE_HIDDEN)
    ) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    } else {
      // 第一行默认不折叠
      return { isAdvanced: true, itemColSum };
    }
  }

  function updateAdvanced() {
    let itemColSum = actionColOptionsSpan.value;
    let realItemColSum = 0;
    const { baseColProps = {} } = unref(getFormProps);

    for (const schema of unref(formSchemasRef)) {
      const { vShow, colProps } = schema;
      let isShow = true;

      if (isBoolean(vShow)) {
        isShow = vShow;
      }

      if (isFunction(vShow)) {
        isShow = vShow({
          schema,
          formModel,
          field: schema.field,
          formInstance: instance,
          values: {
            ...unref(defaultFormValues),
            ...formModel,
          },
        });
      }

      if (isShow && (colProps || baseColProps)) {
        const { itemColSum: sum, isAdvanced } = getAdvanced({ ...baseColProps, ...colProps }, itemColSum);

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }
        schema.isAdvanced = isAdvanced;
      }
    }

    advanceState.actionSpan =
      24 - ((realItemColSum - actionColOptionsSpan.value) % BASIC_COL_LEN) + unref(getEmptySpan);

    getAdvanced(unref(getFormProps).actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true);

    emit('advancedChange');
  }

  function handleToggleAdvanced() {
    advanceState.isAdvanced = !advanceState.isAdvanced;
    // if (advanceState.isAdvanced) {
    //   advanceState.hideAdvanceBtn = false;
    // }
  }

  return { handleToggleAdvanced };
};
