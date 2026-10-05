import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { allCharacters, coaches, partners } from './NewCharacters';
import PartnerSettingsDrawer, { PartnerSettings } from './PartnerSettingsDrawer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  color: string;
  greeting: string;
}

// キャラクター情報を統合して取得する関数
const getCharacterById = (id: string) => {
  const character = allCharacters.find(char => char.id === id);
  
  if (!character) {
    // fallback to legacy
    return {
      id: 'analytical',
      name: 'アナ',
      personality: '分析派',
      avatar: '🤓',
      color: '#4A90E2',
      greeting: 'こんにちは！私はアナです。論理的なアプローチで恋愛のお手伝いをします。まず、どんなことでお悩みですか？'
    };
  }

  // 新しいキャラクターの場合、greeting を生成
  if (character.type === 'new') {
    const greeting = generateGreeting(character);
    return {
      id: character.id,
      name: character.name,
      personality: character.personality,
      avatar: character.avatar,
      color: character.color,
      greeting: greeting
    };
  }

  // レガシーキャラクターの場合、固定のグリーティング
  const legacyGreetings: Record<string, string> = {
    'analytical': 'こんにちは！私はアナです。論理的なアプローチで恋愛のお手伝いをします。まず、どんなことでお悩みですか？',
    'natural': 'こんにちは〜！ナツです♪ 自然体で楽しく恋愛について話しましょう。何か気になることはありますか？',
    'creative': 'やっほー！クリスだよ！ユニークで楽しい恋愛のアイデアを一緒に考えよう。どんな話をする？'
  };

  return {
    id: character.id,
    name: character.name,
    personality: character.personality,
    avatar: character.avatar,
    color: character.color,
    greeting: legacyGreetings[character.id] || 'こんにちは！よろしくお願いします。'
  };
};

// 新キャラクターのグリーティングを生成
const generateGreeting = (character: any) => {
  if (character.role === 'coach') {
    return `こんにちは！私は${character.name}です。${character.description}。どんなメッセージの相談をしましょうか？`;
  } else if (character.role === 'partner') {
    return `こんにちは！${character.name}です。${character.description}。一緒に会話の練習をしましょう♪`;
  }
  return `こんにちは！${character.name}です。よろしくお願いします。`;
};

interface ChatScreenProps {
  characterId: string;
  onBack: () => void;
  onShowPaywall: () => void;
}

export default function ChatScreen({ characterId, onBack, onShowPaywall }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(3); // Free: 10回/日の使用済み回数
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
  
  const character = getCharacterById(characterId);
  const remainingChats = Math.max(0, 10 - dailyUsage); // Free プランの制限

  useEffect(() => {
    // 初期メッセージを追加
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: character.greeting,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [character]);

  useEffect(() => {
    // メッセージが追加されたら最下部にスクロール
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSettingsChange = (newSettings: PartnerSettings) => {
    setPartnerSettings(newSettings);
    // 設定変更の通知を表示
    Alert.alert('✅', '相手設定を更新しました！次の返信から反映されます。');
  };

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

  const generateMockResponse = (userMessage: string): string => {
    const fullCharacter = allCharacters.find(char => char.id === characterId);
    
    if (fullCharacter && fullCharacter.type === 'new') {
      // 新キャラクターの応答生成（設定を考慮）
      const modePrefix = partnerSettings.mode === 'coach' ? 'アドバイザーとして' : '会話相手として';
      const toneAdjustment = 
        partnerSettings.tone === 'gentle' ? 'やさしく' :
        partnerSettings.tone === 'bright' ? '元気よく' :
        partnerSettings.tone === 'smart' ? '落ち着いて' :
        partnerSettings.tone === 'tsundere' ? 'すこし強気に' : '淡々と';
      const politeness = partnerSettings.boundaries.polite ? 'ですます調で' : 'フランクに';
      
      if (fullCharacter.role === 'coach') {
        const coachResponses = [
          `${modePrefix}${toneAdjustment}お答えします。「${userMessage}」というメッセージについてですね。\n—ヒント: より${toneAdjustment}表現すると良いでしょう\n—コピペ例: 「より良い表現の例」`,
          `${politeness}、その文面はとても良い要素があります。${toneAdjustment}改善点をお伝えします。\n—ヒント: ${partnerSettings.partnerGender === 'male' ? '男性' : partnerSettings.partnerGender === 'female' ? '女性' : '相手'}の立場で考えてみましょう\n—コピペ例: 実際に使える短い例文`,
          `${fullCharacter.name}から${toneAdjustment}アドバイスさせていただきます。\n—ヒント: ${partnerSettings.tone}な視点で見ると改善点があります\n—コピペ例: より効果的な表現をお試しください`
        ];
        return coachResponses[Math.floor(Math.random() * coachResponses.length)];
      } else if (fullCharacter.role === 'partner') {
        const partnerResponses = [
          `${toneAdjustment}お答えします。「${userMessage}」なんですね！${partnerSettings.boundaries.jokes_ok ? '笑' : ''} ${politeness}、それは素敵ですね。\n—ヒント: 自然な会話の流れで返事してみます\n—コピペ例: 「そうなんですね！」`,
          `${toneAdjustment}お話しします。それ、面白いですね〜！私だったら${partnerSettings.boundaries.polite ? '丁寧に' : 'サクッと'}お答えします。\n—ヒント: ${partnerSettings.partnerGender === 'auto' ? '相手' : partnerSettings.partnerGender === 'male' ? '男性' : partnerSettings.partnerGender === 'female' ? '女性' : 'NB'}の立場で会話してみます\n—コピペ例: 実際の会話で使える返し方`,
          `${fullCharacter.name}です！${toneAdjustment}お話ししましょう♪ 「${userMessage}」について一緒に考えてみましょう。\n—ヒント: ${politeness}、リラックスして自然に話してみてください\n—コピペ例: 気軽に使える返事の例`
        ];
        return partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
      }
    }

    // レガシーキャラクターの応答（既存のまま）
    const responses = {
      analytical: [
        `なるほど、${userMessage}についてですね。まず状況を整理してみましょう。具体的にはどのような点でお困りですか？`,
        `興味深い質問ですね。データを分析的に考えてみると、このような場合は3つのアプローチが考えられます。`,
        `その状況を客観的に分析してみましょう。相手の行動パターンから読み取れることがありそうです。`
      ],
      natural: [
        `${userMessage}のこと、よくわかります！私も似たような経験があります。自然体でいくのが一番だと思いますよ〜`,
        `そうそう、そういうことありますよね！まずはリラックスして、自分らしさを大切にしてみてはいかがでしょう？`,
        `うんうん、その気持ちすごくわかります。あまり構えすぎず、普段通りのあなたでいることが大切だと思います。`
      ],
      creative: [
        `おお！${userMessage}か〜、面白いね！ちょっと斬新なアイデアを考えてみようか！`,
        `それは新しい視点が必要かも！クリエイティブに考えてみると、こんなアプローチはどうかな？`,
        `わくわくする話だね！普通とは違った方法で、印象に残るアプローチを一緒に考えよう！`
      ]
    };

    const legacyResponses = responses[character.id as keyof typeof responses] || responses.analytical;
    return legacyResponses[Math.floor(Math.random() * legacyResponses.length)];
  };

  const handleSendMessage = async () => {
    console.log('🔥 送信ボタンがクリックされました！');
    console.log('📝 入力テキスト:', inputText);
    
    if (!inputText.trim()) {
      console.log('❌ 入力テキストが空です');
      return;
    }

    // Free プランの制限チェック
    if (dailyUsage >= 10) {
      onShowPaywall();
      return;
    }

    console.log('✅ メッセージを送信します');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user', 
      content: inputText.trim(),
      timestamp: new Date()
    };

    console.log('👤 ユーザーメッセージ:', userMessage);
    
    try {
      setMessages(prev => {
        const newMessages = [...prev, userMessage];
        console.log('📜 更新後のメッセージ配列:', newMessages);
        return newMessages;
      });
      
      setInputText('');
      setIsLoading(true);
      setConversationCount(prev => prev + 1);

      // 10ターン毎に広告表示
      if ((conversationCount + 1) % 10 === 0) {
        Alert.alert('広告', '動画広告を表示中...\n（実装時はAdMob動画広告）', [
          { text: 'OK', onPress: () => {}}
        ]);
      }

      // シンプルなモック応答
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `「${userMessage.content}」についてお話ししましょう！それは素敵な話題ですね。`,
          timestamp: new Date()
        };

        console.log('🤖 AIメッセージ:', assistantMessage);
        
        setMessages(prev => {
          const finalMessages = [...prev, assistantMessage];
          console.log('📜 最終メッセージ配列:', finalMessages);
          return finalMessages;
        });
        setIsLoading(false);
        setDailyUsage(prev => prev + 1);
      }, 1500);
      
    } catch (error) {
      console.error('❌ メッセージ送信エラー:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: character.color + '20' }]}>
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
                    : [styles.assistantMessageBubble, { borderColor: character.color }]
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
              <View style={[styles.messageBubble, styles.assistantMessageBubble, { borderColor: character.color }]}>
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
});
