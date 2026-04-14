import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar, Alert, ActivityIndicator } from 'react-native';
import BackIcon from '@/assets/icons/BackIcon.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { t } from '@bmos/i18n';
import { getAvatar, getItem } from '@/utils';
import { Toast } from '@ant-design/react-native';
import { reqAgentConfigsRecord, reqAgentFileUpload } from '@/api';

const defaultAvatar = require('@/assets/avatar.png'); // 请准备一张默认头像图片放在assets文件夹

const ChangeAvatarScreen = () => {
  const navigation = useNavigation();
  const [avatarSource, setAvatarSource] = useState(defaultAvatar); // 初始为默认头像
  const [isUploading, setIsUploading] = useState(false); // 上传状态
  const [hasUpload, setHasUpload] = useState(false)
  const [file, setFile] = useState<any>()

  const handleChoosePhoto = async () => {
    try {
      // await requestPermissions()
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        Toast.show(t('选择图片失败，请重试'))
      } else if (result.assets && result.assets.length > 0) {
        const asset: any = result.assets[0];
        const source = { uri: asset.uri };
        setAvatarSource(source);
        setHasUpload(true);
        setFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'avatar.jpg',
        }); // 保存文件详细信息
      }
    } catch (error) {
      Toast.show(t('选择图片失败，请重试'))
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      if (!file || !file.uri) {
        Toast.show(t('请选择文件'))
        setIsUploading(false);
        return;
      }
      formData.append('file', file);
      const { data } = await reqAgentFileUpload(formData);
      const userInfo = JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string);
      await reqAgentConfigsRecord({
        url: data,
        user_id: userInfo.userId,
      });
      await getAvatar()
      navigation.navigate('Set' as never);
    } catch (error) {
      Toast.show(t('头像保存失败，请重试'))
    } finally {
      setIsUploading(false);
    }
  };

  const [userData, setUserData] = useState<any>({})
  // 初始化加载
  useEffect(() => {
    try {
      const user = JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string)
      setUserData(user)
      if (user.avatar) {
        setAvatarSource({
          uri: user.avatar
        })
      }
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Set' as never)} style={styles.backButton}>
            <BackIcon color="#2B2F33" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('修改头像')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.previewLabel}>{t('头像预览')}</Text>
          <View style={styles.avatarContainer}>
            <Image
              source={avatarSource}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={handleChoosePhoto}>
            <Text style={styles.uploadButtonText}>{t('上传头像')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, hasUpload && { backgroundColor: '#1976D2' }, isUploading && { backgroundColor: '#CCCCCC' },]}
          onPress={handleSaveChanges}
          disabled={isUploading}
        >
          {isUploading
            ? (
              <ActivityIndicator color="#fff" />
            )
            : (
              <Text style={styles.saveButtonText}>
                {t('保存')}
              </Text>
            )}

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    height: 56,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerRightPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  previewLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  uploadButtonText: {
    color: '#333333',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#A0C4FF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangeAvatarScreen;