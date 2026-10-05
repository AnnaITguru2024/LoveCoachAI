import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Share } from 'react-native';

interface DiagnosisResultScreenProps {
  answers: string[];
  type: string;
  onGenerateMessages: () => void;
  onBack: () => void;
}

interface DiagnosisResult {
  typeName: string;
  description: string;
  tips: string[];
  strengths: string[];
  weaknesses: string[];
}

const diagnosisResults: Record<string, DiagnosisResult> = {
  analytical: {
    typeName: "分析派スカイ",
    description: "相手をしっかり分析して、計画的にアプローチするタイプ。データを重視し、相手の興味や価値観を理解してから行動します。",
    tips: [
      "相手のプロフィールをよく読んで共通点を見つける",
      "質問を通じて相手の興味を深く探る",
      "論理的で一貫性のある会話を心がける"
    ],
    strengths: ["計画性がある", "相手を理解しようとする", "真剣さが伝わる"],
    weaknesses: ["考えすぎて行動が遅い", "自然さに欠ける場合がある", "完璧を求めすぎる"]
  },
  natural: {
    typeName: "自然体ナチュラル",
    description: "飾らず自然体で接するタイプ。相手との自然な流れを大切にし、リラックスした雰囲気を作るのが得意です。",
    tips: [
      "自分の経験や体験を素直にシェアする",
      "相手のペースに合わせてコミュニケーション",
      "無理をせず、ありのままの自分を大切にする"
    ],
    strengths: ["親しみやすい", "リラックスした雰囲気", "自然な会話ができる"],
    weaknesses: ["積極性に欠ける場合がある", "印象に残りにくい", "決断力が不足しがち"]
  },
  creative: {
    typeName: "クリエイティブ・チャーム",
    description: "ユニークで創造的なアプローチが得意なタイプ。面白い話題や斬新な視点で相手の心を掴むのが上手です。",
    tips: [
      "ユーモアや面白い話題で相手の興味を引く",
      "褒め言葉を効果的に使う",
      "ポジティブで明るい雰囲気を演出する"
    ],
    strengths: ["印象に残りやすい", "会話が楽しい", "ポジティブな印象"],
    weaknesses: ["やりすぎて空回りする", "深い関係構築が苦手", "一貫性に欠ける場合がある"]
  },
  balanced: {
    typeName: "バランス・マスター",
    description: "分析、自然体、創造性をバランスよく使い分けるタイプ。状況に応じて最適なアプローチを選択できます。",
    tips: [
      "相手や状況に応じてアプローチを変える",
      "多様な話題で相手との接点を見つける",
      "柔軟性を活かして相手に合わせる"
    ],
    strengths: ["柔軟性がある", "多様なアプローチ", "適応力が高い"],
    weaknesses: ["特徴が薄い場合がある", "一貫性に欠ける", "どっちつかずになりがち"]
  }
};

export default function DiagnosisResultScreen({ answers, type, onGenerateMessages, onBack }: DiagnosisResultScreenProps) {
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const result = diagnosisResults[type] || diagnosisResults.balanced;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `私の恋愛タイプは「${result.typeName}」でした！\n\nLoveCoach AIで恋愛スキルをチェック：\nhttps://lovecoach-ai.app`,
        title: '恋愛タイプ診断結果'
      });
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleGenerateMessages = () => {
    onGenerateMessages();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>診断結果</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {showShareSuccess && (
        <View style={styles.shareSuccessAlert}>
          <Text style={styles.shareSuccessText}>✅ シェア完了！</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* 診断結果カード */}
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>あなたの恋愛タイプ</Text>
            <View style={styles.typeNameContainer}>
              <Text style={styles.typeName}>{result.typeName}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{result.description}</Text>
        </View>

        {/* 強みセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ あなたの強み</Text>
          <View style={styles.itemList}>
            {result.strengths.map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.itemText}>{strength}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 改善ポイント */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 改善ポイント</Text>
          <View style={styles.itemList}>
            {result.weaknesses.map((weakness, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.itemText}>{weakness}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* おすすめアクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 おすすめアクション</Text>
          <View style={styles.itemList}>
            {result.tips.map((tip, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.itemText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Aha体験のCTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>🚀 今夜使える初回メッセージ</Text>
          <Text style={styles.ctaDescription}>
            あなたの恋愛タイプに合わせた初回メッセージを3パターン生成します。
            コピペで今すぐ使えます！
          </Text>
          
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateMessages}
          >
            <Text style={styles.generateButtonText}>
              💌 初回メッセージ3案を生成
            </Text>
          </TouchableOpacity>
        </View>

        {/* 診断詳細 */}
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>診断結果詳細</Text>
          <View style={styles.answerSummary}>
            {answers.map((answer, index) => (
              <View key={index} style={styles.answerItem}>
                <Text style={styles.answerLabel}>Q{index + 1}:</Text>
                <Text style={styles.answerValue}>{answer}</Text>
              </View>
            ))}
          </View>
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
  shareButton: {
    padding: 8,
  },
  shareButtonText: {
    fontSize: 20,
  },
  shareSuccessAlert: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    alignItems: 'center',
  },
  shareSuccessText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  typeNameContainer: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  typeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemList: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  ctaSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  answerSummary: {
    gap: 8,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    width: 30,
  },
  answerValue: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
