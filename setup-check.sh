node --version  #!/bin/bash

echo "=== LoveCoach AI 開発環境チェック ==="
echo

# Node.js バージョン確認
echo "📱 Node.js バージョン確認..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
    
    # バージョン18以上かチェック
    if [[ "$NODE_VERSION" =~ v([0-9]+) ]] && [[ ${BASH_REMATCH[1]} -ge 18 ]]; then
        echo "   ✅ バージョン18以上 OK"
    else
        echo "   ⚠️  バージョン18以上が推奨です"
        echo "   💡 https://nodejs.org からアップデートしてください"
    fi
else
    echo "❌ Node.js がインストールされていません"
    echo "💡 https://nodejs.org からインストールしてください"
fi

echo

# npm バージョン確認
echo "📦 npm バージョン確認..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: v$NPM_VERSION"
else
    echo "❌ npm がインストールされていません"
fi

echo

# Git確認
echo "📝 Git確認..."
if command -v git &> /dev/null
then
    GIT_VERSION=$(git --version)
    echo "✅ $GIT_VERSION"
else
    echo "❌ Git がインストールされていません"
    echo "💡 https://git-scm.com からインストールしてください"
fi

echo

# Expo CLI確認
echo "🚀 Expo CLI確認..."
if command -v npx expo &> /dev/null
then
    echo "✅ Expo CLI利用可能"
else
    echo "⚠️  Expo CLIが見つかりません（後でインストールします）"
fi

echo
echo "=== 次のステップ ==="
echo "1. 上記で❌の項目があれば先にインストール"
echo "2. 全部✅なら expo create-expo-app を実行"
echo

# iOS/Android開発環境（参考情報）
echo "=== 参考：実機テスト環境 ==="
echo "📱 iOS: App StoreでExpo Goをインストール"
echo "🤖 Android: Google PlayでExpo Goをインストール"
echo
