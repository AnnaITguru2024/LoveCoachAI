import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';

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

export default function ChatScreen({ characterId, onBack, onShowPaywall }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'こんにちは！ひなたです。楽観的で好奇心旺盛、テンポの良い会話が得意。一緒に会話の練習をしましょう♪',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // テスト用の単純な送信関数
  const handleSendMessage = () => {
    console.log('🔥 送信ボタンがクリックされました！');
    console.log('📝 入力テキスト:', inputText);
    
    if (!inputText.trim()) {
      console.log('❌ 入力テキストが空です');
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
    
    // メッセージを追加
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, userMessage];
      console.log('📜 更新後のメッセージ配列:', newMessages);
      return newMessages;
    });
    
    // 入力をクリア
    setInputText('');
    setIsLoading(true);

    // AIの返答をシミュレート
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `「${userMessage.content}」についてお話ししましょう！それは素敵な話題ですね。`,
        timestamp: new Date()
      };
      
      console.log('🤖 AIメッセージ:', aiMessage);
      
      setMessages(prevMessages => {
        const finalMessages = [...prevMessages, aiMessage];
        console.log('📜 最終メッセージ配列:', finalMessages);
        return finalMessages;
      });
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* シンプルヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        
        <View style={styles.characterInfo}>
          <Text style={styles.characterAvatar}>☀️</Text>
          <View>
            <Text style={styles.characterName}>ひなた</Text>
            <Text style={styles.debugText}>デバッグモード</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* メッセージ表示 */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
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
                <Text style={styles.messageAvatar}>☀️</Text>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                ]}>
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
              <Text style={styles.messageAvatar}>☀️</Text>
              <View style={styles.messageBubble}>
                <Text style={styles.loadingText}>入力中...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 入力エリア - 強化版 */}
        <View style={styles.inputContainer}>
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              入力文字数: {inputText.length} | メッセージ数: {messages.length}
            </Text>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={(text) => {
                console.log('📝 テキスト変更:', text);
                setInputText(text);
              }}
              placeholder="デバッグ: メッセージを入力..."
              multiline={false}
              maxLength={500}
              onSubmitEditing={handleSendMessage}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled
              ]}
              onPress={() => {
                console.log('🖱️ 送信ボタンがタップされました');
                handleSendMessage();
              }}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>送信</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFA50020',
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
  debugText: {
    fontSize: 10,
    color: '#999',
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userMessageBubble: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  assistantMessageBubble: {
    backgroundColor: 'white',
    borderColor: '#FFA500',
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  debugInfo: {
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
