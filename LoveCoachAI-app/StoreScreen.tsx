import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

interface StoreScreenProps {
  onTabChange: (tab: string) => void;
}

export default function StoreScreen({ onTabChange }: StoreScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ストア</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>プラン一覧</Text>
          
          {/* Free プラン */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Free</Text>
              <Text style={styles.planPrice}>¥0/月</Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureItem}>• 広告あり</Text>
              <Text style={styles.featureItem}>• 会話 10回/日</Text>
              <Text style={styles.featureItem}>• 添削 3回/月</Text>
              <Text style={styles.featureItem}>• プロフィール作成（プレビューのみ）</Text>
            </View>
            <TouchableOpacity style={[styles.planButton, styles.currentPlan]}>
              <Text style={styles.currentPlanText}>現在のプラン</Text>
            </TouchableOpacity>
          </View>

          {/* Plus プラン */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Plus</Text>
              <Text style={styles.planPrice}>¥580/月</Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureItem}>• 広告なし</Text>
              <Text style={styles.featureItem}>• 会話 30回/日</Text>
              <Text style={styles.featureItem}>• 添削 10回/月</Text>
            </View>
            <TouchableOpacity style={styles.planButton}>
              <Text style={styles.planButtonText}>アップグレード</Text>
            </TouchableOpacity>
          </View>

          {/* Pro プラン */}
          <View style={[styles.planCard, styles.recommendedPlan]}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>おすすめ</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Pro</Text>
              <Text style={styles.planPrice}>¥1,480/月</Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureItem}>• 広告なし</Text>
              <Text style={styles.featureItem}>• 会話 60回/日</Text>
              <Text style={styles.featureItem}>• 添削 30回/月</Text>
              <Text style={styles.featureItemHighlight}>• プロフィール作成 2回/月</Text>
              <Text style={styles.featureItemHighlight}>• 高度添削機能</Text>
            </View>
            <TouchableOpacity style={[styles.planButton, styles.proPlanButton]}>
              <Text style={styles.proPlanButtonText}>アップグレード</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 都度課金 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>都度課金</Text>
          
          <View style={styles.creditCard}>
            <Text style={styles.creditTitle}>プロフィールクレジット</Text>
            <Text style={styles.creditDescription}>プロフィール作成機能を単発で利用</Text>
            <View style={styles.creditOptions}>
              <TouchableOpacity style={styles.creditOption}>
                <Text style={styles.creditAmount}>1回</Text>
                <Text style={styles.creditPrice}>¥980</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.creditOption, styles.creditOptionRecommended]}>
                <Text style={styles.creditAmount}>3回</Text>
                <Text style={styles.creditPrice}>¥2,200</Text>
                <Text style={styles.creditSavings}>¥740お得</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.creditCard}>
            <Text style={styles.creditTitle}>追加キャラクター</Text>
            <Text style={styles.creditDescription}>新しいAIコーチを追加</Text>
            <View style={styles.creditOptions}>
              <TouchableOpacity style={styles.creditOption}>
                <Text style={styles.creditAmount}>1体</Text>
                <Text style={styles.creditPrice}>¥490</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.creditOption, styles.creditOptionRecommended]}>
                <Text style={styles.creditAmount}>3体セット</Text>
                <Text style={styles.creditPrice}>¥1,100</Text>
                <Text style={styles.creditSavings}>¥370お得</Text>
              </TouchableOpacity>
            </View>
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
          style={[styles.tabItem, styles.tabItemActive]}
          onPress={() => onTabChange('store')}
        >
          <Text style={styles.tabIcon}>🛍️</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>ストア</Text>
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
  planSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  recommendedPlan: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFFBFC',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  planFeatures: {
    marginBottom: 20,
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  featureItemHighlight: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  planButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentPlan: {
    backgroundColor: '#E5E5E5',
  },
  proPlanButton: {
    backgroundColor: '#FF6B9D',
  },
  planButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentPlanText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  creditTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  creditDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  creditOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  creditOption: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  creditOptionRecommended: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF5F8',
  },
  creditAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  creditPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  creditSavings: {
    fontSize: 12,
    color: '#FF6B9D',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
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
