import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface AnalysisScreenProps {
  onTabChange: (tab: string) => void;
}

interface SkillData {
  opener: number;
  empathy: number;
  deepen: number;
  close: number;
}

interface ResultData {
  readRate: string;
  replyRate: string;
  dateSuccess: string;
}

export default function AnalysisScreenImproved({ onTabChange }: AnalysisScreenProps) {
  // モックデータ - 実際はAPIから取得
  const [currentSkills] = useState<SkillData>({
    opener: 75,
    empathy: 60,
    deepen: 85,
    close: 65
  });

  const [lastWeekSkills] = useState<SkillData>({
    opener: 70,
    empathy: 55,
    deepen: 80,
    close: 60
  });

  const [resultData, setResultData] = useState<ResultData>({
    readRate: '',
    replyRate: '',
    dateSuccess: ''
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'history'>('overview');

  // スキルレーダーチャート（簡易版）
  const renderSkillBar = (skill: string, current: number, previous: number, icon: string) => {
    const improvement = current - previous;
    const maxWidth = 200;
    const currentWidth = (current / 100) * maxWidth;
    
    return (
      <View style={styles.skillRow} key={skill}>
        <View style={styles.skillHeader}>
          <Text style={styles.skillIcon}>{icon}</Text>
          <Text style={styles.skillName}>{skill}</Text>
          <Text style={styles.skillScore}>{current}点</Text>
          {improvement !== 0 && (
            <Text style={[styles.improvement, improvement > 0 ? styles.positive : styles.negative]}>
              {improvement > 0 ? '+' : ''}{improvement}
            </Text>
          )}
        </View>
        <View style={styles.skillBarContainer}>
          <View style={[styles.skillBar, { width: currentWidth }]} />
          <View style={styles.skillBarBackground} />
        </View>
        <View style={styles.skillRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text key={star} style={styles.star}>
              {current >= star * 20 ? '★' : '☆'}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const getWeakestSkill = () => {
    const skills = [
      { name: 'オープナー', value: currentSkills.opener, practice: 'さくらとの初回メッセージ練習' },
      { name: '共感力', value: currentSkills.empathy, practice: 'そうたとの深い会話練習' },
      { name: '深掘り', value: currentSkills.deepen, practice: 'みつるとの質問力トレーニング' },
      { name: 'クロージング', value: currentSkills.close, practice: 'ひなたとのデート誘い練習' }
    ];
    
    return skills.sort((a, b) => a.value - b.value)[0];
  };

  const handleResultSubmit = () => {
    if (!resultData.readRate || !resultData.replyRate) {
      Alert.alert('入力エラー', '既読率と返信率を入力してください');
      return;
    }
    
    Alert.alert(
      '記録完了！',
      'データを保存しました。分析結果に反映されます。',
      [{ text: 'OK', onPress: () => setActiveTab('overview') }]
    );
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* 今週の成績 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 今週のスキル分析</Text>
        <View style={styles.skillsContainer}>
          {renderSkillBar('オープナー', currentSkills.opener, lastWeekSkills.opener, '🚀')}
          {renderSkillBar('共感力', currentSkills.empathy, lastWeekSkills.empathy, '💝')}
          {renderSkillBar('深掘り', currentSkills.deepen, lastWeekSkills.deepen, '🔍')}
          {renderSkillBar('クロージング', currentSkills.close, lastWeekSkills.close, '🎯')}
        </View>
      </View>

      {/* 全体スコア */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 総合スコア</Text>
        <View style={styles.scoreCard}>
          <Text style={styles.totalScore}>
            {Math.round((currentSkills.opener + currentSkills.empathy + currentSkills.deepen + currentSkills.close) / 4)}
          </Text>
          <Text style={styles.scoreLabel}>点</Text>
          <Text style={styles.scoreImprovement}>先週比 +5点 ↗️</Text>
        </View>
      </View>

      {/* 改善提案 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 今週のおすすめ練習</Text>
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionText}>
            {getWeakestSkill().name}の向上のため、{getWeakestSkill().practice}がおすすめです！
          </Text>
          <TouchableOpacity style={styles.practiceButton} onPress={() => onTabChange('home')}>
            <Text style={styles.practiceButtonText}>💬 練習開始</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 実績 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💫 今月の実績</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementNumber}>156</Text>
            <Text style={styles.achievementLabel}>練習回数</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementNumber}>23</Text>
            <Text style={styles.achievementLabel}>添削回数</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementNumber}>8</Text>
            <Text style={styles.achievementLabel}>レベルアップ</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderInput = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 実戦結果を入力</Text>
        <Text style={styles.sectionDescription}>
          マッチングアプリでの実際の結果を入力して、分析精度を向上させましょう
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>既読率 (%)</Text>
          <TextInput
            style={styles.input}
            value={resultData.readRate}
            onChangeText={(text) => setResultData(prev => ({ ...prev, readRate: text }))}
            placeholder="例: 75"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>返信率 (%)</Text>
          <TextInput
            style={styles.input}
            value={resultData.replyRate}
            onChangeText={(text) => setResultData(prev => ({ ...prev, replyRate: text }))}
            placeholder="例: 45"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>デート成功回数</Text>
          <TextInput
            style={styles.input}
            value={resultData.dateSuccess}
            onChangeText={(text) => setResultData(prev => ({ ...prev, dateSuccess: text }))}
            placeholder="例: 3"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleResultSubmit}>
          <Text style={styles.submitButtonText}>📊 結果を記録</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 成長履歴</Text>
        
        <View style={styles.historyCard}>
          <Text style={styles.historyDate}>2024年9月 第3週</Text>
          <View style={styles.historyScores}>
            <Text style={styles.historyScore}>総合: 71点 (+5)</Text>
            <Text style={styles.historyDetail}>既読率: 78% (+8%)</Text>
            <Text style={styles.historyDetail}>返信率: 52% (+12%)</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyDate}>2024年9月 第2週</Text>
          <View style={styles.historyScores}>
            <Text style={styles.historyScore}>総合: 66点 (+3)</Text>
            <Text style={styles.historyDetail}>既読率: 70% (+5%)</Text>
            <Text style={styles.historyDetail}>返信率: 40% (+7%)</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyDate}>2024年9月 第1週</Text>
          <View style={styles.historyScores}>
            <Text style={styles.historyScore}>総合: 63点 (初回)</Text>
            <Text style={styles.historyDetail}>既読率: 65%</Text>
            <Text style={styles.historyDetail}>返信率: 33%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>分析</Text>
      </View>

      {/* サブタブ */}
      <View style={styles.subTabBar}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'overview' && styles.activeSubTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.subTabText, activeTab === 'overview' && styles.activeSubTabText]}>
            概要
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'input' && styles.activeSubTab]}
          onPress={() => setActiveTab('input')}
        >
          <Text style={[styles.subTabText, activeTab === 'input' && styles.activeSubTabText]}>
            結果入力
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'history' && styles.activeSubTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.subTabText, activeTab === 'history' && styles.activeSubTabText]}>
            履歴
          </Text>
        </TouchableOpacity>
      </View>

      {/* タブコンテンツ */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'input' && renderInput()}
      {activeTab === 'history' && renderHistory()}

      {/* フッタータブ */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => onTabChange('home')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>ホーム</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, styles.tabItemActive]}
          onPress={() => onTabChange('analysis')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>分析</Text>
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
    backgroundColor: '#FFF0F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFB6C1',
    borderBottomWidth: 1,
    borderBottomColor: '#FF69B4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B008B',
  },
  
  // サブタブ
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 20,
  },
  subTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeSubTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF1493',
  },
  subTabText: {
    fontSize: 16,
    color: '#8B008B',
  },
  activeSubTabText: {
    fontWeight: 'bold',
    color: '#FF1493',
  },

  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // セクション
  section: {
    marginVertical: 15,
    backgroundColor: '#FFCCCB',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B008B',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8B008B',
    marginBottom: 20,
    lineHeight: 20,
  },

  // スキルバー
  skillsContainer: {
    gap: 15,
  },
  skillRow: {
    marginBottom: 10,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B008B',
    flex: 1,
  },
  skillScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF1493',
    marginRight: 10,
  },
  improvement: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  skillBarContainer: {
    height: 8,
    backgroundColor: '#FFE4E6',
    borderRadius: 4,
    marginBottom: 5,
    position: 'relative',
  },
  skillBar: {
    height: 8,
    backgroundColor: '#FF1493',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  skillBarBackground: {
    height: 8,
    backgroundColor: '#FFE4E6',
    borderRadius: 4,
  },
  skillRating: {
    flexDirection: 'row',
  },
  star: {
    color: '#FF1493',
    fontSize: 16,
    marginRight: 2,
  },

  // スコアカード
  scoreCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  totalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF1493',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#8B008B',
    marginBottom: 10,
  },
  scoreImprovement: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
  },

  // 提案カード
  suggestionCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  suggestionText: {
    fontSize: 16,
    color: '#8B008B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  practiceButton: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  practiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 実績グリッド
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#FFF0F5',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  achievementNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF1493',
  },
  achievementLabel: {
    fontSize: 12,
    color: '#8B008B',
    marginTop: 5,
  },

  // 入力フォーム
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B008B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFB6C1',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFF0F5',
    color: '#8B008B',
  },
  submitButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 履歴
  historyCard: {
    backgroundColor: '#FFF0F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF1493',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B008B',
    marginBottom: 10,
  },
  historyScores: {
    gap: 5,
  },
  historyScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF1493',
  },
  historyDetail: {
    fontSize: 14,
    color: '#8B008B',
  },

  // フッタータブ
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFB6C1',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#FF69B4',
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
    color: '#8B008B',
  },
  tabLabelActive: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
});
