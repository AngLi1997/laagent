import { useState } from 'react';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import EN from './icon/EN.svg'
import { t } from '@bmos/i18n';
import SvgIcon from '../SvgIcon';
const { Option } = Select;

const LanguageSelector = () => {


  const [ languageValue, setLanguageValue ] = useState<string>('zh_CN');

  const languageList = [{ label: t('简体中文'), value: 'zh_CN' }];

  const handleChange = (value: string) => {
    setLanguageValue(value);
    // 你原来的 ChangeLanguage 方法可以在这里处理
  };

  return (
    <Select
      value={languageValue}
      placeholder={t('请选择')}
      size="small"
      variant="borderless"
      style={{ width: 130, backgroundColor: '#F2F3F5', borderRadius: '4px' }}
      onChange={handleChange}
      suffixIcon={
        <CaretDownOutlined style={{ pointerEvents: 'none'}} />
      }
    >
      {languageList.map((item) => (
        <Option key={item.value} value={item.value}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <SvgIcon name="EN" size={14} />
            {item.label}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelector;
