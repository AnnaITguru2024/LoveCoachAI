import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { allCharacters } from './NewCharacters';

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

// キャラクター情報を取得（簡略版）
const getCharacterById = (id: string) => {
  const character = allCharacters.find(char => char.id === id);
  
  if (!character) {
    return {
      id: 'analytical',
      name: 'アナ',
      personality: '分析派',
      avatar: '🤓',
      color: '#4A90E2',
      greeting: 'こんにちは！私はアナです。'
    };
  }

  if (character.type === 'new') {
    return {
      id: character.id,
      name: character.name,
      personality: character.personality,
      avatar: character.avatar,
      color: character.color,
      greeting: `こんにちは！私は${character.name}です。`
    };
  }

  return {
    id: character.id,
    name: character.name,
    personality: character.personality,
    avatar: character.avatar,
    color: character.color,
    greeting: 'こんにちは！よろしくお願いします。'
  };
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
  const scrollViewRef = useRef<ScrollView>(null);
  
  const character = getCharacterById(characterId);

  useEffect(() => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: character.greeting,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [character]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    console.log('送信ボタンが押されました:', inputText); // デバッグ用
    
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user', 
      content: inputText.trim(),
      timestamp: new Date()
    };

    console.log('ユーザーメッセージを追加:', userMessage); // デバッグ用
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // シンプルな応答
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `「${userMessage.content}」についてお話ししましょう。`,
        timestamp: new Date()
      };

      console.log('AIメッセージを追加:', assistantMessage); // デバッグ用
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* テスト用ヘッダー */}
      <View style={[styles.header, { backgroundColor: character.color + '20' }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        
        <View style={styles.characterInfo}>
          <Text style={styles.characterAvatar}>{character.avatar}</Text>
          <View>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.testText}>テスト版 - 設定機能準備中</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
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
  testText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
});
