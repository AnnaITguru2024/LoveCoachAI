import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface ProfileCreateScreenProps {
  onBack: () => void;
  onShowPaywall: () => void;
}

interface ProfileInputs {
  age: string;
  occupation: string;
  hobbies: string[];
  values: string;
  lifestyle: string;
  lookingFor: string;
}

interface GeneratedProfile {
  short: string;
  standard: string;
  long: string;
  improvements: string[];
}

const hobbyOptions = [
  '映画鑑賞', '読書', '旅行', '料理', '運動・フィットネス', 'アウトドア',
  '音楽鑑賞', 'カフェ巡り', 'ショッピング', 'ゲーム', '写真撮影', 'アート・美術',
  'スポーツ観戦', 'ドライブ', '温泉・スパ', 'ヨガ・瞑想', 'ペット', 'その他'
];

export default function ProfileCreateScreen({ onBack, onShowPaywall }: ProfileCreateScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileInputs, setProfileInputs] = useState<ProfileInputs>({
    age: '',
    occupation: '',
    hobbies: [],
    values: '',
    lifestyle: '',
    lookingFor: ''
  });
  const [generatedProfile, setGeneratedProfile] = useState<GeneratedProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLength, setSelectedLength] = useState<'short' | 'standard' | 'long'>('standard');
  const [credits, setCredits] = useState(0); // Free: 0クレジット、Pro: 2クレジット/月
  const [isPro, setIsPro] = useState(false); // Pro プランかどうか

  const canUseFeature = isPro && credits > 0;

  const handleHobbyToggle = (hobby: string) => {
    setProfileInputs(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const generateMockProfile = (inputs: ProfileInputs): GeneratedProfile => {
    // モック生成ロジック（実装時はOpenAI API）
    const baseText = `${inputs.age}歳、${inputs.occupation}として働いています。`;
    const hobbiesText = inputs.hobbies.length > 0 
      ? `趣味は${inputs.hobbies.slice(0, 3).join('、')}です。`
      : '';
    
    return {
      short: `${baseText}${hobbiesText} よろしくお願いします！`,
      standard: `${baseText}${hobbiesText} ${inputs.values}を大切にしながら、${inputs.lifestyle}な生活を送っています。${inputs.lookingFor}な方との出会いを楽しみにしています。`,
      long: `はじめまして！${baseText}

${hobbiesText}特に週末は${inputs.hobbies[0] || 'リラックス'}をして過ごすことが多いです。

${inputs.values}を大切にしており、${inputs.lifestyle}な毎日を心がけています。お互いを尊重し合いながら、${inputs.lookingFor}な関係を築いていけたらと思います。

プロフィールを読んでいただき、ありがとうございます。お気軽にメッセージをいただけると嬉しいです！`,
      improvements: [
        '具体的なエピソードを追加すると親近感が増します',
        '相手への質問を含めると会話のきっかけになります',
        'ネガティブな表現を避けて前向きな印象を心がけましょう'
      ]
    };
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!canUseFeature) {
      onShowPaywall();
      return;
    }

    setIsGenerating(true);
    
    // モック生成（実装時はOpenAI API）
    setTimeout(() => {
      const result = generateMockProfile(profileInputs);
      setGeneratedProfile(result);
      setCredits(prev => prev - 1);
      setCurrentStep(5);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopyProfile = async (profileText: string) => {
    Alert.alert('コピー完了', 'プロフィールをクリップボードにコピーしました！');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>基本情報</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>年齢</Text>
        <TextInput
          style={styles.textInput}
          value={profileInputs.age}
          onChangeText={(text) => setProfileInputs(prev => ({ ...prev, age: text }))}
          placeholder="例：28"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>職業</Text>
        <TextInput
          style={styles.textInput}
          value={profileInputs.occupation}
          onChangeText={(text) => setProfileInputs(prev => ({ ...prev, occupation: text }))}
          placeholder="例：ITエンジニア、看護師、教師など"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>趣味・興味</Text>
      <Text style={styles.stepDescription}>当てはまるものを選択してください（複数選択可）</Text>
      
      <View style={styles.hobbyGrid}>
        {hobbyOptions.map((hobby) => (
          <TouchableOpacity
            key={hobby}
            style={[
              styles.hobbyOption,
              profileInputs.hobbies.includes(hobby) && styles.hobbyOptionSelected
            ]}
            onPress={() => handleHobbyToggle(hobby)}
          >
            <Text style={[
              styles.hobbyText,
              profileInputs.hobbies.includes(hobby) && styles.hobbyTextSelected
            ]}>
              {hobby}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>価値観・ライフスタイル</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>大切にしている価値観</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={profileInputs.values}
          onChangeText={(text) => setProfileInputs(prev => ({ ...prev, values: text }))}
          placeholder="例：家族との時間、仕事と趣味のバランス、誠実さ など"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ライフスタイル</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={profileInputs.lifestyle}
          onChangeText={(text) => setProfileInputs(prev => ({ ...prev, lifestyle: text }))}
          placeholder="例：アクティブ、のんびり、バランス重視 など"
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>お相手への希望</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>どんな方との出会いを求めていますか？</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={profileInputs.lookingFor}
          onChangeText={(text) => setProfileInputs(prev => ({ ...prev, lookingFor: text }))}
          placeholder="例：一緒に成長できる、笑いを共有できる、価値観の合う など"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>入力内容プレビュー</Text>
        <Text style={styles.previewText}>
          {profileInputs.age}歳・{profileInputs.occupation}
        </Text>
        <Text style={styles.previewText}>
          趣味: {profileInputs.hobbies.slice(0, 3).join('、') || 'なし'}
        </Text>
        <Text style={styles.previewText}>
          価値観: {profileInputs.values || '未入力'}
        </Text>
      </View>

      {!canUseFeature && (
        <View style={styles.creditWarning}>
          <Text style={styles.warningText}>
            プロフィール生成にはProプランまたはクレジットが必要です
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>生成完了！</Text>
      
      {generatedProfile && (
        <>
          <View style={styles.lengthSelector}>
            {(['short', 'standard', 'long'] as const).map((length) => (
              <TouchableOpacity
                key={length}
                style={[
                  styles.lengthOption,
                  selectedLength === length && styles.lengthOptionSelected
                ]}
                onPress={() => setSelectedLength(length)}
              >
                <Text style={[
                  styles.lengthText,
                  selectedLength === length && styles.lengthTextSelected
                ]}>
                  {length === 'short' ? '短文' : length === 'standard' ? '標準' : '長文'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.generatedProfile}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileLengthLabel}>
                {selectedLength === 'short' ? '短文版' : selectedLength === 'standard' ? '標準版' : '長文版'}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyProfile(generatedProfile[selectedLength])}
              >
                <Text style={styles.copyButtonText}>コピー</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.profileText}>
              {generatedProfile[selectedLength]}
            </Text>
          </View>

          <View style={styles.improvementSection}>
            <Text style={styles.improvementTitle}>さらに良くするためのヒント</Text>
            {generatedProfile.improvements.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return profileInputs.age && profileInputs.occupation;
      case 2: return profileInputs.hobbies.length > 0;
      case 3: return profileInputs.values && profileInputs.lifestyle;
      case 4: return profileInputs.lookingFor;
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>プロフィール作成</Text>
        <View style={styles.creditInfo}>
          <Text style={styles.creditText}>
            {isPro ? `クレジット: ${credits}` : 'Pro限定'}
          </Text>
        </View>
      </View>

      {/* プログレスバー */}
      {currentStep < 5 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>
            ステップ {currentStep} / 4
          </Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </ScrollView>

      {/* フッターボタン */}
      <View style={styles.footer}>
        {currentStep > 1 && currentStep < 5 && (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
            <Text style={styles.prevButtonText}>戻る</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled
            ]}
            onPress={handleNextStep}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>次へ</Text>
          </TouchableOpacity>
        )}

        {currentStep === 4 && (
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!canProceed() || isGenerating) && styles.generateButtonDisabled
            ]}
            onPress={handleGenerate}
            disabled={!canProceed() || isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '生成中...' : 'プロフィール生成'}
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === 5 && (
          <TouchableOpacity style={styles.completeButton} onPress={onBack}>
            <Text style={styles.completeButtonText}>完了</Text>
          </TouchableOpacity>
        )}
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
  creditInfo: {
    alignItems: 'flex-end',
  },
  creditText: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
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
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hobbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hobbyOption: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  hobbyOptionSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF0F5',
  },
  hobbyText: {
    fontSize: 14,
    color: '#333',
  },
  hobbyTextSelected: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  previewSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creditWarning: {
    backgroundColor: '#FFE4E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lengthSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  lengthOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  lengthOptionSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF0F5',
  },
  lengthText: {
    fontSize: 14,
    color: '#333',
  },
  lengthTextSelected: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  generatedProfile: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileLengthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
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
  profileText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  improvementSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  prevButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  prevButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#CCC',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
