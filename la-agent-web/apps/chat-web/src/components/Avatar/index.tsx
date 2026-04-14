import type { GetProp, UploadProps } from 'antd';
import { t } from '@bmos/i18n';
import { App, Avatar, Button, Modal, Upload } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { reqAgentConfigsRecord, reqAgentFileUpload } from '@/api';
import SvgIcon from '../SvgIcon';

interface ChangeAvatarModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const useStyle = createStyles(({ css }) => {
  return {
    title: css`
    color: #6C6E73;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    margin-bottom: 16px;
    `,
  };
});

const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({ open, onCancel, onFinish }) => {
  const { styles } = useStyle();
  const { message } = App.useApp();

  const handleFinish = async () => {
    try {
      const formData = new FormData();
      if (!file) {
        message.error(t('请选择文件'));
        return;
      }
      formData.append('file', file);
      const { data } = await reqAgentFileUpload(formData);
      const userInfo = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
      await reqAgentConfigsRecord({
        url: data,
        user_id: userInfo.userId,
      });
      onFinish();
      onCancel();
      setImageUrl(undefined);
      setFile(null);
      message.success(t('修改成功'));
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  const [imgUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<FileType | null>(null);

  const beforeUpload = (file: FileType) => {
    // 限制文件类型 jpeg/png/jpg/gif
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error(t('图片格式不支持'));
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    setFile(file);
    getBase64(file as FileType, (url) => {
      setImageUrl(url);
    });
  };

  useEffect(() => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
      if (userInfo?.avatar) {
        setImageUrl(userInfo.avatar);
      }
    }
    catch (_error) {

    }
  }, [open]);

  return (
    <Modal
      title={t('修改名称')}
      open={open}
      onCancel={() => {
        onCancel();
        setImageUrl(undefined);
        setFile(null);
      }}
      destroyOnHidden
      footer={null}
    >
      <div className={styles.title}>{t('头像预览')}</div>
      <Avatar size={64} src={imgUrl || <SvgIcon name="DefaultAvatar" size={64} />} />
      <Upload
        className="avatar-uploader"
        showUploadList={false}
        customRequest={() => { }}
        beforeUpload={beforeUpload}
      >
        <Button style={{ marginLeft: 20 }}>{t('上传头像')}</Button>
      </Upload>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          {t('取消')}
        </Button>
        <Button type="primary" onClick={handleFinish}>
          {t('确定')}
        </Button>
      </div>
    </Modal>
  );
};

export default ChangeAvatarModal;
