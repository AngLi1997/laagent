<template>
  <BMTable
    :columns="columns"
    :data-source
    :pagination="false"
    :search="false"
    show-index
    :show-tool-bar="false"
    :scroll="{ x: 800, y: 300 }"
  />
  <EditParamsModal v-model:params-modal-open="editModal" :record="editRow" @ok="handleOk" />
</template>

<script lang="tsx" setup>
import type { Recordable, TableColumn } from '@bmos/components';
import { BMTable } from '@bmos/components';
import { t } from '@bmos/i18n';
import { FormItemRest, RadioGroup } from 'ant-design-vue';
import EditParamsModal from './EditParamsModal.vue';

defineOptions({
  inheritAttrs: false,
});

const dataSource = defineModel<any[]>({ default: [] });

const deleteRecord = (record: any) => {
  dataSource.value = dataSource.value.filter((r: any) => {
    return r.key !== record.key;
  });
};

const handleOk = (formModal: Recordable) => {
  const index = dataSource.value.findIndex((item: any) =>
    item.key === formModal.key,
  );
  if (index !== -1) {
    dataSource.value[index] = { ...dataSource.value[index], ...formModal };
  }
  else {
    dataSource.value.push(formModal);
  }
};

const editModal = ref<boolean>(false);
const editRow = ref<Recordable>({});

const columns: TableColumn[] = [
  {
    title: t('参数'),
    dataIndex: 'name',
    width: 100,
  },
  {
    title: t('数据类型'),
    dataIndex: 'paramType',
    width: 100,
  },
  {
    title: t('是否必填'),
    dataIndex: 'required',
    width: 100,
    customRender: ({ record }) => {
      return (
        <FormItemRest>
          <RadioGroup
            v-model:value={record.required}
            options={[
              { label: t('是'), value: true },
              { label: t('否'), value: false },
            ]}
          />
        </FormItemRest>
      );
    },
  },
  {
    title: t('参数描述'),
    dataIndex: 'description',
    width: 200,
  },
  {
    title: t('操作'),
    align: 'left',
    key: 'ACTION',
    fixed: 'right',
    width: 100,
    actions: ({ record }) => [
      {
        label: t('编辑'),
        onClick: () => {
          editModal.value = true;
          editRow.value = record;
        },
      },
      {
        label: t('删除'),
        danger: true,
        onClick: () => {
          deleteRecord(record);
        },
      },
    ],
  },
];
</script>

<style lang="less" scoped></style>
