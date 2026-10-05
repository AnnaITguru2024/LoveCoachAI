import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';

interface AgeGateScreenProps {
  onComplete: () => void;
}

export default function AgeGateScreen({ onComplete }: AgeGateScreenProps) {
  const [birthYear, setBirthYear] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // 現在の年から18歳以上かチェック
  const currentYear = new Date().getFullYear();
  const isAdult = birthYear ? (currentYear - parseInt(birthYear)) >= 18 : false;

  // 年のオプション生成（1950年〜現在年まで）
  const yearOptions = [];
  for (let year = currentYear; year >= 1950; year--) {
    yearOptions.push(year);
  }

  const handleYearSelect = (year: string) => {
    setBirthYear(year);
    setShowYearPicker(false);
  };

  const handleContinue = () => {
    if (!birthYear) {
      Alert.alert('エラー', '生年を選択してください。');
      return;
    }
    
    if (!isAdult) {
      Alert.alert(
        '利用制限', 
        'このアプリは18歳以上の方のみご利用いただけます。',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('エラー', '利用規約とプライバシーポリシーに同意してください。');
      return;
    }

    // 次の画面に遷移
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>LoveCoach AI</Text>
          <Text style={styles.subtitle}>恋愛スキル向上アプリ</Text>
        </View>

        {/* 年齢確認 */}
        <View style={styles.ageSection}>
          <Text style={styles.sectionTitle}>年齢確認（18歳以上）</Text>
          <Text style={styles.label}>生まれ年を選択してください：</Text>
          
          <TouchableOpacity 
            style={styles.yearButton}
            onPress={() => setShowYearPicker(!showYearPicker)}
          >
            <Text style={styles.yearButtonText}>
              {birthYear ? `${birthYear}年` : '選択してください'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {showYearPicker && (
            <View style={styles.yearPicker}>
              <ScrollView style={styles.yearScrollView} nestedScrollEnabled={true}>
                {yearOptions.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={styles.yearOption}
                    onPress={() => handleYearSelect(year.toString())}
                  >
                    <Text style={styles.yearOptionText}>{year}年</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {birthYear && !isAdult && (
            <Text style={styles.warningText}>
              ⚠️ 18歳未満の方はご利用いただけません
            </Text>
          )}

          {birthYear && isAdult && (
            <Text style={styles.successText}>
              ✅ 年齢確認完了
            </Text>
          )}
        </View>

        {/* 利用規約同意 */}
        <View style={styles.termsSection}>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              利用規約およびプライバシーポリシーに同意します
            </Text>
          </TouchableOpacity>
        </View>

        {/* 注意事項 */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeTitle}>⚠️ ご利用について</Text>
          <Text style={styles.noticeText}>
            • このアプリは18歳以上の方のみご利用いただけます{'\n'}
            • 出会いの斡旋は行いません{'\n'}
            • 恋愛スキル向上を目的とした学習アプリです
          </Text>
        </View>

        {/* 続行ボタン */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            (!isAdult || !agreedToTerms) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isAdult || !agreedToTerms}
        >
          <Text style={styles.continueButtonText}>
            始める
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  ageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  yearButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  yearButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  yearPicker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    maxHeight: 200,
    marginBottom: 12,
  },
  yearScrollView: {
    maxHeight: 200,
  },
  yearOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  yearOptionText: {
    fontSize: 16,
    color: '#333',
  },
  warningText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsSection: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B9D',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noticeSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
