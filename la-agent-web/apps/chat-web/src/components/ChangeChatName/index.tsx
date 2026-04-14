import { updateConversationTitle } from '@/api';
import { t } from '@bmos/i18n';
import { App, Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

interface ChangeChatNameModalProps {
  open: boolean;
  id: string;
  name: string;
  onCancel: () => void;
  onFinish: (id: string, name: string) => void;
}

const ChangeChatNameModal: React.FC<ChangeChatNameModalProps> = ({ open, id, name, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleFinish = async (values: { name: string }) => {
    // 直接调用接口， 然后关闭弹窗
    try {
      await updateConversationTitle({
        conversation_title: values.name,
        conversation_id: id,
      });
      message.success(t('修改成功'));
      onFinish(id, values.name);
      onCancel();
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name });
    }
  }, [open, name, form]);

  return (
    <Modal
      title={t('修改名称')}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label={null}
          name="name"
          rules={[{ required: true, message: t('请输入智能体名称！') }]}
        >
          <Input placeholder={t('请输入智能体名称')} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              {t('取消')}
            </Button>
            <Button type="primary" htmlType="submit">
              {t('确定')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeChatNameModal;
