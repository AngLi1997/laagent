<template>
  <Col v-if="showActionButtonGroup" v-bind="actionColOpt" :style="{ zIndex: 99 }">
    <div :style="{ textAlign: actionColOpt.style.textAlign }">
      <Form.Item>
        <Space :size="16">
          <slot name="advanceBefore"></slot>
          <Button
            v-if="showAdvancedButton && !hideAdvanceBtn"
            type="link"
            size="small"
            class="bmos-action-advance-btn"
            @click="toggleAdvanced">
            <Space :size="6" align="center">
              {{ isAdvanced ? t('收起') : t('更多') }}
              <Badge
                v-if="showAdvancedButtonBadge && !isAdvanced"
                color="#FFECD8"
                :number-style="{
                  color: '#FF9A2F',
                }"
                :count="advancedBadgeCount" />
              <Arrow :expand="!isAdvanced" />
            </Space>
          </Button>
          <slot name="resetBefore"></slot>
          <Button v-if="showResetButton" type="default" v-bind="getResetBtnOptions" @click="resetForm">
            {{ getResetBtnOptions.text }}
          </Button>
          <slot name="submitBefore"></slot>

          <Button v-if="showSubmitButton" type="primary" v-bind="getSubmitBtnOptions" @click="submit">
            {{ getSubmitBtnOptions.text }}
          </Button>
          <slot name="submitAfter"></slot>
        </Space>
      </Form.Item>
    </div>
  </Col>
</template>
<script lang="ts" setup>
  import { Button, Col, Form, Space, Badge } from 'ant-design-vue';
  import buttonProps from 'ant-design-vue/es/button/buttonTypes';
  import { computed, ExtractPropTypes, type PropType } from 'vue';
  import { useFormContext } from '../hooks/useFormContext';
  import type { ColEx } from '../types/component';
  import Arrow from './Arrow.vue';
  import { ActionColOptions } from '../enums/common';
  import { t } from '@bmos/i18n';

  type ButtonOptions = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>> & {
    text?: string;
  };

  defineOptions({
    name: 'BMFormAction',
    inheritAttrs: false,
  });

  const emit = defineEmits(['toggle-advanced', 'update:actionColOptions']);

  const props = defineProps({
    showActionButtonGroup: {
      type: Boolean,
      default: true,
    },
    showResetButton: {
      type: Boolean,
      default: true,
    },
    showSubmitButton: {
      type: Boolean,
      default: true,
    },
    showAdvancedButton: {
      type: Boolean,
      default: true,
    },
    resetButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    submitButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    actionColOptions: {
      type: Object as PropType<Partial<ColEx>>,
      default: () => ({}),
    },
    actionSpan: {
      type: Number,
      default: ActionColOptions.SpanWithOutAdvance,
    },
    isAdvanced: Boolean,
    hideAdvanceBtn: Boolean,
    showAdvancedButtonBadge: {
      type: Boolean,
      default: false,
    },
    advancedBadgeCount: {
      type: Number,
      default: 0,
    },
  });

  const { resetForm, submit } = useFormContext();
  const actionColOpt = computed(() => {
    const { showAdvancedButton, actionSpan: span, actionColOptions } = props;
    const actionSpan = span || ActionColOptions.Span;
    const advancedSpanObj = showAdvancedButton ? { span: actionSpan < ActionColOptions.Span ? 24 : actionSpan } : {};
    const curSpan = showAdvancedButton ? ActionColOptions.Span : ActionColOptions.SpanWithOutAdvance;
    const actionColOpt: Partial<ColEx> = {
      style: { textAlign: 'right' },
      ...advancedSpanObj,
      ...{
        ...actionColOptions,
        span: showAdvancedButton ? advancedSpanObj.span : actionColOptions.span || curSpan,
      },
    };

    emit('update:actionColOptions', actionColOptions.span || curSpan);
    return actionColOpt;
  });

  const getResetBtnOptions = computed((): ButtonOptions => {
    return Object.assign(
      {
        text: t('重置'),
      },
      props.resetButtonOptions,
    );
  });

  const getSubmitBtnOptions = computed(() => {
    return Object.assign(
      {
        text: t('查询'),
      },
      props.submitButtonOptions,
    );
  });

  function toggleAdvanced() {
    emit('toggle-advanced', props.isAdvanced);
  }
</script>
