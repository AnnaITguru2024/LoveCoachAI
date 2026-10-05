# LoveCoach AI - MVP開発

## 🚀 クイックスタート

### 1. 環境チェック
```bash
./setup-check.sh
```

### 2. プロジェクト作成
```bash
npx create-expo-app LoveCoachAI-app --template blank-typescript
cd LoveCoachAI-app
```

### 3. 開発開始
```bash
npx expo start
```

### 4. 実機テスト
- iOS: App StoreでExpo Goインストール → QRコード読み取り
- Android: Google PlayでExpo Goインストール → QRコード読み取り

## 📱 開発フェーズ

- [ ] **Week 1-2**: 年齢ゲート、診断、初回メッセ3案
- [ ] **Week 3-4**: チャット機能、広告統合  
- [ ] **Week 5-6**: 添削機能、プロフィール生成
- [ ] **Week 7-8**: セーフティ、審査対応

## 🔑 必要なAPI Keys

- OpenAI API Key: `sk-...` （取得済み✅）
- Firebase設定: `google-services.json` / `GoogleService-Info.plist`
- AdMob App ID: `ca-app-pub-...`

## 📚 技術スタック

- **フロントエンド**: React Native (Expo)
- **バックエンド**: Node.js + Fastify + MongoDB  
- **AI**: OpenAI GPT-4o-mini
- **広告**: Google AdMob
- **認証**: Firebase Auth
- **分析**: Firebase Analytics

## 🛠 開発ツール

- **エディター**: Cursor（AI補完）
- **デバッグ**: React Native Debugger
- **状態管理**: Zustand
- **API**: RTK Query

## 次のステップ

1. `./setup-check.sh` 実行
2. 環境問題なければプロジェクト作成
3. 最初の画面（年齢ゲート）作成開始
