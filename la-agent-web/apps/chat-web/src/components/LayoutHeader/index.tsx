import { t } from '@bmos/i18n';
import { getLogoUrl } from '@bmos/utils';
import { Button, Divider, Space } from 'antd';
import { createStyles } from 'antd-style';
// 初始化
import React from 'react';
import { useLoginModalStore } from '@/stores/loginModalStore';
import { getStoredToken } from '@/utils/token';
import LanguageSelector from '../LanguageSelector';

const useStyle = createStyles(({ css }) => {
  return {
    header: css`
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      font-family: AlibabaPuHuiTi, sans-serif;
    `,
    headerOperation: css`
      height: 50px;
      padding: 0 16px;
    `,
  };
});

const LayoutHeader: React.FC = () => {
  const token = getStoredToken();

  const { show } = useLoginModalStore();

  const { styles } = useStyle();

  return (
    <div className={styles.header}>
      <div style={{ width: '200px', height: '50px' }}>
        <img src={getLogoUrl('Bmos_logo.svg')} style={{ width: '200px', height: '100%' }} />
      </div>
      <Space split={<Divider type="vertical" />} className={styles.headerOperation}>
        <LanguageSelector />
        {!token && <Button type="primary" size="small" onClick={show}>{t('立即登录')}</Button>}
      </Space>
    </div>
  );
};

export default LayoutHeader;
