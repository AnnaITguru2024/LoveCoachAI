import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { allCharacters, coaches, partners } from './NewCharacters';

interface HomeScreenImprovedProps {
  onStartChat: (characterId: string) => void;
  onMessageReview: () => void;
  onProfileCreate: () => void;
  onTabChange: (tab: string) => void;
}

export default function HomeScreenImproved({ onStartChat, onMessageReview, onProfileCreate, onTabChange }: HomeScreenImprovedProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleStartChat = (characterId: string) => {
    onStartChat(characterId);
  };

  const legacyCharacters = allCharacters.filter(char => char.type === 'legacy');

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LoveCoach AI</Text>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>おかえりなさい！</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 今日の提案バナー */}
        <View style={styles.dailyBanner}>
          <Text style={styles.bannerTitle}>💡 今日のおすすめ</Text>
          <Text style={styles.bannerText}>
            新しいコーチ＆パートナー機能で、より効果的な恋愛スキル向上を！
          </Text>
        </View>

        {/* コーチキャラ - 横並び */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 コーチ（添削・アドバイス専門）</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.horizontalCardRow}>
              {coaches.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[styles.horizontalCard, styles.coachCard]}
                  onPress={() => handleStartChat(character.id)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.characterAvatar}>{character.avatar}</Text>
                    <View style={styles.roleTag}>
                      <Text style={styles.roleTagText}>Coach</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterPersonality}>{character.personality}</Text>
                  <Text style={styles.characterDescriptionSmall} numberOfLines={2}>
                    {character.description}
                  </Text>
                  
                  <View style={styles.chatButtonSmall}>
                    <Text style={styles.chatButtonTextSmall}>💬 会話</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* パートナーキャラ - 横並び */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💫 パートナー（会話練習相手）</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.horizontalCardRow}>
              {partners.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[styles.horizontalCard, styles.partnerCard]}
                  onPress={() => handleStartChat(character.id)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.characterAvatar}>{character.avatar}</Text>
                    <View style={styles.roleTag}>
                      <Text style={styles.roleTagText}>Partner</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterPersonality}>{character.personality}</Text>
                  <Text style={styles.characterDescriptionSmall} numberOfLines={2}>
                    {character.description}
                  </Text>
                  
                  <View style={styles.chatButtonSmall}>
                    <Text style={styles.chatButtonTextSmall}>💬 練習</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* レガシーキャラ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 従来版キャラクター</Text>
          
          <View style={styles.legacyRow}>
            {legacyCharacters.map((character) => (
              <TouchableOpacity
                key={character.id}
                style={styles.legacyCard}
                onPress={() => handleStartChat(character.id)}
              >
                <Text style={styles.legacyAvatar}>{character.avatar}</Text>
                <Text style={styles.legacyName}>{character.name}</Text>
                <Text style={styles.legacyPersonality}>{character.personality}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* その他機能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>その他の機能</Text>
          
          <View style={styles.featureRow}>
            <TouchableOpacity style={styles.featureCard} onPress={onMessageReview}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureTitle}>メッセ添削</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureCard} onPress={onProfileCreate}>
              <Text style={styles.featureIcon}>📄</Text>
              <Text style={styles.featureTitle}>プロフィール作成</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* フッタータブ */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, styles.tabItemActive]}
          onPress={() => onTabChange('home')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>ホーム</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerRight: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dailyBanner: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFE4E1',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
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
  horizontalScroll: {
    marginHorizontal: -20, // コンテナのパディングを無効化
  },
  horizontalCardRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  horizontalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  coachCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  partnerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  characterAvatar: {
    fontSize: 28,
  },
  roleTag: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  characterPersonality: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  characterDescriptionSmall: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
    marginBottom: 12,
    height: 28, // 2行分の高さを固定
  },
  chatButtonSmall: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  chatButtonTextSmall: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  legacyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legacyCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legacyAvatar: {
    fontSize: 24,
    marginBottom: 8,
  },
  legacyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  legacyPersonality: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
  tabItemActive: {},
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
