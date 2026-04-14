import type { FeedbackModalType } from './type';
import { t } from '@bmos/i18n';
import { Button, Flex, Input, Modal, Space, Tag } from 'antd';
import { createStyles } from 'antd-style';
// 定义一个登录弹窗
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FeedbackType } from './type';

export interface FeedbackModalRef {
  showModal: (type: FeedbackType, id: string | number | undefined, index: number) => void;
  handleCancel: () => void;
}

export interface FeedbackModalProps {
  onSubmit: (data: FeedbackModalType) => void;
}

const useStyle = createStyles(({ css }) => {
  return {
    subTitle: css`
      color: #909398;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      margin-bottom: 20px;
    `,
  };
});

const FeedbackModal = (
  { ref, onSubmit }: { ref: React.Ref<FeedbackModalRef>; onSubmit: (data: FeedbackModalType) => void },
) => {
  const { styles } = useStyle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<FeedbackModalType>({ index: 0, type: FeedbackType.like });

  const tagsMap = {
    [FeedbackType.like]: [t('准确理解问题'), t('完成任务能力强'), t('有帮助')],
    [FeedbackType.dislike]: [t('没有理解问题'), t('没有完成任务'), t('编造事实')],
  };

  // tags
  const [tagsData, setTagsData] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /**
   * 显示弹窗
   * @param type 反馈类型
   * @param id 消息id
   */
  const showModal = (type: FeedbackType, id: string | number | undefined, index: number) => {
    setModalData({ type, id, index });
    setIsModalOpen(true);
  };

  // 暴露一个close弹窗的方法
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTags([]);
  };

  /**
   * 提交反馈
   */
  const handleSubmit = () => {
    onSubmit(modalData);
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
    handleCancel,
  }));

  // 底部按钮
  const footerBtn = (
    <Space>
      <Button onClick={handleCancel}>{t('取消')}</Button>
      <Button type="primary" onClick={handleSubmit}>
        {t('提交反馈')}
      </Button>
    </Space>
  );


  useEffect(() => {
    setTagsData(tagsMap[modalData.type || FeedbackType.like]);
  }, [modalData.type]);

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  return (
    <Modal
      open={isModalOpen}
      title={modalData.type === FeedbackType.dislike ? t('抱歉，BMOS让你有不好的感受') : t('BMOS会努力做的更好')}
      onCancel={handleCancel}
      maskClosable={false}
      keyboard={false}
      width={480}
      footer={footerBtn}
    >
      <p className={styles.subTitle}>{t('请选择帮助我们做的更好')}</p>
      <Flex gap={4} wrap align="center" style={{ marginBottom: 20 }}>
        {tagsData.map<React.ReactNode>(tag => (
          <Tag.CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={checked => handleChange(tag, checked)}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </Flex>
      <Input.TextArea
        value={modalData.feedback}
        onChange={e => setModalData({ ...modalData, feedback: e.target.value })}
        autoSize={{ minRows: 4 }}
        placeholder={t('请告诉我们你的想法....')}
      >
      </Input.TextArea>
    </Modal>
  );
};

export default FeedbackModal;
