import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { t } from '@bmos/i18n';
import { Modal } from 'ant-design-vue';

export function useWarn() {
  const warnModal = (content: string, options?: any) => {
    Modal.confirm({
      title: t('提示'),
      icon: h(ExclamationCircleOutlined),
      content,
      closable: true,
      ...(options || {}),
    });
  };
  return {
    warnModal,
  };
}
