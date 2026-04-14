import { t } from '@bmos/i18n';
import { Button, Form, Input, Modal } from 'antd';
// 定义一个登录弹窗
import { useImperativeHandle, useState } from 'react';
import { useLoginModalStore } from '@/stores/loginModalStore';
import SvgIcon from '../SvgIcon';
import { useLogin } from './useLogin';
import './index.less';

export interface LoginModalRef {
  showModal: () => void;
  handleCancel: () => void;
}

const Login = ({ ref }: { ref: React.Ref<LoginModalRef> }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { show, hide } = useLoginModalStore();
  const { formRef, login } = useLogin();

  // 暴露一个open弹窗的方法
  const showModal = () => {
    show();
    setIsModalOpen(true);
  };

  // 暴露一个close弹窗的方法
  const handleCancel = () => {
    // 清空表单
    formRef.current?.resetFields();
    setIsModalOpen(false);
    hide();
  };

  const onFinish = async (values: any) => {
    try {
      const success = await login(values);
      if (success) {
        window.location.reload();
      }
    }
    catch (error: any) {
      console.log(error);
      // 清空表单密码
      formRef.current?.resetFields(['password']);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useImperativeHandle(ref, () => ({
    showModal,
    handleCancel,
  }));

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      maskClosable={false}
      keyboard={false}
      width={480}
      wrapClassName="login-modal"
    >
      <h1 className="login-title">{t('账号登录')}</h1>
      <Form
        ref={formRef}
        name="basic"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          style={{ marginTop: '40px' }}
          name="username"
          rules={[{ required: true, message: t('请输入用户名') }]}
        >
          <Input size="large" placeholder={t('请输入用户名')} prefix={<SvgIcon name="Zhanghao" color="#6C7380" />} />
        </Form.Item>
        <Form.Item
          style={{ marginTop: '40px' }}
          name="password"
          rules={[{ required: true, message: t('请输入密码') }]}
        >
          <Input.Password size="large" placeholder={t('请输入密码')} prefix={<SvgIcon name="Password" color="#6C7380" />} />
        </Form.Item>
        <Form.Item style={{ marginTop: '85px' }}>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            {t('登录')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
