import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import BackIcon from '@/assets/icons/BackIcon.svg';
import CloseEye from '@/assets/icons/CloseEye.svg';
import Eye from '@/assets/icons/eye.svg';
import { useNavigation } from '@react-navigation/native';
import { t } from '@bmos/i18n';
import { Toast } from '@ant-design/react-native';
import { rePassWord } from '@/api';
import { encrypt, getItem, removeItem } from '@/utils';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 状态

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      // 校验输入是否为空
      if (!oldPassword || !newPassword || !confirmPassword) {
        return;
      }
      // 校验新密码和确认密码是否一致
      if (newPassword !== confirmPassword) {
        Toast.show(t('新密码与确认密码不一致'));
        return;
      }
      // 校验新密码不能与旧密码相同
      if (oldPassword === newPassword) {
        Toast.show(t('新密码不能与旧密码相同'));
        return;
      }
      await rePassWord({
        loginName: getItem('BMOS_SSO_USER') ? JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string).loginName : '',
        newPassword: encrypt(newPassword),
      });
      Toast.show(t('修改密码成功，请重新登录！'));
      // 退出登录
      removeItem('BMOS-ACCESS-TOKEN');
      removeItem('BMOS_SSO_USER');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' } as any],
      });
    } catch (error: any) {
      error.message && Toast.show(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Set' as never)} style={styles.backButton}>
            <BackIcon color="#2B2F33" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('修改密码')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}><Text style={styles.asterisk}>*</Text>{t('旧密码')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('请输入旧密码')}
                placeholderTextColor="#B0B0B0"
                secureTextEntry={!isOldPasswordVisible}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)} style={styles.eyeIcon}>
                {
                  isOldPasswordVisible ? <CloseEye color="#B0B0B0" width={24} height={24} /> : <Eye color="#B0B0B0" width={24} height={24} />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}><Text style={styles.asterisk}>*</Text>{t('新密码')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('请输入新密码')}
                placeholderTextColor="#B0B0B0"
                secureTextEntry={!isNewPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} style={styles.eyeIcon}>
                {
                  isNewPasswordVisible ? <CloseEye color="#B0B0B0" width={24} height={24} /> : <Eye color="#B0B0B0" width={24} height={24} />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}><Text style={styles.asterisk}>*</Text>{t('确认密码')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('再次输入新密码')}
                placeholderTextColor="#B0B0B0"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                {
                  isConfirmPasswordVisible ? <CloseEye color="#B0B0B0" width={24} height={24} /> : <Eye color="#B0B0B0" width={24} height={24} />
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (oldPassword && newPassword && confirmPassword) && { backgroundColor: '#1976D2' }]}
          onPress={handleSaveChanges}
          disabled={isLoading}>
          {isLoading
            ? (
              <ActivityIndicator color="#fff" />
            )
            : (
              <Text style={styles.saveButtonText}>{t('保存')}</Text>
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
    height: 56, // 根据实际设计调整
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerRightPlaceholder: { // 用于居中标题
    width: 30, // 与返回按钮宽度近似
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 8,
  },
  asterisk: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000000',
  },
  eyeIcon: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#A0C4FF', // 根据图片调整颜色
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    position: 'absolute', // 固定在底部
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

export default ChangePasswordScreen;