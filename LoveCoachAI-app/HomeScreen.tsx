import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { allCharacters, coaches, partners } from './NewCharacters';

interface HomeScreenProps {
  onStartChat: (characterId: string) => void;
  onMessageReview: () => void;
  onProfileCreate: () => void;
  onTabChange: (tab: string) => void;
}

export default function HomeScreen({ onStartChat, onMessageReview, onProfileCreate, onTabChange }: HomeScreenProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleStartChat = () => {
    if (!selectedCharacter) {
      alert('キャラクターを選択してください');
      return;
    }
    onStartChat(selectedCharacter);
  };

  const legacyCharacters = allCharacters.filter(char => char.type === 'legacy');

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LoveCoach AI</Text>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>おかえりなさい！</Text>
          <View style={styles.newFeatureAlert}>
            <Text style={styles.newFeatureText}>🆕 新機能追加！</Text>
          </View>
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

        {/* キャラクター選択 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AIキャラクターを選択</Text>
          
          {/* 従来版キャラ */}
          <View style={styles.subsectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.subsectionTitle}>🎭 従来版キャラクター</Text>
              <Text style={styles.subsectionBadge}>Classic</Text>
            </View>
            <View style={styles.characterGrid}>
              {legacyCharacters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterCard,
                    selectedCharacter === character.id && styles.characterCardSelected,
                    { borderColor: character.color }
                  ]}
                  onPress={() => handleCharacterSelect(character.id)}
                >
                  <Text style={styles.characterAvatar}>{character.avatar}</Text>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterPersonality}>{character.personality}</Text>
                  <Text style={styles.characterDescription}>{character.description}</Text>
                  
                  {selectedCharacter === character.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: character.color }]}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* コーチキャラ（新機能） */}
          <View style={styles.subsectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.subsectionTitle}>🎓 コーチ（添削・アドバイス専門）</Text>
              <Text style={styles.newFeatureBadge}>NEW</Text>
            </View>
            <View style={styles.characterGrid}>
              {coaches.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterCard,
                    styles.newCharacterCard,
                    selectedCharacter === character.id && styles.characterCardSelected,
                    { borderColor: character.color }
                  ]}
                  onPress={() => handleCharacterSelect(character.id)}
                >
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Coach</Text>
                  </View>
                  <Text style={styles.characterAvatar}>{character.avatar}</Text>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterPersonality}>{character.personality}</Text>
                  <Text style={styles.characterDescription}>{character.description}</Text>
                  
                  {selectedCharacter === character.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: character.color }]}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* パートナーキャラ（新機能） */}
          <View style={styles.subsectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.subsectionTitle}>💫 パートナー（会話練習相手）</Text>
              <Text style={styles.newFeatureBadge}>NEW</Text>
            </View>
            <View style={styles.characterGrid}>
              {partners.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterCard,
                    styles.newCharacterCard,
                    selectedCharacter === character.id && styles.characterCardSelected,
                    { borderColor: character.color }
                  ]}
                  onPress={() => handleCharacterSelect(character.id)}
                >
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Partner</Text>
                  </View>
                  <Text style={styles.characterAvatar}>{character.avatar}</Text>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterPersonality}>{character.personality}</Text>
                  <Text style={styles.characterDescription}>{character.description}</Text>
                  
                  {selectedCharacter === character.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: character.color }]}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* メイン機能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>主な機能</Text>
          
          <View style={styles.featureGrid}>
            {/* 会話機能 */}
            <TouchableOpacity 
              style={[styles.featureCard, styles.featureCardPrimary]}
              onPress={handleStartChat}
            >
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureTitle}>会話練習</Text>
              <Text style={styles.featureDescription}>
                AIキャラと恋愛会話を練習
              </Text>
              {!selectedCharacter && (
                <Text style={styles.featureNote}>※キャラを選択してください</Text>
              )}
            </TouchableOpacity>

            {/* メッセージ添削 */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={onMessageReview}
            >
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureTitle}>メッセ添削</Text>
              <Text style={styles.featureDescription}>
                メッセージを分析・改善提案
              </Text>
            </TouchableOpacity>

            {/* プロフィール作成 */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={onProfileCreate}
            >
              <Text style={styles.featureIcon}>📄</Text>
              <Text style={styles.featureTitle}>プロフィール作成</Text>
              <Text style={styles.featureDescription}>
                魅力的なプロフィール文を生成
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 使い方のヒント */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 使い方のヒント</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              • <Text style={styles.tipHighlight}>コーチ</Text>：メッセージ添削とアドバイスが得意{'\n'}
              • <Text style={styles.tipHighlight}>パートナー</Text>：会話練習の相手役{'\n'}
              • <Text style={styles.tipHighlight}>従来版</Text>：オールマイティな汎用キャラ
            </Text>
          </View>
        </View>

        {/* 底余白 */}
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
    marginBottom: 4,
  },
  newFeatureAlert: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newFeatureText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
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
  subsectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subsectionBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  newFeatureBadge: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  characterGrid: {
    gap: 12,
  },
  characterCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  newCharacterCard: {
    borderStyle: 'dashed',
    backgroundColor: '#FAFAFA',
  },
  characterCardSelected: {
    borderWidth: 3,
    backgroundColor: '#F8F8F8',
  },
  roleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  characterAvatar: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 12,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  characterPersonality: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  characterDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureCardPrimary: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureNote: {
    fontSize: 12,
    color: '#FF6B9D',
    marginTop: 8,
    fontWeight: 'bold',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  tipHighlight: {
    fontWeight: 'bold',
    color: '#FF6B9D',
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
