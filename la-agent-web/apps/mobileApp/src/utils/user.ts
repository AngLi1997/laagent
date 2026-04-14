import { reqAgentConfigsUserGet } from '@/api';
import { getItem, setItem } from './mmkv';

export const getAvatar = async () => {
  try {
    const userData = JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string);
    const { data } = await reqAgentConfigsUserGet();
    if (data && data.icon_url) {
      setItem('BMOS_SSO_USER', JSON.stringify({
        ...userData,
        avatar: data.icon_url,
      }));
    }
  }
  catch (_error) {
    // 不能删，删除后头像无法加载
    console.log(_error);
  }
};
