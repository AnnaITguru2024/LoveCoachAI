import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Clipboard } from 'react-native';

interface MessageGenerationScreenProps {
  diagnosisType: string;
  onBack: () => void;
  onComplete: () => void;
  onRestart: () => void;
}

interface GeneratedMessage {
  id: number;
  style: string;
  message: string;
  explanation: string;
}

const messageTemplates: Record<string, GeneratedMessage[]> = {
  analytical: [
    {
      id: 1,
      style: "丁寧・分析型",
      message: "プロフィールを拝見して、〇〇がお好きなんですね！私も同じ趣味で、特に△△については詳しいのですが、××についてはどう思われますか？",
      explanation: "共通点を見つけて、具体的な質問で相手の興味を引く"
    },
    {
      id: 2,
      style: "質問・探求型",
      message: "〇〇のお写真、とても素敵ですね！そちらにはよく行かれるんですか？私もああいう場所が好きで、おすすめがあれば教えていただきたいです。",
      explanation: "写真から話題を見つけて、相手の経験を聞く"
    },
    {
      id: 3,
      style: "知的・共感型",
      message: "お仕事が〇〇とのことですが、とても興味深いお仕事ですね。私は△△の分野にいるのですが、〇〇の魅力について教えていただけませんか？",
      explanation: "職業から入り、相手を専門家として尊重する姿勢"
    }
  ],
  natural: [
    {
      id: 1,
      style: "自然体・親近感",
      message: "こんにちは！〇〇が趣味なんですね。私も好きで、最近△△に行ってきました。□□さんのお気に入りの場所とかありますか？",
      explanation: "自分の体験をシェアして、自然な質問につなげる"
    },
    {
      id: 2,
      style: "共感・体験共有",
      message: "プロフィール読ませていただきました！〇〇、私も大好きです。同じことが好きな方に出会えて嬉しいです。よろしくお願いします！",
      explanation: "シンプルに共通点への喜びを表現"
    },
    {
      id: 3,
      style: "リラックス・気軽",
      message: "こんにちは！お疲れさまです。〇〇のお写真、いいですね〜。私もああいう雰囲気好きです。今日はお休みですか？",
      explanation: "気軽で親しみやすい雰囲気から会話をスタート"
    }
  ],
  creative: [
    {
      id: 1,
      style: "ユーモア・インパクト",
      message: "〇〇が趣味だなんて、もしかして私たちは運命ですか？😄 冗談です！でも本当に嬉しい偶然です。□□さんの〇〇歴はどのくらいなんですか？",
      explanation: "ユーモアで印象を残してから、真面目な質問につなげる"
    },
    {
      id: 2,
      style: "褒め・ポジティブ",
      message: "わあ、〇〇のセンスが素晴らしいです！特に△△の選び方が私好みで、思わずメッセージを送ってしまいました。どこで見つけられるんですか？",
      explanation: "具体的な褒めポイントで相手の気分を良くする"
    },
    {
      id: 3,
      style: "興味・好奇心",
      message: "〇〇をされてるんですね！実は私、〇〇に憧れがあって... □□さんから見て、〇〇の一番の魅力って何ですか？ぜひ教えてください！",
      explanation: "憧れや興味を示して、相手を先生役にする"
    }
  ],
  balanced: [
    {
      id: 1,
      style: "バランス・オールマイティ",
      message: "こんにちは！〇〇がご趣味なんですね。私も興味があって、□□さんのおすすめがあれば教えていただけませんか？",
      explanation: "シンプルで誠実、幅広い人に好印象を与える"
    },
    {
      id: 2,
      style: "適度な親近感",
      message: "プロフィール拝見しました！〇〇、素敵ですね。私も似たようなことが好きで、親近感を感じました。よろしくお願いします。",
      explanation: "親しみやすさと丁寧さのバランス"
    },
    {
      id: 3,
      style: "柔軟・状況対応",
      message: "お疲れさまです！〇〇のお写真、とても良い雰囲気ですね。そういう場所でリラックスする時間、大切ですよね。私もよく△△に行きます。",
      explanation: "相手の状況や気持ちに寄り添うアプローチ"
    }
  ]
};

export default function MessageGenerationScreen({ diagnosisType, onBack, onComplete, onRestart }: MessageGenerationScreenProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messages = messageTemplates[diagnosisType] || messageTemplates.balanced;

  const handleCopy = async (message: string, id: number) => {
    try {
      await Clipboard.setString(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      Alert.alert('コピー完了', 'メッセージをクリップボードにコピーしました！');
    } catch (error) {
      Alert.alert('エラー', 'コピーに失敗しました。');
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>初回メッセージ3案</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>💌 今夜使える初回メッセージ</Text>
          <Text style={styles.introText}>
            あなたの恋愛タイプに合わせたメッセージを用意しました。
            気に入ったものをコピーして、そのまま使ってください！
          </Text>
        </View>

        {messages.map((item) => (
          <View key={item.id} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text style={styles.styleLabel}>{item.style}</Text>
              <TouchableOpacity 
                style={[styles.copyButton, copiedId === item.id && styles.copyButtonSuccess]}
                onPress={() => handleCopy(item.message, item.id)}
              >
                <Text style={styles.copyButtonText}>
                  {copiedId === item.id ? '✓' : '📋'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
            
            <View style={styles.explanationSection}>
              <Text style={styles.explanationLabel}>💡 ポイント</Text>
              <Text style={styles.explanationText}>{item.explanation}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>📝 使い方のコツ</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• 〇〇の部分を相手のプロフィール情報に置き換える</Text>
            <Text style={styles.tipItem}>• 自分らしい言葉遣いに微調整する</Text>
            <Text style={styles.tipItem}>• 相手の反応を見て、次のメッセージを考える</Text>
            <Text style={styles.tipItem}>• 質問は1つに絞って、相手が答えやすくする</Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>🎉 Aha体験完了！</Text>
          <Text style={styles.ctaText}>
            診断からメッセージ生成まで、90秒で完了しました！
            これがLoveCoach AIの基本的な使い方です。
          </Text>
          
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>
              アプリを使い始める
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.retakeButton} onPress={onRestart}>
            <Text style={styles.retakeButtonText}>
              もう一度診断する
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  styleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  copyButtonText: {
    fontSize: 16,
  },
  messageContent: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  explanationSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  completeButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retakeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
