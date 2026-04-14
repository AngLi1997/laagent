import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import RightIcon from '@/assets/icons/right.svg';
import BackIcon from '@/assets/icons/BackIcon.svg';
import CheckIcon from '@/assets/icons/CheckIcon.svg';
import { getItem, setItem, updateLangResource } from '@/utils';
import { I18nLanguageEnum, I18nLanguageType, t, changeLanguage } from '@bmos/i18n';
import LogoutModal from '@/components/LogoutModal'
import { useNavigation } from '@react-navigation/native';
import { LANGUAGE_KEY } from '@/types';

const LANGUAGES = [
  { key: I18nLanguageEnum.ZH_CN, label: '中文', sub: '中文' },
  { key: I18nLanguageEnum.EN_US, label: 'English', sub: '英语' },
  { key: I18nLanguageEnum.RU_RU, label: 'Русский', sub: '俄语' },
];

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState<I18nLanguageType>(I18nLanguageEnum.ZH_CN);
  const [userData, setUserData] = useState<any>({})
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // 添加状态

  // Placeholder handlers
  const handleGoBack = () => {
    navigation.navigate('Chat' as never)
  };
  const handleEditAvatar = () => {
    navigation.navigate('ChangeAvatar' as never)
  };
  const handleEditPassword = () => {
    navigation.navigate('ChangePassword' as never)
  };
  const handleFeedback = () => {
    navigation.navigate('Feedback' as never)
  };
  const handleLogout = () => {
    setLogoutModalVisible(true)
  };

  const handleLanguageChange = (langKey: string) => {
    setSelectedLang(langKey as I18nLanguageType);
    setItem(LANGUAGE_KEY, langKey)
    changeLanguage(langKey as I18nLanguageType);
    updateLangResource(langKey).then(() => {
      // 重新导航到当前页面
      navigation.navigate('Set' as never);
    })
  };

  // 初始化加载
  useEffect(() => {
    try {
      if (getItem(LANGUAGE_KEY)) {
        setSelectedLang(getItem(LANGUAGE_KEY) as I18nLanguageType)
      }
      setUserData(JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string))
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} backgroundColor="#F5F5F5" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={handleGoBack}>
          <BackIcon color="#2B2F33" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('设置')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Avatar & Username Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{userData.userName}</Text>
          </View>
          <View style={styles.divider} />
          {/* List Items */}
          <TouchableOpacity style={styles.listItem} onPress={handleEditAvatar} activeOpacity={0.7}>
            <Text style={styles.listText}>{t('修改头像')}</Text>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={handleEditPassword} activeOpacity={0.7}>
            <Text style={styles.listText}>{t('修改密码')}</Text>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.listItem} onPress={handleFeedback} activeOpacity={0.7}>
            <Text style={styles.listText}>{t('反馈与建议')}</Text>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </TouchableOpacity>
        </View>
        {/* Language Card */}
        <View style={styles.card}>
          <Text style={styles.langTitle}>{t('语言')}</Text>
          {LANGUAGES.map((lang, idx) => (
            <TouchableOpacity
              key={lang.key}
              style={[
                styles.langItem,
                idx === LANGUAGES.length - 1 && { borderBottomWidth: 0 }, // 移除最后一项的边框
              ]}
              activeOpacity={0.7}
              onPress={() => handleLanguageChange(lang.key)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.langLabel}>{lang.label}</Text>
                <Text style={styles.langSub}>{lang.sub}</Text>
              </View>
              {selectedLang === lang.key && (
                <CheckIcon width={20} height={20} color="#1976D2" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('退出登录')}</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Logout Modal */}
      <LogoutModal
        visible={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)} // 关闭弹窗
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderColor: '#fff'
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 14,
  },
  username: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 16,
    marginRight: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'space-between',
  },
  listText: {
    fontSize: 16,
    color: '#222',
  },
  langTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  langLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  langSub: {
    fontSize: 12,
    color: '#BDBDBD',
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 32,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SettingsScreen;
