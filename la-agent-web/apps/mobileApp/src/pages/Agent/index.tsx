import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import BackIcon from '@/assets/icons/BackIcon.svg';
import { t } from '@bmos/i18n';
import { useNavigation } from '@react-navigation/native';
import AgentList from './components/AgentList'


const AgentScreen: React.FC = () => {
  const navigation = useNavigation();

  // Placeholder handlers
  const handleGoBack = () => {
    navigation.navigate('Chat' as never)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} backgroundColor="#F5F5F5" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={handleGoBack}>
          <BackIcon color="#2B2F33" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('智能体')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <AgentList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
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
});

export default AgentScreen;
