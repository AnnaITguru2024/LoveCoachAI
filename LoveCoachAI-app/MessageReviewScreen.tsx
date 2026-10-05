import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface MessageReviewScreenProps {
  onBack: () => void;
  onShowPaywall: () => void;
}

interface ReviewResult {
  scores: {
    opener: number;
    empathy: number;
    deepen: number;
    close: number;
  };
  improvements: string[];
  rewrites: {
    style: string;
    message: string;
    explanation: string;
  }[];
}

export default function MessageReviewScreen({ onBack, onShowPaywall }: MessageReviewScreenProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(1); // Free: 3回/月の使用済み回数
  const [selectedRewrite, setSelectedRewrite] = useState<number | null>(null);

  const remainingUses = Math.max(0, 3 - dailyUsage); // Free プランの月次制限

  const generateMockReview = (message: string): ReviewResult => {
    // シンプルな分析ロジック（実装時はOpenAI API）
    const messageLength = message.length;
    const hasQuestion = message.includes('？') || message.includes('?');
    const hasEmoji = /[\u{1F600}-\u{1F6FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(message);
    const isPolite = message.includes('です') || message.includes('ます') || message.includes('ください');

    return {
      scores: {
        opener: hasQuestion ? 85 : 65,
        empathy: isPolite ? 80 : 60,
        deepen: messageLength > 50 ? 75 : 50,
        close: hasQuestion ? 90 : 40
      },
      improvements: [
        !hasQuestion ? '相手が答えやすい質問を1つ含めましょう' : '',
        messageLength < 30 ? 'もう少し具体的な内容を追加してみましょう' : '',
        !hasEmoji ? '適度な絵文字で親しみやすさをプラス' : ''
      ].filter(Boolean),
      rewrites: [
        {
          style: '丁寧版',
          message: `${message.replace(/。$/, '')}ね。○○さんはいかがですか？`,
          explanation: '敬語を使用し、相手への配慮を示した表現'
        },
        {
          style: 'カジュアル版', 
          message: `${message.replace(/です|ます/g, '')}！どう思う？`,
          explanation: '親しみやすく、距離感を縮める表現'
        },
        {
          style: 'ユーモア版',
          message: `${message} 😊 ちなみに私はこういうの得意じゃないので、アドバイスください！`,
          explanation: 'ユーモアを加えて印象に残りやすくした表現'
        }
      ]
    };
  };

  const handleAnalyze = async () => {
    if (!inputMessage.trim()) {
      Alert.alert('エラー', 'メッセージを入力してください。');
      return;
    }

    if (dailyUsage >= 3) {
      onShowPaywall();
      return;
    }

    setIsAnalyzing(true);
    
    // モック分析（実装時はOpenAI API）
    setTimeout(() => {
      const result = generateMockReview(inputMessage);
      setReviewResult(result);
      setIsAnalyzing(false);
      setDailyUsage(prev => prev + 1);
    }, 2000);
  };

  const handleCopyRewrite = async (rewrite: string) => {
    // クリップボードコピー機能は省略（実装時はClipboard.setString）
    Alert.alert('コピー完了', 'リライト版をクリップボードにコピーしました！');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '良い';
    if (score >= 60) return '普通';
    return '要改善';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>メッセージ添削</Text>
        <View style={styles.usageInfo}>
          <Text style={styles.usageText}>残り{remainingUses}回</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 入力エリア */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>添削したいメッセージ</Text>
          <TextInput
            style={styles.messageInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="例：こんにちは！プロフィール見させていただきました。"
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {inputMessage.length}/500文字
          </Text>

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (!inputMessage.trim() || isAnalyzing || dailyUsage >= 3) && styles.analyzeButtonDisabled
            ]}
            onPress={handleAnalyze}
            disabled={!inputMessage.trim() || isAnalyzing || dailyUsage >= 3}
          >
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? '分析中...' : '添削開始'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 分析結果 */}
        {reviewResult && (
          <>
            {/* スコア表示 */}
            <View style={styles.scoresSection}>
              <Text style={styles.sectionTitle}>スコア分析（4軸評価）</Text>
              
              <View style={styles.scoreGrid}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>オープナー</Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreProgress, 
                        { 
                          width: `${reviewResult.scores.opener}%`,
                          backgroundColor: getScoreColor(reviewResult.scores.opener)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.scoreValue, { color: getScoreColor(reviewResult.scores.opener) }]}>
                    {reviewResult.scores.opener}点 ({getScoreLabel(reviewResult.scores.opener)})
                  </Text>
                </View>

                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>共感力</Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreProgress, 
                        { 
                          width: `${reviewResult.scores.empathy}%`,
                          backgroundColor: getScoreColor(reviewResult.scores.empathy)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.scoreValue, { color: getScoreColor(reviewResult.scores.empathy) }]}>
                    {reviewResult.scores.empathy}点 ({getScoreLabel(reviewResult.scores.empathy)})
                  </Text>
                </View>

                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>深掘り力</Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreProgress, 
                        { 
                          width: `${reviewResult.scores.deepen}%`,
                          backgroundColor: getScoreColor(reviewResult.scores.deepen)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.scoreValue, { color: getScoreColor(reviewResult.scores.deepen) }]}>
                    {reviewResult.scores.deepen}点 ({getScoreLabel(reviewResult.scores.deepen)})
                  </Text>
                </View>

                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>クロージング</Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreProgress, 
                        { 
                          width: `${reviewResult.scores.close}%`,
                          backgroundColor: getScoreColor(reviewResult.scores.close)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.scoreValue, { color: getScoreColor(reviewResult.scores.close) }]}>
                    {reviewResult.scores.close}点 ({getScoreLabel(reviewResult.scores.close)})
                  </Text>
                </View>
              </View>
            </View>

            {/* 改善ポイント */}
            <View style={styles.improvementsSection}>
              <Text style={styles.sectionTitle}>改善ポイント</Text>
              <View style={styles.improvementsList}>
                {reviewResult.improvements.map((improvement, index) => (
                  <View key={index} style={styles.improvementItem}>
                    <Text style={styles.improvementBullet}>•</Text>
                    <Text style={styles.improvementText}>{improvement}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* リライト案 */}
            <View style={styles.rewritesSection}>
              <Text style={styles.sectionTitle}>リライト提案</Text>
              
              {reviewResult.rewrites.map((rewrite, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.rewriteCard,
                    selectedRewrite === index && styles.rewriteCardSelected
                  ]}
                  onPress={() => setSelectedRewrite(selectedRewrite === index ? null : index)}
                >
                  <View style={styles.rewriteHeader}>
                    <Text style={styles.rewriteStyle}>{rewrite.style}</Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleCopyRewrite(rewrite.message)}
                    >
                      <Text style={styles.copyButtonText}>コピー</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.rewriteMessage}>{rewrite.message}</Text>
                  
                  {selectedRewrite === index && (
                    <View style={styles.rewriteExplanation}>
                      <Text style={styles.explanationLabel}>ポイント:</Text>
                      <Text style={styles.explanationText}>{rewrite.explanation}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* 利用制限バナー */}
        {dailyUsage >= 3 && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>月間利用上限に達しました</Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={onShowPaywall}>
              <Text style={styles.upgradeButtonText}>Plus/Proにアップグレード</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
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
    backgroundColor: 'white',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  usageInfo: {
    alignItems: 'flex-end',
  },
  usageText: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#CCC',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoresSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scoreGrid: {
    gap: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    width: 100,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
  },
  improvementsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  improvementsList: {
    gap: 12,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  improvementBullet: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  improvementText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  rewritesSection: {
    marginBottom: 20,
  },
  rewriteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rewriteCardSelected: {
    borderColor: '#FF6B9D',
  },
  rewriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewriteStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  copyButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewriteMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  rewriteExplanation: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
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
  limitBanner: {
    backgroundColor: '#FFE4E1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  limitText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});
