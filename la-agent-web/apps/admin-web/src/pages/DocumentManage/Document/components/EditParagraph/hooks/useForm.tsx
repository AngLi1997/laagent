import type { FormProps, ModalFormInstance, RenderCallbackParams } from '@bmos/components';
import { PlusOutlined } from '@ant-design/icons-vue';
import { t } from '@bmos/i18n';
import { Input, Tag } from 'ant-design-vue';

export const useForm = () => {
  const modalFormRef = ref<ModalFormInstance>();

  const KeyWordsCom = defineComponent({
    props: {
      isEdit: {
        type: Boolean,
        default: true,
      },
      keywords: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:keywords'],
    setup(props, { emit }) {
      const { isEdit, keywords } = toRefs(props);

      const tags = computed({
        get: () => keywords.value,
        set: (val) => {
          emit('update:keywords', val);
        },
      });

      const inputVisible = ref(false);
      const inputRef = ref();
      const inputValue = ref('');

      const handleClose = (removedTag: string) => {
        tags.value = tags.value.filter(tag => tag !== removedTag);
      };

      const handleInputConfirm = () => {
        const inputVal = unref(inputValue);
        if (inputVal && !tags.value.includes(inputVal)) {
          tags.value = tags.value.concat(inputVal);
        }
        inputVisible.value = false;
        inputValue.value = '';
      };

      const showInput = () => {
        inputVisible.value = true;
        nextTick(() => {
          inputRef.value?.focus();
        });
      };

      return () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {keywords.value.map((tag: any) => {
            return (
              <Tag
                key={tag}
                bordered={false}
                closable={isEdit.value}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '28px',
                  lineHeight: '25px',
                }}
                onClose={() => handleClose(tag)}
              >
                {tag}
              </Tag>
              // <BMEllipsis tooltip otherWidth={10} key={tag}>
              //   {{
              //     default: () => (
              //       <Tag
              //         bordered={false}
              //         closable={isEdit.value}
              //         style={{
              //           overflow: 'hidden',
              //           textOverflow: 'ellipsis',
              //           height: '28px',
              //           lineHeight: '25px',
              //         }}
              //         onClose={() => handleClose(tag)}>
              //         {tag}
              //       </Tag>
              //     ),
              //     title: () => tag,
              //   }}
              // </BMEllipsis>
            );
          })}
          {props.isEdit && (
            <div style={{ height: '34px', lineHeight: '34px' }}>
              {inputVisible.value
                ? (
                    <Input
                      ref={inputRef}
                      v-model:value={inputValue.value}
                      type="text"
                      size="small"
                      style={{ width: '78px', height: '28px' }}
                      onBlur={handleInputConfirm}
                      onKeyup={({ key }) => key === 'Enter' && handleInputConfirm()}
                    />
                  )
                : (
                    <Tag
                      style={{ background: '#fff', borderStyle: 'dashed', height: '28px', lineHeight: '25px' }}
                      onClick={showInput}
                    >
                      <PlusOutlined />
                      {t('添加关键词')}
                    </Tag>
                  )}
            </div>
          )}
        </div>
      );
    },
  });

  const formProps = reactive<FormProps>({
    initialValues: {},
    // layout: 'horizontal',
    schemas: [
      {
        field: 'inputInfo',
        component: 'Divider',
        label: t('分段内容'),
        colProps: {
          span: 24,
        },
        componentProps: {
          orientation: 'left',
          orientationMargin: '0px',
          showLeftBorder: true,
        },
      },
      {
        noLabel: true,
        field: 'content',
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <>
              <div
                class="content-textarea"
                contenteditable={formModel.isEdit}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  ...(formModel.isEdit ? { background: '#F5F6F7' } : {}),
                }}
                onInput={(e) => {
                  let newContent = (e?.currentTarget as HTMLElement)?.textContent;
                  if (newContent === '\n') {
                    newContent = '';
                  }
                  formModel.content = newContent;
                }}
              >
              </div>
              <div style={{ width: '100%', textAlign: 'end', marginTop: '12px' }}>
                {t('字符数')}
                :
                <span style={{ color: '#FF9A2F' }}>{formModel.content?.length ?? 0}</span>
              </div>
            </>
          );
        },
        componentProps: ({ formModel }: RenderCallbackParams) => {
          return {
            disabled: !formModel.isEdit,
            showCount: true,
          };
        },
      },
      {
        field: 'keyWordLabel',
        component: 'Divider',
        label: t('关键词'),
        colProps: {
          span: 24,
        },
        componentProps: {
          orientation: 'left',
          orientationMargin: '0px',
          showLeftBorder: true,
        },
      },
      {
        noLabel: true,
        field: 'keywords',
        component: ({ formModel }: RenderCallbackParams) => {
          return <KeyWordsCom v-model:keywords={formModel.keywords} isEdit={formModel.isEdit}></KeyWordsCom>;
        },
      },
    ],
  });

  const setFormModels = (values: any) => {
    modalFormRef.value?.formRef?.setFormModels(values);
    if (modalFormRef.value && modalFormRef.value.formRef && modalFormRef.value.formRef.compRefMap.get('content')) {
      modalFormRef.value.formRef.compRefMap.get('content').nextSibling.textContent = values.content;
    }
  };

  const updateFormSchemas = (field: string, value: any) => {
    modalFormRef.value?.formRef?.appendSchemasByField(field, value);
  };

  return {
    modalFormRef,
    formProps,
    setFormModels,
    updateFormSchemas,
  };
};
