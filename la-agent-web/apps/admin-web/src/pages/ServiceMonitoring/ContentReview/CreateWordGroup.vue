<!-- 创建/编辑/查看词组 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="back">
          {{ t('服务监控') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ titleMap[pageType] }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="back">
        {{ t('返回') }}
      </Button>
      <Button v-if="pageType !== OperationType.View" :loading="loading" type="primary" @click="save">
        {{ t('保存') }}
      </Button>
    </template>
    <BMTableTitle :title="t('词组信息')" style="margin-bottom: 16px" />
    <BMForm ref="formRef" v-bind="formProps" />
    <Space>
      <BMTableTitle :title="t('词组内容')" style="margin-bottom: 16px" />
      <Tooltip>
        <template #title>
          {{ t('词组间使用英文逗号或者空格隔开') }}
        </template>
        <div style="margin-bottom: 13px; color: #606266">
          <QuestionCircleOutlined />
        </div>
        
      </Tooltip>
    </Space>
    
    <div
      ref="contentRef"
      class="content-textarea"
      :contenteditable="pageType !== OperationType.View"
      :style="{
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        marginBottom: '12px',
        ...(pageType !== OperationType.View ? { background: '#F5F6F7' } : {}),
      }"
      @input="(e: Event) => {
        // @ts-ignore
        let newContent = e?.currentTarget?.innerText;
        if (newContent === '\n') newContent = '';
        formRef?.setFormModels({ keyword_group: newContent });
      }"
    />
  </BreadcrumbButton>
</template>

<script setup lang="ts">
import type { FormProps } from '@bmos/components';
import { reqChatReviewCreate, reqChatReviewDetail, reqChatReviewUpdate } from '@/api';
import { BMForm, BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { HandleType, OperationType } from './type';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'ServiceMonitoringContentReviewCreateWordGroup',
  inheritAttrs: false,
});

const router = useRouter();
const route = useRoute();

const titleMap = {
  [OperationType.Add]: t('创建词组'),
  [OperationType.Edit]: t('编辑词组'),
  [OperationType.View]: t('查看词组'),
};

const pageType = computed<OperationType>(() => {
  return route.query.pageType as OperationType;
});

const formProps: Partial<FormProps> = {
  showAdvancedButton: false,
  showActionButtonGroup: false,
  disabled: pageType.value === OperationType.View,
  schemas: [
    {
      label: t('词组名称'),
      field: 'word_group',
      component: 'Input',
      required: true,
    },
    {
      label: t('处理方式'),
      field: 'handle_method',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: t('直接应答'), value: HandleType.STRAIGHT_ANSWER },
          { label: t('模糊覆盖'), value: HandleType.FUZZY_COVER },
        ],
      },
    },
    {
      label: t('预设回答'),
      field: 'canned_answer',
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
  ],
};

const back = () => {
  router.back();
};

const formRef = ref();
const contentRef = ref<any>(null);
const loading = ref(false);

const save = async () => {
  try {
    await formRef.value?.validate();
    if (!formRef.value?.formModel.keyword_group || formRef.value?.formModel.keyword_group === '') {
      message.error(t('请输入词组内容'));
      return;
    }
    if (pageType.value === OperationType.Add) {
      await reqChatReviewCreate(formRef.value?.formModel);
    }
    else {
      await reqChatReviewUpdate(formRef.value?.formModel);
    }
    message.success(t('操作成功'));
    loading.value = true;
    back();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
  finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    if (pageType.value !== OperationType.Add) {
      const { data } = await reqChatReviewDetail(route.query.id as string);
      formRef.value?.setFormModels(data);
      if (contentRef.value) {
        contentRef.value.innerText = data.keyword_group;
      }
    }
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
});
</script>

<style lang="less" scoped>
.content-textarea {
  padding: 12px;
  &:focus-visible {
    outline: none;
  }
}
</style>
