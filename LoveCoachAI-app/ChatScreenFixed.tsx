import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import PartnerSettingsDrawer, { PartnerSettings } from './PartnerSettingsDrawer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  characterId: string;
  onBack: () => void;
  onShowPaywall: () => void;
}

// キャラクター情報を取得（シンプル版）
const getCharacterInfo = (characterId: string) => {
  console.log('🎭 キャラクターID:', characterId);
  
  // 基本的なキャラクター情報
  const characterMap: Record<string, any> = {
    'coach-sakura': {
      name: 'さくら',
      avatar: '🌸',
      personality: '共感型コーチ',
      color: '#FFB6C1',
      greeting: 'こんにちは！私はさくらです。思いやり深く、相手の良い点を見つけて優しくアドバイス。どんなメッセージの相談をしましょうか？'
    },
    'coach-mitsuru': {
      name: 'みつる',
      avatar: '🎯',
      personality: '論理型コーチ',
      color: '#4A90E2',
      greeting: 'こんにちは！僕はみつるです。論理的に原因分析し、明確な改善案を提示します。どんな相談がありますか？'
    },
    'coach-luka': {
      name: 'ルカ',
      avatar: '🌈',
      personality: '包摂型コーチ',
      color: '#9B59B6',
      greeting: 'こんにちは！私はルカです。多様性を尊重し、丁寧な言語化でサポートします。お話しましょう。'
    },
    'partner-hinata': {
      name: 'ひなた',
      avatar: '☀️',
      personality: '明るく人懐っこい',
      color: '#FFA500',
      greeting: 'こんにちは！ひなたです。楽観的で好奇心旺盛、テンポの良い会話が得意。一緒に会話の練習をしましょう♪'
    },
    'partner-sota': {
      name: 'そうた',
      avatar: '🍂',
      personality: '落ち着いた知的タイプ',
      color: '#8B4513',
      greeting: 'こんにちは！僕はそうたです。聞き上手で、要約と深掘りが上手な会話スタイルです。お話ししましょう。'
    },
    'partner-aoi': {
      name: 'アオイ',
      avatar: '🌿',
      personality: '柔らかく安心感重視',
      color: '#20B2AA',
      greeting: 'こんにちは！私はアオイです。気遣いが細やか、境界線を尊重した会話スタイルです。'
    },
    // レガシーキャラクター
    'analytical': {
      name: 'アナ',
      avatar: '🤓',
      personality: '分析派',
      color: '#4A90E2',
      greeting: 'こんにちは！私はアナです。論理的なアプローチで恋愛のお手伝いをします。'
    },
    'natural': {
      name: 'ナツ',
      avatar: '😊',
      personality: '自然体',
      color: '#7ED321',
      greeting: 'こんにちは〜！ナツです♪ 自然体で楽しく恋愛について話しましょう。'
    },
    'creative': {
      name: 'クリス',
      avatar: '✨',
      personality: 'クリエイティブ',
      color: '#F5A623',
      greeting: 'やっほー！クリスだよ！ユニークで楽しい恋愛のアイデアを一緒に考えよう。'
    }
  };
  
  const selectedCharacter = characterMap[characterId];
  console.log('✨ 選択されたキャラクター:', selectedCharacter);
  
  // キャラクターが見つからない場合のフォールバック
  if (!selectedCharacter) {
    console.log('⚠️ キャラクターが見つかりません。デフォルトを使用:', characterId);
    return {
      name: 'デフォルト',
      avatar: '🤖',
      personality: 'AI',
      color: '#999999',
      greeting: `こんにちは！キャラクターID「${characterId}」で会話を始めます。`
    };
  }
  
  return selectedCharacter;
};
export default function ChatScreen({ characterId, onBack, onShowPaywall }: ChatScreenProps) {
  const character = getCharacterInfo(characterId);
  
  // キャラクターに応じた初期メッセージ
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(3);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [partnerSettings, setPartnerSettings] = useState<PartnerSettings>({
    mode: 'partner',
    partnerGender: 'auto',
    tone: 'gentle',
    boundaries: {
      polite: true,
      jokes_ok: false
    }
  });
  const scrollViewRef = useRef<ScrollView>(null);
  
  const remainingChats = Math.max(0, 10 - dailyUsage);

  // 初期メッセージをキャラクターに応じて設定（一度だけ実行）
  useEffect(() => {
    console.log('🚀 キャラクター初期化:', character.name, characterId);
    const initialMessage: Message = {
      id: 'initial-' + characterId + '-' + Date.now(),
      role: 'assistant',
      content: character.greeting,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [characterId]); // characterIdが変更された時のみ実行

  // 設定変更処理
  const handleSettingsChange = (newSettings: PartnerSettings) => {
    setPartnerSettings(newSettings);
    console.log('⚙️ 設定変更:', newSettings);
    Alert.alert('✅', '相手設定を更新しました！次の返信から反映されます。');
  };

  // 設定プレビューテキスト生成
  const getSettingsPreviewText = () => {
    const modeText = partnerSettings.mode === 'coach' ? 'コーチ' : '相手役';
    const genderText = 
      partnerSettings.partnerGender === 'male' ? '男性' :
      partnerSettings.partnerGender === 'female' ? '女性' :
      partnerSettings.partnerGender === 'nb' ? 'NB' : 'おまかせ';
    const toneText = 
      partnerSettings.tone === 'gentle' ? 'やさしい' :
      partnerSettings.tone === 'bright' ? '明るい' :
      partnerSettings.tone === 'smart' ? '知的' :
      partnerSettings.tone === 'tsundere' ? 'ツンデレ' : 'フラット';
    return `${modeText}・${genderText}・${toneText}`;
  };

  // テスト版と同じシンプルな送信処理
  const handleSendMessage = () => {
    console.log('🚀 SEND BUTTON CLICKED');
    console.log('📝 INPUT:', inputText);
    
    if (!inputText.trim()) {
      console.log('❌ EMPTY INPUT');
      return;
    }

    // Free プランの制限チェック（本番仕様）
    if (dailyUsage >= 10) {
      onShowPaywall();
      return;
    }

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    console.log('👤 USER MESSAGE:', userMessage);

    try {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, userMessage];
        console.log('📜 NEW MESSAGES ARRAY:', newMessages);
        return newMessages;
      });

      setInputText('');
      setIsLoading(true);

      // シンプルなAI応答（本番向けに少し強化）
      setTimeout(() => {
        const aiMessage: Message = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: `「${userMessage.content}」について一緒に考えましょう！\n—ヒント: より具体的に表現してみましょう\n—コピペ例: 「それについてもう少し教えてください」`,
          timestamp: new Date()
        };

        console.log('🤖 AI MESSAGE:', aiMessage);
        
        setMessages(prevMessages => {
          const finalMessages = [...prevMessages, aiMessage];
          console.log('📜 FINAL MESSAGES:', finalMessages);
          return finalMessages;
        });
        
        setIsLoading(false);
        setDailyUsage(prev => prev + 1);
      }, 1500);
      
    } catch (error) {
      console.error('❌ SEND MESSAGE ERROR:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 MESSAGES UPDATED - メッセージ数:', messages.length);
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]); // messages.lengthでのみ監視して無限ループを防ぐ

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー（本番仕様に近づける） */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        
        <View style={styles.characterInfo}>
          <Text style={styles.characterAvatar}>{character.avatar}</Text>
          <View>
            <Text style={styles.characterName}>{character.name}</Text>
            <TouchableOpacity 
              style={styles.settingsPreview}
              onPress={() => setShowSettingsDrawer(true)}
            >
              <Text style={styles.settingsPreviewText}>{getSettingsPreviewText()}</Text>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.usageInfo}>
          <Text style={styles.usageText}>残り{remainingChats}回</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* メッセージリスト */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer
              ]}
            >
              {message.role === 'assistant' && (
                <Text style={styles.messageAvatar}>{character.avatar}</Text>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' 
                    ? styles.userMessageBubble 
                    : styles.assistantMessageBubble
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}
                >
                  {message.content}
                </Text>
                <Text style={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.assistantMessageContainer}>
              <Text style={styles.messageAvatar}>{character.avatar}</Text>
              <View style={[styles.messageBubble, styles.assistantMessageBubble]}>
                <Text style={styles.loadingText}>入力中...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 入力エリア */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="メッセージを入力..."
            multiline
            maxLength={500}
            editable={dailyUsage < 10 && !isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading || dailyUsage >= 10) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading || dailyUsage >= 10}
          >
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>

        {dailyUsage >= 10 && (
          <View style={styles.limitReachedBanner}>
            <Text style={styles.limitReachedText}>
              本日の利用上限に達しました
            </Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={onShowPaywall}>
              <Text style={styles.upgradeButtonText}>アップグレード</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* 相手設定ドロワー */}
      <PartnerSettingsDrawer
        isVisible={showSettingsDrawer}
        settings={partnerSettings}
        onSettingsChange={handleSettingsChange}
        onClose={() => setShowSettingsDrawer(false)}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFB6C120',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  characterAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  characterPersonality: {
    fontSize: 14,
    color: '#666',
  },
  usageInfo: {
    alignItems: 'flex-end',
  },
  usageText: {
    fontSize: 12,
    color: '#666',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    fontSize: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: '#FF6B9D',
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FFB6C1',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  limitReachedBanner: {
    backgroundColor: '#FFE4E1',
    borderTopWidth: 1,
    borderTopColor: '#FFB6C1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitReachedText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  settingsPreviewText: {
    fontSize: 12,
    color: '#333',
    marginRight: 4,
  },
  settingsIcon: {
    fontSize: 12,
  },
});
