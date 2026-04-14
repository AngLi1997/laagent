import type { Component } from 'vue';
/**
 * Component list, register here to setting it in the form
 */
import {
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Col,
  DatePicker,
  Divider,
  FormItemRest,
  Input,
  InputGroup,
  InputNumber,
  InputSearch,
  Radio,
  RadioGroup,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  Textarea,
  TimePicker,
  Tree,
  TreeSelect,
  Upload,
} from 'ant-design-vue';
import { sliderProps } from 'ant-design-vue/es/slider';
import { computed, defineComponent, watch } from 'vue';
import initDefaultProps from '../../../utils/initDefaultProps';
import { omit } from '@bmos/utils';
import { BMPasswordInput } from '../../../PasswordInput';
import { inputNumberProps } from 'ant-design-vue/es/input-number';
import { defineModel } from 'vue'

const Span = defineComponent({
  name: 'Span',
  props: {
    value: String,
  },
  setup(props, { slots }) {
    return () => <span>{props.value}</span>;
  },
});

const SliderNumber = defineComponent({
  name: 'SliderNumber',
  props: {
    value: Number,
    min: Number,
    max: Number,
    step: Number,
    sliderProps: {
      type: Object,
      default: () => {},
    },
    inputNumberProps: {
      type: Object,
      default: () => {},
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const sliderVal = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val),
    })
    console.log('sliderVal', sliderVal);
    return () => <FormItemRest>
      <Row>
        <Col span={18}>
          <Slider v-model:value={sliderVal.value} min={props.min} max={props.max} step={props.step} {...props.sliderProps} range={false} />
        </Col>
        <Col span={6}>
          <InputNumber v-model:value={sliderVal.value} min={props.min} max={props.max} step={props.step} {...props.inputNumberProps} />
        </Col>
      </Row>
    </FormItemRest>;
  },
})

const componentMap: Record<string, Component> = {
  Input,
  InputGroup,
  InputPassword: BMPasswordInput,
  InputSearch,
  InputTextArea: Textarea,
  InputNumber,
  AutoComplete,
  Select,
  TreeSelect,
  Tree,
  Switch,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Cascader,
  Slider,
  Rate,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
  Upload,
  Span,
  Divider,
  SliderNumber,
};

export type ComponentMapType = keyof typeof componentMap | 'FormGroup' | 'TableTitle';

export { componentMap };
