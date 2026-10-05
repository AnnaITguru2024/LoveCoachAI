import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

interface AnalysisScreenProps {
  onTabChange: (tab: string) => void;
}

export default function AnalysisScreen({ onTabChange }: AnalysisScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>分析</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonIcon}>📊</Text>
          <Text style={styles.comingSoonTitle}>分析機能</Text>
          <Text style={styles.comingSoonSubtitle}>準備中</Text>
          <Text style={styles.comingSoonDescription}>
            恋愛スキルの成長分析、統計レポート、{'\n'}
            改善点の可視化などの機能を準備中です。
          </Text>
          
          <View style={styles.featurePreview}>
            <Text style={styles.previewTitle}>実装予定の機能</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• スキル成長グラフ</Text>
              <Text style={styles.featureItem}>• 会話分析レポート</Text>
              <Text style={styles.featureItem}>• 弱点改善提案</Text>
              <Text style={styles.featureItem}>• 月次進捗サマリー</Text>
            </View>
          </View>
        </View>
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
          style={[styles.tabItem, styles.tabItemActive]}
          onPress={() => onTabChange('analysis')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>分析</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('store')}
        >
          <Text style={styles.tabIcon}>🛍️</Text>
          <Text style={styles.tabLabel}>ストア</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('settings')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={styles.tabLabel}>設定</Text>
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
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featurePreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
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
