import type { MenuItem } from '../type';
import { t } from '@bmos/i18n';
import { useState } from 'react';
import { FeedbackEnum } from '../type';

export const useFeedback = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackEnum>(FeedbackEnum.new);

  const openFeedbackModal = (type: FeedbackEnum) => {
    setFeedbackType(type);
    setFeedbackModalOpen(true);
  };

  const feedbackMenuList: MenuItem[] = [
    {
      key: FeedbackEnum.new,
      label: t('新增反馈'),
    },
    {
      key: FeedbackEnum.history,
      label: t('反馈历史'),
    },
  ];

  return { feedbackModalOpen, setFeedbackModalOpen, feedbackMenuList, feedbackType, openFeedbackModal };
};
