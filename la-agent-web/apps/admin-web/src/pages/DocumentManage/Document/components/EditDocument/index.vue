<!-- 文档管理/编辑文档 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="back">
          {{ t('文档管理') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ documentInfo.type === typeEnum.edit ? t('编辑文档') : t('查看文档') }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="back">
        {{ t('返回') }}
      </Button>
      <Button v-if="documentInfo.type === typeEnum.edit" :loading="loading" type="primary" @click="save">
        {{ t('保存') }}
      </Button>
    </template>
    <div class="content">
      <div class="content-left">
        <BMForm ref="formRef" v-bind="formProps" />
      </div>
      <BMPageComponent
        v-if="selectMenu === menuKey.DocumentContent"
        ref="pageRef"
        style="overflow: hidden"
        :hide-right-tree="true"
        :show-all-add-icon="false"
        :show-action="false"
        :row-keys="['id']"
        :search="[true]"
        :form-props="[formFirstProps]"
        :titles="[t('文档列表')]"
        :table-fields="[
          {
            default: {
              document_id: documentInfo.id,
            },
          },
        ]"
        :requests="[getDataList as DataRequestFn]"
        :columns="[columnsFirst]"
      >
        <template #tableHeaderToolbar0>
          <Button
            v-if="documentInfo.type === typeEnum.edit"
            @click="() => saveChunkRef?.openModal(documentInfo.id)"
          >
            {{ t('文档分片') }}
          </Button>
          <Button
            v-if="documentInfo.type === typeEnum.edit"
            type="primary"
            @click="() => openEditParagraph(modalTypeEnum.ADD)"
          >
            {{ t('添加分段') }}
          </Button>
        </template>
      </BMPageComponent>
      <RecallTesting v-else :id="documentInfo.id" />
    </div>
  </BreadcrumbButton>
  <SaveChunk ref="saveChunkRef" @submit-success="updateTable" />
  <EditParagraph ref="editParagraphRef" :document-id="documentInfo.id" @submit-success="updateTable" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqDocumentChunkPage, reqDocumentEdit } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import RecallTesting from '@/components/RecallTesting/index.vue';
import { BMForm, BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { useTemplateRef } from 'vue';
import { EditParagraph, SaveChunk } from '../index';
import { modalTypeEnum } from '../types';
// import { reqFlowAuditList, reqGetFlowConfigTreeReq, reqFlowConfigBindProcessReq } from '@/services';
import { menuKey, useForm, useTable } from './hooks';
import { typeEnum } from './type';

const saveChunkRef = useTemplateRef('saveChunkRef');

const router = useRouter();

const documentInfo = ref<any>({});

const back = () => {
  router.back();
};

const getDataList = async (params: any) => {
  return await reqDocumentChunkPage(params);
};

const editParagraphRef = ref<InstanceType<typeof EditParagraph>>();

const openEditParagraph = (type: modalTypeEnum, record?: any) => {
  editParagraphRef.value?.openModal(type, record);
};

const { pageRef, updateTable, columnsFirst, formFirstProps } = useTable(openEditParagraph);

const { formRef, formProps, selectMenu } = useForm();

const loading = ref(false);

const saveFields = ['id', 'category_id', 'name', 'serial'];

// 保存
const save = async () => {
  try {
    const formData = await formRef.value?.validate();
    loading.value = true;
    const params = saveFields.reduce((pre: any, cur: any) => {
      pre[cur] = formData[cur];
      return pre;
    }, {});
    await reqDocumentEdit(params);
    message.success(t('保存成功'));
    back();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
  finally {
    loading.value = false;
  }
};

onMounted(() => {
  documentInfo.value = router.currentRoute.value.query;
  formRef.value?.setFormModels(documentInfo.value);
});
</script>

<style lang="less" scoped>
  .content {
  display: flex;
  height: 100%;
  &-left {
    width: 300px;
    min-width: 300px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid var(--bmos-second-level-border-color);
    padding: 16px;
    padding-left: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
