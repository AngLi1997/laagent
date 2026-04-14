import { userLogin } from '@/api';
import CloseEye from '@/assets/icons/CloseEye.svg';

import Eye from '@/assets/icons/eye.svg';
import PwdIcon from '@/assets/icons/pwd.svg';
import UsernameIcon from '@/assets/icons/username.svg';
import { encrypt, getAvatar, setItem } from '@/utils';
import { Modal, Toast } from '@ant-design/react-native';
import { t } from '@bmos/i18n';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const onSuccessLogin = async (userData: any) => {
    try {
      setItem('BMOS-ACCESS-TOKEN', userData.token);
      setItem('BMOS_SSO_USER', JSON.stringify(userData));
      getAvatar();
    }
    catch (_error) {
      //
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show(t('账号和密码不能为空'));
      return;
    }
    setLoading(true);
    // 模拟 API 调用
    try {
      const data = {
        loginName: username,
        password: encrypt(password),
        serviceType: 'MES',
        terminalType: 1,
      };
      const res: any = await userLogin(data);
      if (res.code === 0) {
        const userData = res.data;
        switch (userData.activeStatus) {
          case 0:
            Toast.show(t('账号未激活，请先激活账号'));
            break;
          case 2:
            Toast.show(t('您的密码已过有效期,需修改密码'));
            break;

          case 1:
            if (userData.remindExpire) {
              Modal.alert(t('提示'), t('您的密码即将到期，请尽快更换以保持账户安全。'), [
                { text: t('确定'), onPress: () => onSuccessLogin(userData) },
              ]);
            }
            else {
              await onSuccessLogin(userData);
            }
            break;

          default:
            break;
        }
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Chat' } as any],
      });
    }
    catch (error: any) {
      error.message ? Toast.show(error.message) : Toast.show(t('登录失败，请重试'));
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/loginBk.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 20}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/LoginLogo.png')}
                  style={styles.loginLogo}
                  resizeMode="cover"
                />
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{t('账号登录')}</Text>
                <Text style={styles.subtitle}>{t('欢迎使用，您可以随时找我提问')}</Text>
              </View>

              {/* Login Form */}
              <View style={styles.form}>
                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <UsernameIcon style={styles.leftIcon} color="#CED3D9" width={24} height={24} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('请输入账号')}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <PwdIcon style={styles.leftIcon} color="#CED3D9" width={24} height={24} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('请输入密码')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIconText}>
                      {showPassword ? <Eye color="#CED3D9" width={24} height={24} /> : <CloseEye color="#CED3D9" width={24} height={24} />}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading
                    ? (
                        <ActivityIndicator color="#fff" />
                      )
                    : (
                        <Text style={styles.buttonText}>{t('登录')}</Text>
                      )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          
          {/* Footer - outside KeyboardAvoidingView */}
          <View style={styles.footer}>
            <Image
              source={require('@/assets/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginLogo: {
    width: 60,
    height: 60,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 44,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  leftIcon: {
    marginLeft: 16,
  },
  eyeIconText: {
    color: '#1890ff',
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: '#1890ff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 100,
    height: 14,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default Login;
