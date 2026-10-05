import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { allCharacters, coaches, partners } from './NewCharacters';

interface HomeScreenTabUIProps {
  onStartChat: (characterId: string) => void;
  onMessageReview: () => void;
  onProfileCreate: () => void;
  onTabChange: (tab: string) => void;
}

type TabType = 'coach' | 'partner' | 'legacy';

export default function HomeScreenTabUI({ onStartChat, onMessageReview, onProfileCreate, onTabChange }: HomeScreenTabUIProps) {
  const [activeTab, setActiveTab] = useState<TabType>('coach');

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCharacterSelect = (characterId: string) => {
    onStartChat(characterId);
  };

  const legacyCharacters = allCharacters.filter(char => char.type === 'legacy');

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'coach' && styles.activeTab]}
        onPress={() => handleTabPress('coach')}
      >
        <Text style={[styles.tabText, activeTab === 'coach' && styles.activeTabText]}>
          🎓 コーチ
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'partner' && styles.activeTab]}
        onPress={() => handleTabPress('partner')}
      >
        <Text style={[styles.tabText, activeTab === 'partner' && styles.activeTabText]}>
          👥 パートナー
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'legacy' && styles.activeTab]}
        onPress={() => handleTabPress('legacy')}
      >
        <Text style={[styles.tabText, activeTab === 'legacy' && styles.activeTabText]}>
          📚 その他
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabDescription = () => {
    const descriptions = {
      coach: {
        title: '🎓 コーチ',
        subtitle: 'あなたの恋愛スキル向上をサポート',
        description: 'メッセージ添削・アドバイス・スキル分析'
      },
      partner: {
        title: '👥 パートナー',
        subtitle: '安全な環境で会話練習しよう',
        description: 'ロールプレイ・会話練習・実践トレーニング'
      },
      legacy: {
        title: '📚 その他',
        subtitle: '従来のキャラクター',
        description: 'これまでのキャラクターとの会話'
      }
    };

    const current = descriptions[activeTab];
    return (
      <View style={styles.tabDescription}>
        <Text style={styles.descriptionTitle}>{current.title}</Text>
        <Text style={styles.descriptionSubtitle}>{current.subtitle}</Text>
        <Text style={styles.descriptionText}>{current.description}</Text>
      </View>
    );
  };

  const renderCharacterCard = (character: any) => {
    const isCoach = activeTab === 'coach';
    const isPartner = activeTab === 'partner';
    
    return (
      <TouchableOpacity
        key={character.id}
        style={styles.characterCard}
        onPress={() => handleCharacterSelect(character.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.characterEmoji}>{character.emoji || '😊'}</Text>
        </View>
        
        <Text style={styles.characterType}>
          {character.personality || character.description}
        </Text>
        
        <Text style={styles.characterDescription}>
          {character.traits || character.style || '会話をお楽しみください'}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.chatButton,
            isCoach && styles.coachButton,
            isPartner && styles.partnerButton
          ]}
          onPress={() => handleCharacterSelect(character.id)}
        >
          <Text style={styles.chatButtonText}>
            {isCoach ? '💬 相談する' : isPartner ? '💬 練習する' : '💬 会話する'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    let characters;
    switch (activeTab) {
      case 'coach':
        characters = coaches;
        break;
      case 'partner':
        characters = partners;
        break;
      case 'legacy':
        characters = legacyCharacters;
        break;
      default:
        characters = [];
    }

    return (
      <View style={styles.charactersGrid}>
        {characters.map(character => renderCharacterCard(character))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LoveCoach AI</Text>
        <Text style={styles.welcomeText}>おかえりなさい！</Text>
      </View>

      {/* タブバー */}
      {renderTabBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* タブの説明 */}
        {renderTabDescription()}

        {/* キャラクターカード */}
        {renderTabContent()}

        {/* 他の機能へのアクセス */}
        <View style={styles.otherFeatures}>
          <Text style={styles.otherFeaturesTitle}>その他の機能</Text>
          
          <TouchableOpacity style={styles.featureButton} onPress={onMessageReview}>
            <Text style={styles.featureButtonIcon}>✏️</Text>
            <View style={styles.featureButtonContent}>
              <Text style={styles.featureButtonTitle}>メッセージ添削</Text>
              <Text style={styles.featureButtonDescription}>送信前のメッセージをAIがチェック</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureButton} onPress={onProfileCreate}>
            <Text style={styles.featureButtonIcon}>📝</Text>
            <View style={styles.featureButtonContent}>
              <Text style={styles.featureButtonTitle}>プロフィール作成</Text>
              <Text style={styles.featureButtonDescription}>魅力的な自己紹介文を生成</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* フッタータブバー */}
      <View style={styles.footerTabs}>
        <TouchableOpacity style={styles.footerTab} onPress={() => onTabChange('home')}>
          <Text style={styles.footerTabText}>🏠 ホーム</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={() => onTabChange('analysis')}>
          <Text style={styles.footerTabText}>📊 分析</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={() => onTabChange('store')}>
          <Text style={styles.footerTabText}>🛍️ ストア</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={() => onTabChange('settings')}>
          <Text style={styles.footerTabText}>⚙️ 設定</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFB6C1',
    borderBottomWidth: 1,
    borderBottomColor: '#FFB6C1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B008B',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: '#8B008B',
  },
  
  // タブバー
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFB6C1',
    borderBottomWidth: 1,
    borderBottomColor: '#FF69B4',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF1493',
    backgroundColor: '#FFB6C1',
  },
  tabText: {
    fontSize: 16,
    color: '#8B008B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF1493',
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
  },

  // タブ説明
  tabDescription: {
    backgroundColor: '#FFCCCB',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B008B',
    marginBottom: 5,
  },
  descriptionSubtitle: {
    fontSize: 16,
    color: '#8B008B',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#8B008B',
    textAlign: 'center',
  },

  // キャラクターグリッド
  charactersGrid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // キャラクターカード
  characterCard: {
    width: '48%',
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B008B',
  },
  characterEmoji: {
    fontSize: 24,
  },
  characterType: {
    fontSize: 14,
    color: '#FF1493',
    fontWeight: '600',
    marginBottom: 5,
  },
  characterDescription: {
    fontSize: 12,
    color: '#8B008B',
    marginBottom: 15,
    lineHeight: 18,
  },

  // ボタン
  chatButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  coachButton: {
    backgroundColor: '#FF1493',
  },
  partnerButton: {
    backgroundColor: '#FF69B4',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // その他の機能
  otherFeatures: {
    padding: 20,
    backgroundColor: '#FFCCCB',
    marginTop: 10,
  },
  otherFeaturesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B008B',
    marginBottom: 15,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF0F5',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  featureButtonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureButtonContent: {
    flex: 1,
  },
  featureButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B008B',
    marginBottom: 2,
  },
  featureButtonDescription: {
    fontSize: 12,
    color: '#8B008B',
  },

  // フッタータブ
  footerTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFB6C1',
    borderTopWidth: 1,
    borderTopColor: '#FF69B4',
    paddingVertical: 10,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerTabText: {
    fontSize: 12,
    color: '#8B008B',
  },
});
