import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AgeGateScreen from './AgeGateScreen';
import DiagnosisScreen from './DiagnosisScreen';
import DiagnosisResultScreen from './DiagnosisResultScreen';
import MessageGenerationScreen from './MessageGenerationScreen';
import HomeScreenImproved from './HomeScreenImproved';
import AnalysisScreenImproved from './AnalysisScreenImproved';
import StoreScreen from './StoreScreen';
import SettingsScreen from './SettingsScreen';
import ChatScreenFixed from './ChatScreenFixed';
import MessageReviewScreen from './MessageReviewScreen';
import ProfileCreateScreen from './ProfileCreateScreen';

type AppState = 'ageGate' | 'diagnosis' | 'result' | 'messages' | 'home' | 'analysis' | 'store' | 'settings' | 'chat' | 'messageReview' | 'profileCreate';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('ageGate');
  const [diagnosisAnswers, setDiagnosisAnswers] = useState<string[]>([]);
  const [diagnosisType, setDiagnosisType] = useState<string>('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');

  // 診断フロー関連
  const handleAgeGateComplete = () => {
    setCurrentScreen('diagnosis');
  };

  const handleDiagnosisComplete = (answers: string[], type: string) => {
    setDiagnosisAnswers(answers);
    setDiagnosisType(type);
    setCurrentScreen('result');
  };

  const handleGenerateMessages = () => {
    setCurrentScreen('messages');
  };

  // メインアプリ開始
  const handleComplete = () => {
    setCurrentScreen('home');
    setDiagnosisAnswers([]);
    setDiagnosisType('');
  };

  const handleRestartDiagnosis = () => {
    setCurrentScreen('diagnosis');
    setDiagnosisAnswers([]);
    setDiagnosisType('');
  };

  const handleBackToAgeGate = () => {
    setCurrentScreen('ageGate');
    setDiagnosisAnswers([]);
    setDiagnosisType('');
  };

  const handleBackToDiagnosis = () => {
    setCurrentScreen('diagnosis');
    setDiagnosisAnswers([]);
    setDiagnosisType('');
  };

  const handleBackToResult = () => {
    setCurrentScreen('result');
  };

  // メインアプリ機能関連
  const handleStartChat = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setCurrentScreen('chat');
  };

  const handleMessageReview = () => {
    setCurrentScreen('messageReview');
  };

  const handleProfileCreate = () => {
    setCurrentScreen('profileCreate');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleShowPaywall = () => {
    setCurrentScreen('store');
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'analysis':
        setCurrentScreen('analysis');
        break;
      case 'store':
        setCurrentScreen('store');
        break;
      case 'settings':
        setCurrentScreen('settings');
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'ageGate':
        return <AgeGateScreen onComplete={handleAgeGateComplete} />;
      
      case 'diagnosis':
        return (
          <DiagnosisScreen 
            onComplete={handleDiagnosisComplete}
            onBack={handleBackToAgeGate}
          />
        );
      
      case 'result':
        return (
          <DiagnosisResultScreen 
            answers={diagnosisAnswers}
            type={diagnosisType}
            onGenerateMessages={handleGenerateMessages}
            onBack={handleBackToDiagnosis}
          />
        );
      
      case 'messages':
        return (
          <MessageGenerationScreen 
            diagnosisType={diagnosisType}
            onBack={handleBackToResult}
            onComplete={handleComplete}
            onRestart={handleRestartDiagnosis}
          />
        );
      
      case 'home':
        return (
          <HomeScreenImproved 
            onStartChat={handleStartChat}
            onMessageReview={handleMessageReview}
            onProfileCreate={handleProfileCreate}
            onTabChange={handleTabChange}
          />
        );
      
      case 'analysis':
        return <AnalysisScreenImproved onTabChange={handleTabChange} />;
      
      case 'store':
        return <StoreScreen onTabChange={handleTabChange} />;
      
      case 'settings':
        return <SettingsScreen onTabChange={handleTabChange} />;
      
      case 'chat':
        return (
          <ChatScreenFixed 
            characterId={selectedCharacterId}
            onBack={handleBackToHome}
            onShowPaywall={handleShowPaywall}
          />
        );
      
      case 'messageReview':
        return (
          <MessageReviewScreen 
            onBack={handleBackToHome}
            onShowPaywall={handleShowPaywall}
          />
        );
      
      case 'profileCreate':
        return (
          <ProfileCreateScreen 
            onBack={handleBackToHome}
            onShowPaywall={handleShowPaywall}
          />
        );
      
      default:
        return <AgeGateScreen onComplete={handleAgeGateComplete} />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="auto" />
    </>
  );
}
