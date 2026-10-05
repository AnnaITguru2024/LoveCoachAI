import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';

interface PartnerSettings {
  mode: 'coach' | 'partner';
  partnerGender: 'male' | 'female' | 'nb' | 'auto';
  tone: 'gentle' | 'bright' | 'smart' | 'tsundere' | 'flat';
  boundaries: {
    polite: boolean;
    jokes_ok: boolean;
  };
}

interface PartnerSettingsDrawerProps {
  isVisible: boolean;
  settings: PartnerSettings;
  onSettingsChange: (settings: PartnerSettings) => void;
  onClose: () => void;
}

const PartnerSettingsDrawer: React.FC<PartnerSettingsDrawerProps> = ({
  isVisible,
  settings,
  onSettingsChange,
  onClose
}) => {
  const [currentSettings, setCurrentSettings] = useState<PartnerSettings>(settings);

  const handleSettingChange = (key: keyof PartnerSettings, value: any) => {
    const newSettings = { ...currentSettings, [key]: value };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleBoundaryChange = (key: keyof PartnerSettings['boundaries'], value: boolean) => {
    const newSettings = {
      ...currentSettings,
      boundaries: { ...currentSettings.boundaries, [key]: value }
    };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>相手設定</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* モード選択 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>モード</Text>
              <View style={styles.optionRow}>
                {[
                  { key: 'coach', label: 'コーチ', icon: '🎓', desc: '添削・アドバイス' },
                  { key: 'partner', label: '相手役', icon: '💫', desc: '会話練習' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionCard,
                      styles.largeCard,
                      currentSettings.mode === option.key && styles.optionCardSelected
                    ]}
                    onPress={() => handleSettingChange('mode', option.key)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 相手の性別 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>相手の性別表現</Text>
              <View style={styles.optionGrid}>
                {[
                  { key: 'male', label: '男性', icon: '👨' },
                  { key: 'female', label: '女性', icon: '👩' },
                  { key: 'nb', label: 'NB', icon: '🧑' },
                  { key: 'auto', label: 'おまかせ', icon: '✨' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionCard,
                      styles.smallCard,
                      currentSettings.partnerGender === option.key && styles.optionCardSelected
                    ]}
                    onPress={() => handleSettingChange('partnerGender', option.key)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 雰囲気・口調 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>雰囲気・口調</Text>
              <View style={styles.optionGrid}>
                {[
                  { key: 'gentle', label: 'やさしい', icon: '🌸', desc: '穏やか・思いやり' },
                  { key: 'bright', label: '明るい', icon: '☀️', desc: 'ポジティブ・元気' },
                  { key: 'smart', label: '知的', icon: '📚', desc: '落ち着き・論理的' },
                  { key: 'tsundere', label: 'ツンデレ', icon: '😤', desc: 'すこし強気' },
                  { key: 'flat', label: 'フラット', icon: '😐', desc: '中立・淡々と' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionCard,
                      styles.mediumCard,
                      currentSettings.tone === option.key && styles.optionCardSelected
                    ]}
                    onPress={() => handleSettingChange('tone', option.key)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 境界線設定 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>境界線</Text>
              
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => handleBoundaryChange('polite', !currentSettings.boundaries.polite)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>敬語中心</Text>
                  <Text style={styles.toggleDesc}>丁寧な言葉遣いで話す</Text>
                </View>
                <View style={[
                  styles.toggle,
                  currentSettings.boundaries.polite && styles.toggleActive
                ]}>
                  <View style={[
                    styles.toggleButton,
                    currentSettings.boundaries.polite && styles.toggleButtonActive
                  ]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => handleBoundaryChange('jokes_ok', !currentSettings.boundaries.jokes_ok)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>軽い冗談OK</Text>
                  <Text style={styles.toggleDesc}>ユーモアやジョークを含む</Text>
                </View>
                <View style={[
                  styles.toggle,
                  currentSettings.boundaries.jokes_ok && styles.toggleActive
                ]}>
                  <View style={[
                    styles.toggleButton,
                    currentSettings.boundaries.jokes_ok && styles.toggleButtonActive
                  ]} />
                </View>
              </TouchableOpacity>
            </View>

            {/* 現在の設定プレビュー */}
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>設定プレビュー</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewText}>
                  {currentSettings.mode === 'coach' ? '🎓 コーチモード' : '💫 相手役モード'} •{' '}
                  {currentSettings.partnerGender === 'male' ? '👨 男性' :
                   currentSettings.partnerGender === 'female' ? '👩 女性' :
                   currentSettings.partnerGender === 'nb' ? '🧑 NB' : '✨ おまかせ'} •{' '}
                  {currentSettings.tone === 'gentle' ? '🌸 やさしい' :
                   currentSettings.tone === 'bright' ? '☀️ 明るい' :
                   currentSettings.tone === 'smart' ? '📚 知的' :
                   currentSettings.tone === 'tsundere' ? '😤 ツンデレ' : '😐 フラット'}
                </Text>
                <Text style={styles.previewBoundaries}>
                  {currentSettings.boundaries.polite ? '敬語ON' : '敬語OFF'} • {' '}
                  {currentSettings.boundaries.jokes_ok ? '冗談OK' : '冗談NG'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>設定は次の返信から即座に反映されます</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  largeCard: {
    flex: 1,
    padding: 16,
  },
  mediumCard: {
    width: '48%',
    marginBottom: 8,
  },
  smallCard: {
    width: '22%',
    minWidth: 70,
    marginBottom: 8,
  },
  optionCardSelected: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FF6B9D',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 14,
    color: '#666',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#FF6B9D',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonActive: {
    transform: [{ translateX: 20 }],
  },
  previewSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  previewCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E8F0',
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  previewBoundaries: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  footerNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PartnerSettingsDrawer;
export type { PartnerSettings };
