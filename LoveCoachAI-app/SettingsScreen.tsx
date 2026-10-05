import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface SettingsScreenProps {
  onTabChange: (tab: string) => void;
}

export default function SettingsScreen({ onTabChange }: SettingsScreenProps) {
  const handleAccountAction = (action: string) => {
    Alert.alert('準備中', 'この機能は準備中です。');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* アカウント設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('login')}
          >
            <Text style={styles.settingIcon}>👤</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>ログイン / アカウント作成</Text>
              <Text style={styles.settingDescription}>データを保存・同期</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 利用状況 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>利用状況</Text>
          
          <View style={styles.usageCard}>
            <Text style={styles.usageTitle}>今日の利用状況</Text>
            <View style={styles.usageStats}>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>3</Text>
                <Text style={styles.usageLabel}>会話回数</Text>
                <Text style={styles.usageLimit}>/ 10回</Text>
              </View>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>1</Text>
                <Text style={styles.usageLabel}>添削回数</Text>
                <Text style={styles.usageLimit}>/ 3回</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 通知設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('notifications')}
          >
            <Text style={styles.settingIcon}>🔔</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>プッシュ通知</Text>
              <Text style={styles.settingDescription}>練習リマインダー、アップデート情報</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* サポート */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>サポート</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('help')}
          >
            <Text style={styles.settingIcon}>❓</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>ヘルプ・使い方</Text>
              <Text style={styles.settingDescription}>よくある質問、チュートリアル</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('contact')}
          >
            <Text style={styles.settingIcon}>📧</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>お問い合わせ</Text>
              <Text style={styles.settingDescription}>ご質問、ご要望、バグ報告</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 法的情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>法的情報</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('terms')}
          >
            <Text style={styles.settingIcon}>📄</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>利用規約</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleAccountAction('privacy')}
          >
            <Text style={styles.settingIcon}>🔒</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>プライバシーポリシー</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* アプリ情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          
          <View style={styles.appInfo}>
            <Text style={styles.appName}>LoveCoach AI</Text>
            <Text style={styles.appVersion}>バージョン 1.0.0 (MVP)</Text>
            <Text style={styles.appDescription}>
              恋愛スキル向上アプリ{'\n'}
              18歳以上向け学習アプリです
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* フッタータブ */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('home')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>ホーム</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('analysis')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={styles.tabLabel}>分析</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('store')}
        >
          <Text style={styles.tabIcon}>🛍️</Text>
          <Text style={styles.tabLabel}>ストア</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, styles.tabItemActive]}
          onPress={() => onTabChange('settings')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>設定</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingArrow: {
    fontSize: 20,
    color: '#CCC',
  },
  usageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  usageLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  usageLimit: {
    fontSize: 12,
    color: '#666',
  },
  appInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    // アクティブなタブのスタイル
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabLabelActive: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
});
