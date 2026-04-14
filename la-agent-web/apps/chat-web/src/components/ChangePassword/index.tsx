import { rePassWord } from '@/api';
import { t } from '@bmos/i18n';
import { App, Button, Form, Input, Modal } from 'antd';
import React from 'react';

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleFinish = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [t('两次输入的密码不一致！')],
        },
      ]);
      return;
    }
    // 直接调用接口， 然后关闭弹窗
    try {
      await rePassWord({
        loginName: sessionStorage.getItem('BMOS_SSO_USER') ? JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '').loginName : '',
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success(t('修改密码成功，请重新登录！'));
      // 退出登录
      localStorage.removeItem('BMOS-ACCESS-TOKEN');
      sessionStorage.removeItem('BMOS_SSO_USER');
      window.location.reload();
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  return (
    <Modal
      title={t('修改密码')}
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
          label={t('旧密码')}
          name="oldPassword"
          rules={[{ required: true, message: t('请输入旧密码！') }]}
        >
          <Input.Password placeholder={t('请输入旧密码')} />
        </Form.Item>
        <Form.Item
          label={t('新密码')}
          name="newPassword"
          rules={[{ required: true, message: t('请输入新密码！') }]}
        >
          <Input.Password placeholder={t('请输入新密码')} />
        </Form.Item>
        <Form.Item
          label={t('确认密码')}
          name="confirmPassword"
          rules={[{ required: true, message: t('请再次输入新密码！') }]}
        >
          <Input.Password placeholder={t('再次输入新密码')} />
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

export default ChangePasswordModal;
