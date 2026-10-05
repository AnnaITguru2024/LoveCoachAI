import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: '会話の出だし、どれが近い？',
    options: [
      { id: 'A', text: '相手のプロフィールから共通点を探して話しかける' },
      { id: 'B', text: 'とりあえず「こんにちは」から始める' },
      { id: 'C', text: '面白い質問で相手の注意を引く' }
    ]
  },
  {
    id: 2,
    question: '相手のプロフィールを読んだ後に...',
    options: [
      { id: 'A', text: '趣味や興味について詳しく質問する' },
      { id: 'B', text: '自分の似た経験を話す' },
      { id: 'C', text: '相手を褒めることから始める' }
    ]
  },
  {
    id: 3,
    question: 'デート誘いのタイミングは？',
    options: [
      { id: 'A', text: '相手が楽しそうに話している時' },
      { id: 'B', text: '何度かやりとりして親しくなってから' },
      { id: 'C', text: '相手から誘いを待つ' }
    ]
  }
];

interface DiagnosisScreenProps {
  onComplete: (answers: string[], type: string) => void;
  onBack: () => void;
}

export default function DiagnosisScreen({ onComplete, onBack }: DiagnosisScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      Alert.alert('選択してください', '回答を選択してから次に進んでください。');
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    
    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // 最後の質問：診断結果を計算
      const diagnosisType = calculateDiagnosisType([...newAnswers]);
      onComplete(newAnswers, diagnosisType);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
    } else {
      onBack();
    }
  };

  const calculateDiagnosisType = (allAnswers: string[]): string => {
    const aCount = allAnswers.filter(answer => answer === 'A').length;
    const bCount = allAnswers.filter(answer => answer === 'B').length;
    const cCount = allAnswers.filter(answer => answer === 'C').length;

    if (aCount >= 2) return 'analytical';
    if (bCount >= 2) return 'natural';
    if (cCount >= 2) return 'creative';
    
    // 同点の場合はAを優先
    if (aCount === bCount && aCount > cCount) return 'analytical';
    if (bCount === cCount && bCount > aCount) return 'natural';
    return 'balanced';
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>恋愛タイプ診断</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Q{currentQuestion + 1}</Text>
          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedAnswer === option.id && styles.optionButtonSelected
              ]}
              onPress={() => handleAnswerSelect(option.id)}
            >
              <View style={styles.optionRow}>
                <View style={[
                  styles.optionCircle,
                  selectedAnswer === option.id && styles.optionCircleSelected
                ]}>
                  <Text style={[
                    styles.optionId,
                    selectedAnswer === option.id && styles.optionIdSelected
                  ]}>
                    {option.id}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option.id && styles.optionTextSelected
                ]}>
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedAnswer && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === questions.length - 1 ? '診断結果を見る' : '次へ'}
          </Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  optionButtonSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF0F5',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionCircleSelected: {
    backgroundColor: '#FF6B9D',
  },
  optionId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  optionIdSelected: {
    color: 'white',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nextButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
