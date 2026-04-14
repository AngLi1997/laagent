<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('打印标签')"
    :formProps="formProps"
    wrapClassName="modalSizeMedium"
    @okModal="ok">
    <template #PRINT>
      <Row class="code-rule-data">
        <Col :span="24" class="gutter-row" v-html="tagStyleContent"></Col>
      </Row>
    </template>
  </BMModalForm>
</template>
<script lang="tsx" setup>
  import { BMModalForm, ModalFormInstance } from '../../../../components/src/index';
  import { Row, Col } from 'ant-design-vue';
  import { ref, computed, watch, nextTick } from 'vue';

  import { t } from '@bmos/i18n';
  const emit = defineEmits<{
    (e: 'update:open', open: boolean): void;
    (e: 'printConfirm', batchParams: object): void;
  }>();
  const open = computed({
    get: () => {
      return props.open;
    },
    set: val => {
      emit('update:open', val);
    },
  });
  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    getPrinter: {
      type: Function,
      default: () => {
        return [];
      },
    },
    // 场景id(每个地方的打印不一致)
    sceneId: {
      type: String,
      default: '',
    },
  });
  const modalFormRef = ref<ModalFormInstance>();
  const printerId = ref<string>('');
  // 后端html
  const tagStyleContent = ref<any>(
    '<div\n  style="\n    width: 560px;\n    height: 320px;\n    box-sizing: border-box;\n    padding: 25px 25px;\n    background-color: #f8f8f8;\n    border: 1px solid #e1e1e1;\n    border-radius: 10px;\n    overflow: hidden;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  "\n>\n  <div style="font-size: 20px; height: 100%; font-weight: normal; width: 100%; line-height: 30px;display: flex;justify-content: center;align-items: center;">\n    <div\n      style="\n        float: left;\n        width: 60%;\n        height: 100%;\n        display: grid;\n        grid-template-rows: repeat(9, 1fr);\n      "\n    >\n      <div id="field1"></div>\n      <div id="field2"></div>\n      <div id="field3"></div>\n      <div id="field4"></div>\n      <div id="field5"></div>\n      <div id="field6"></div>\n      <div id="field7"></div>\n      <div id="field8"></div>\n      <div id="field9"></div>\n    </div>\n    <div style="float: right; width: 40%;">\n      <img\n        width="100%"\n        height="100%"\n        src="data:image/png;base64,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"\n        alt=""\n      />\n    </div>\n  </div>\n</div>',
  );
  // 全部标签label
  // const valueInfo = ref<any>([
  //   {
  //     field: 'fullName',
  //     label: '物料全称',
  //     type: 'String',
  //     exampleValue: 'W01-氯化钠',
  //   },
  //   {
  //     field: 'materialName',
  //     label: '物料名称',
  //     type: 'String',
  //     exampleValue: '氯化钠',
  //   },
  //   {
  //     field: 'materialMergeCode',
  //     label: '物料编码',
  //     type: 'String',
  //     exampleValue: 'W01',
  //   },
  //   {
  //     field: 'materialSpecification',
  //     label: '物料规格',
  //     type: 'String',
  //     exampleValue: '25kg/袋',
  //   },
  //   {
  //     field: 'materialBatchNo',
  //     label: '物料批号',
  //     type: 'String',
  //     exampleValue: 'WH01-221001',
  //   },
  //   {
  //     field: 'materialNo',
  //     label: '物料件号',
  //     type: 'String',
  //     exampleValue: '10086',
  //   },
  //   {
  //     field: 'quantityWithUnit',
  //     label: '物料量(带单位)',
  //     type: 'String',
  //     exampleValue: '15.780kg',
  //   },
  //   {
  //     field: 'netWeightWithUnit',
  //     label: '净重(带单位)',
  //     type: 'String',
  //     exampleValue: '15.780kg',
  //   },
  //   {
  //     field: 'tareWeightWithUnit',
  //     label: '皮重(带单位)',
  //     type: 'String',
  //     exampleValue: '5.180kg',
  //   },
  //   {
  //     field: 'grossWeightWithUnit',
  //     label: '毛重(带单位)',
  //     type: 'String',
  //     exampleValue: '20.960kg',
  //   },
  //   {
  //     field: 'weigherName',
  //     label: '称量人员',
  //     type: 'String',
  //     exampleValue: '张三',
  //   },
  //   {
  //     field: 'reCheckerName',
  //     label: '称量复核人员',
  //     type: 'String',
  //     exampleValue: '李四',
  //   },
  //   {
  //     field: 'weighTime',
  //     label: '称量时间',
  //     type: 'String',
  //     exampleValue: '2024-02-02 14:36:42',
  //   },
  //   {
  //     field: 'productName',
  //     label: '产品名称',
  //     type: 'String',
  //     exampleValue: '氯化钠溶液',
  //   },
  //   {
  //     field: 'productMergeCode',
  //     label: '产品编码',
  //     type: 'String',
  //     exampleValue: 'C01',
  //   },
  //   {
  //     field: 'productSpecification',
  //     label: '产品规格',
  //     type: 'String',
  //     exampleValue: '0.9%',
  //   },
  //   {
  //     field: 'processName',
  //     label: '工艺名称',
  //     type: 'String',
  //     exampleValue: '氯化钠溶液配置工艺',
  //   },
  //   {
  //     field: 'batchNo',
  //     label: '生产批号',
  //     type: 'String',
  //     exampleValue: 'C01230101',
  //   },
  //   {
  //     field: 'expiredDate',
  //     label: '有效期至',
  //     type: 'String',
  //     exampleValue: '2025-10-31',
  //   },
  //   {
  //     field: 'positionFullName',
  //     label: '暂存货位',
  //     type: 'String',
  //     exampleValue: 'KQ10-01-氯化钠货位',
  //   },
  // ]);
  // 应展示标签label
  // const showInfo = ref<any>([
  //   {
  //     label: '物料信息：',
  //     defineField: 'field1',
  //     dataSourceField: 'fullName',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '物料批号：',
  //     defineField: 'field2',
  //     dataSourceField: 'materialBatchNo',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '物料件号：',
  //     defineField: 'field3',
  //     dataSourceField: 'materialNo',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '称量重量：',
  //     defineField: 'field4',
  //     dataSourceField: 'netWeightWithUnit',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '称量人员：',
  //     defineField: 'field5',
  //     dataSourceField: 'weigherName',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '称量时间：',
  //     defineField: 'field6',
  //     dataSourceField: 'weighTime',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '产品名称：',
  //     defineField: 'field7',
  //     dataSourceField: 'productName',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '产品规格：',
  //     defineField: 'field8',
  //     dataSourceField: 'productSpecification',
  //     consumeValue: null,
  //   },
  //   {
  //     label: '生产批号：',
  //     defineField: 'field9',
  //     dataSourceField: 'batchNo',
  //     consumeValue: null,
  //   },
  // ]);
  const printerIp = ref<string>('');
  const printerPort = ref<string>('');
  const printerDpi = ref<string>('');
  const formProps = computed<any>(() => {
    const initialValues = {};
    const schemas = [
      {
        field: 'printerId',
        component: 'Select',
        label: t('打印设备'),
        labelWidth: 100,
        required: true,
        componentProps: {
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          request: async () => {
            const { data } = await props.getPrinter();
            const printer = JSON.parse(localStorage.getItem('PRINTER')) || {};
            const index = data.findIndex((item: any) => {
              return item.id === printer?.printerId;
            });
            if (index >= 0) {
              printerId.value = data[index]?.id;
              printerIp.value = data[index]?.ip;
              printerPort.value = data[index]?.port;
              printerDpi.value = data[index]?.dpi;
              modalFormRef.value?.formRef?.setFormModel('printerId', printer?.printerId);
            }
            return data || [];
          },
          onChange: (val: any, option: any) => {
            printerId.value = option.id;
            printerIp.value = option.ip;
            printerPort.value = option.port;
            printerDpi.value = option.dpi;
          },
        },
      },
      {
        field: 'previewLabel',
        labelWidth: 0,
        label: t('预览标签'),
        slot: 'PRINT',
        vIf: false, //已沟通预览放下版本做
      },
    ];
    return { initialValues, schemas, disabled: false };
  });
  //修改HTML文本
  // const modifyHtml = () => {
  //   showInfo.value?.map((item: any) => {
  //     let elements = document.getElementById(item.defineField);
  //     const value: any[] = valueInfo.value?.filter((valueInfo: any) => valueInfo.field === item.dataSourceField);
  //     if (item.defineField === 'title') {
  //       elements!.innerHTML = `${item?.label ? '' : ''}`;
  //     } else {
  //       elements!.innerHTML = `${item?.label ? item.label : ''}${value.length > 0 ? value[0]?.exampleValue : ''}`;
  //     }
  //   });
  // };
  // 确定
  const ok = async () => {
    await modalFormRef.value?.validate();
    const printerParams = {
      printerId: printerId.value,
      printerIp: printerIp.value,
      printerPort: printerPort.value,
      printerDpi: printerDpi.value,
    };
    localStorage.setItem('PRINTER', JSON.stringify(printerParams)); //缓存打印机信息
    emit('printConfirm', { ...printerParams, sceneId: props.sceneId });
  };
  watch(
    () => open.value,
    async val => {
      await nextTick();
      if (!val) return;
      try {
      } catch (error) {}
    },
    {
      immediate: true,
    },
  );
</script>

<style lang="less" scoped>
  .code-rule-data {
    background-color: #fff;
    // height: calc(100% - 68px - 36px - 76px);
    height: 400px;
    padding: var(--bmos-padding-small);
    .gutter-row {
      background-color: #e6e6e6;
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :deep(.from-col) {
      padding-right: 0 !important;
    }
  }
</style>
