import { PermissionsAndroid, Platform } from 'react-native';
import { t } from '@bmos/i18n';
import { Toast } from '@ant-design/react-native';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Toast.show(t('需要权限才能选择图片'));
      }
    } catch (err) {
      console.warn(err);
    }
  }
};