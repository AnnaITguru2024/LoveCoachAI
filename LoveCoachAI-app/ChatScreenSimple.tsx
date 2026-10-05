import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

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
      content: 'こんにちは！さくらです。思いやり深く、相手の良い点を見つけて優しくアドバイス。どんなメッセージの相談をしましょうか？',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    console.log('🚀 SEND BUTTON CLICKED');
    console.log('📝 INPUT:', inputText);
    
    if (!inputText.trim()) {
      console.log('❌ EMPTY INPUT');
      return;
    }

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    console.log('👤 USER MESSAGE:', userMessage);

    // メッセージを即座に追加
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, userMessage];
      console.log('📜 NEW MESSAGES ARRAY:', newMessages);
      return newMessages;
    });

    setInputText('');

    // AIの返答を1秒後に追加
    setTimeout(() => {
      const aiMessage: Message = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: `「${userMessage.content}」について一緒に考えましょう！`,
        timestamp: new Date()
      };

      console.log('🤖 AI MESSAGE:', aiMessage);
      
      setMessages(prevMessages => {
        const finalMessages = [...prevMessages, aiMessage];
        console.log('📜 FINAL MESSAGES:', finalMessages);
        return finalMessages;
      });
    }, 1000);
  };

  useEffect(() => {
    console.log('🔄 MESSAGES UPDATED:', messages);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        
        <View style={styles.characterInfo}>
          <Text style={styles.characterAvatar}>🌸</Text>
          <Text style={styles.characterName}>さくら（修正版）</Text>
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
          <Text style={styles.debugText}>メッセージ数: {messages.length}</Text>
          
          {messages.map((message, index) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer
              ]}
            >
              {message.role === 'assistant' && (
                <Text style={styles.messageAvatar}>🌸</Text>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble
                ]}
              >
                <Text style={styles.debugText}>#{index + 1} - {message.role}</Text>
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
        </ScrollView>

        {/* 入力エリア */}
        <View style={styles.inputContainer}>
          <Text style={styles.debugText}>入力: "{inputText}" (長さ: {inputText.length})</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={(text) => {
                console.log('📝 TEXT CHANGED:', text);
                setInputText(text);
              }}
              placeholder="テスト用メッセージ入力..."
              multiline={false}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled
              ]}
              onPress={() => {
                console.log('🖱️ BUTTON PRESSED');
                handleSendMessage();
              }}
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
  debugText: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#F0F0F0',
    padding: 2,
    marginBottom: 4,
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
    backgroundColor: '#FAFAFA',
    padding: 8,
    borderRadius: 8,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    backgroundColor: '#E8F4FD',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF0F5',
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
    borderWidth: 2,
  },
  userMessageBubble: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  assistantMessageBubble: {
    backgroundColor: 'white',
    borderColor: '#FFB6C1',
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
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
