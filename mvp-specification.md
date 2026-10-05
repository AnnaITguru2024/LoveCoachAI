# LoveCoach AI｜MVP仕様書（画面／API／課金設計）

> 目的：**エンタメで導入 → 実用で課金**。Day0の"おもしろさ"とDay7の"上達実感"を同居させる。

---

## 0. スコープ（MVP）

**In**

* 年齢ゲート18+・同意取得（利用規約／プライポリ）
* ゲスト開始（任意でApple/Googleログイン）
* Core：AI会話（3キャラ）、簡易診断、**初回メッセ3案の即出し**
* 実用：**メッセ添削**／**プロフィール文（Lite）生成**（＝ProfileProライト）
* 共有：診断カード（匿名・自動マスク）
* 収益：Free（広告）／**Plus**／**Pro**／**Profileクレジット**／キャラ販売
* 安全：入力/出力モデレーション、NG誘導の自動リライト

**Out（次期）**

* 音声通話モード、コミュニティ機能
* 画像評価の高度化（顔認識スコア等）
* 完全自動のアプリ別最適化（ProfileProフル）

---

## 1. ペルソナ

* **P1 学生・社会人（20–29）**：マッチングアプリ初心者。即使えるテンプレが欲しい。
* **P2 既読/返信率が伸び悩み**：文面添削と"何を直せばいいか"の可視化が欲しい。

---

## 2. 価値設計（Aha体験）

* **Day0（初回90秒）**：3問診断 → タイプ名カード生成 → **初回メッセ3案（コピペ）**
* **Day7**：既読/返信レポート入力 → \*\*弱点スコア（4軸）\*\*と改善行動 → Pro/クレジットへ誘導

**スキル4軸**：オープナー／共感／深掘り／クロージング

---

## 3. 画面仕様（ワイヤー定義）

### 3.1 起動・同意・年齢（必須）

* **Age Gate(18+)**：生年選択＋セルフ宣言、未成年は利用不可ダイアログ
* 規約／プライポリ同意（チェックボックス）

### 3.2 オンボーディング（診断 → Aha）

```
[Q1] 会話の出だし、どれが近い？  (3択)
[Q2] 相手のプロフィールを読んだ後に… (3択)
[Q3] デート誘いのタイミングは？ (3択)
→ タイプ名カード（例：聞き上手スカイ）
→ 「初回メッセ3案を表示」CTA
```

* **共有カード**：タイプ名＋短いTips（ニックネーム自動生成、個人情報マスク）

### 3.3 ホーム

* 今日の提案（通知バナー）／キャラ選択（3体）
* CTA：**会話する**／**メッセ添削**／**プロフィール作成(Lite)**
* フッター：タブ（ホーム／分析／ストア／設定）＋**バナー広告**

### 3.4 会話画面（チャット）

* システム：キャラの口調・目標が上部に表示
* 入力：送信、過去8メッセまでの軽要約で文脈維持
* **10ターンごと**に動画広告（Free）
* **Paywall**：会話上限到達時にPlus/Pro訴求

### 3.5 メッセ添削

* 入力：自分の文面（最大500字）
* 出力：

  * スコア（4軸レーダー）
  * **改善ポイント3つ**
  * リライト案（丁寧／カジュアル／ユーモア）
* **Pro特典**：相手プロフィールの要約を前提に最適化（仮想属性RAG）

### 3.6 プロフィール作成（Lite）

* 入力：職業・趣味・価値観（選択＋自由記述）、写真は任意（評価は次期）
* 出力：**短文/標準/長文**の3パターン、NG表現の修正理由
* Paywall：**Profileクレジット**消費／Proは月2回付与

### 3.7 分析（My成長）

* レーダー（4軸）／週次トレンド
* 既読/返信の自己入力フォーム → 改善アクション提案

### 3.8 ストア

* サブスク（Plus/Pro）比較表
* **Profileクレジット**（1回/3回バンドル）
* キャラパック（単体／3体セット）

### 3.9 設定

* アカウント（ログイン/ログアウト）
* セーフティ（NGトピック、ミュートワード）
* 規約／プライポリ／お問い合わせ

---

## 4. 収益設計

### 4.1 プラン（推奨）

* **Free**：広告あり、会話1日10ターン、添削/月3回、プロフィール作成（プレビューのみ）
* **Plus ¥580/月**：広告なし、会話上限↑（1日30ターン）、添削/月10回
* **Pro ¥1,480/月**：会話上限↑（1日60ターン）、**Profileクレジット2回/月**、高度添削（相手属性考慮）

### 4.2 都度課金

* **Profileクレジット**：1回¥980／3回¥2,200
* **キャラ**：1体¥490／3体セット¥1,100

### 4.3 広告

* バナー：ホーム/会話以外の画面下部
* 動画（インタースティシャル）：**会話10ターン毎**、添削/生成完了後に1回
* 頻度制御：連続表示は60秒以上空ける

---

## 5. KPI & 計測イベント

**Aha到達率**（初回メッセ3案表示）≥60%
**D1/D7 Retention** 45%/35%
**Pro転換（7日）** 3–7%
**モデル原価/DAU** ≤ ¥30

**イベント例**

* app\_open(app\_ver, locale)
* diag\_finish(type, card\_id)
* msg\_generate(type=openers, variant=3)
* chat\_turn(done, plan=free/plus/pro)
* revise\_submit(len)
* revise\_result(score\_open,score\_empathy,score\_deepen,score\_close)
* profile\_generate(len, plan, used\_credit)
* paywall\_view(context)
* subscribe\_start(plan)
* ad\_show(format, placement)

---

## 6. 技術構成

### 6.1 クライアント（React Native）

* State：RTK Query／Zustand
* Ads：AdMob（テストID→本番切替）
* Analytics/Crash：Firebase SDK
* Push：FCM
* ストレージ：Keychain/Keystore（トークン/設定）

### 6.2 サーバ

* **Fastify(Node.js)** + TypeScript（ストリーミング対応）
* DB：MongoDB（ユーザ/会話/購入/クレジット）＋Redis（セッション/レート制限）
* Files：S3（共有カード画像のみ一時保存）
* Queue：BullMQ（重い生成/画像）
* Infra：AWS（ALB/ECS Fargate or Cloud Run相当構成）、CDN：CloudFront

### 6.3 AI/コスト最適化

* LLM：小＝gpt-4o-mini / 中＝gpt-4.1-mini / 大＝gpt-4.1（課金タスクのみ）
* RAG：恋愛Tips/テンプレKB（YAML/MD）をS3＋ベクタDB（pgvector or Pinecone）
* 会話圧縮：要約メモ＋セッション外部化、古い履歴はsemantic検索
* モデレーション：入力/出力両方で自動判定→ブロック/リライト

---

## 7. API設計（抜粋／OpenAPIサマリ）

### 7.1 認証

* `POST /auth/guest` → ゲストトークン発行
* `POST /auth/oauth/callback` → Apple/Googleログイン

### 7.2 診断/カード

* `POST /diag/start` { answers\[] } → { type, tips }
* `POST /share/card` { type, nickname } → { image\_url }（匿名・自動マスク）

### 7.3 会話/添削

* `POST /chat/stream` { character\_id, message, context\_id } → **SSE/WS**
* `POST /revise` { text, target='polite|casual|funny', context? } → { scores, advice\[], rewrites\[] }

### 7.4 プロフィール（Lite）

* `POST /profile/generate` { bio\_inputs, length='short|std|long' } → { texts\[], reasons\[] }
* **消費判定**：Proは月2回まで無料、超過はクレジット消費

### 7.5 課金/権利

* `POST /billing/receipt/ios` / `.../android`（IAP検証）
* `GET /billing/status` → { plan, renew\_at, credits }
* `POST /credits/use` { type='profile' } → { remaining }

### 7.6 モデレーション/セーフティ

* `POST /safety/moderate` { input } → { allow, category, action='block|rewrite|warn' }

### 7.7 管理

* `GET /admin/metrics`（内部）

**共通**

* Auth：Bearer（ゲスト可）
* Headers：`X-App-Version`, `X-Device-Id`
* RateLimit：IP＋Deviceで\*\*/chat 30req/日\*\*, **/revise 20req/日**（Free）

---

## 8. データモデル（Mongo例）

### users

```
{ _id, createdAt, auth: {provider, uid}, plan: 'free|plus|pro', credits: { profile: 2 },
  scores: { open:0..100, empathy:0..100, deepen:0..100, close:0..100 },
  settings: { safe_mode:true, share_mask:true } }
```

### conversations

```
{ _id, userId, characterId, turns:[{role:'u|a', content, t}],
  memo: { summary, last4 }, plan }
```

### purchases

```
{ _id, userId, type:'sub|credit|character', sku, amountJPY, platform:'ios|android',
  receipt, status:'pending|active|expired', renewAt }
```

### credits

```
{ _id, userId, type:'profile', delta:+1/-1, reason, createdAt }
```

### characters

```
{ _id, name, persona, systemPrompt, premium:boolean }
```

---

## 9. セーフティ/法務/審査対策（日本）

* 18+年齢ゲート・未成年利用不可
* **出会いの斡旋はしない**（仲介/紹介機能なし）
* 医療・心理療法の主張は避ける（学習/自己成長アプリ）
* 個人情報（実名・連絡先）は学習/保存に再利用しない（既定OFF）
* 不適切カテゴリ（性的・差別・暴力・嫌がらせ）は**自動遮断**し、代替表現へリライト
* 有名人"そのもの"の再現禁止（**○○風**の比喩も注意）
* ストア提出：プライバシーマニフェスト、データ収集最小化の申告

---

## 10. プロンプト設計（要点）

* **役割分割**：評価→要点抽出→最終案生成（3段）で品質とコスト最適化
* **テンプレ化**：

  * オープナー：`相手のプロフィールの[興味タグ]を拾い、25–60字、ポジティブ、質問1つ`
  * 共感→深掘り：`相手の発言の{要点}に1文で共感→1文で深掘り質問`
  * クロージング：`日時/場所/代替案を含む2択提案`
* **RAG**：NG例集と良い例集を参照（アプリ別）

---

## 11. コスト予算（目安）

* Freeユーザ：日あたり会話10ターン×軽量モデル → **¥5–15/人**
* 添削/生成（中モデル）1回 **¥3–10**
* Proユーザ：月\*\*¥200–350\*\*（原価）を目安に設計
  → モデル切替・キャッシュ・会話圧縮で吸収

---

## 12. テスト/品質

* 単体：APIバリデーション、モデレーションの境界
* 結合：診断→初回メッセ→共有→Paywall
* UX：A/B（Paywall位置、価格、コピー）
* パフォ：p50応答≤2.5s、p95≤6s、SSE途切れ率<1%

---

## 13. リリース計画（8週）

* **W1–2**：ワイヤー→RN雛形、診断/カード、ゲスト認証
* **W3–4**：チャットSSE、添削、Paywall、広告
* **W5–6**：プロフィールLite、クレジット、RAG最小実装
* **W7–8**：セーフティ強化、審査、初期UGC/TikTok施策

---

## 14. ストア文面（ドラフト）

**短文**：

> 90秒で"今夜使える"初回メッセ3案。AIコーチで恋愛スキルを可視化＆改善。

**長文**：

> LoveCoach AIは、AIとの会話と実用テンプレで"恋愛の一歩"を後押しする学習アプリです。診断→タイプカード→初回メッセ3案をすぐに生成。文面添削やプロフィール作成（Lite）で返信率アップを目指せます。18歳未満はご利用いただけません。出会いの斡旋は行いません。

---

## 15. OpenAPI（抜粋）

```yaml
openapi: 3.0.3
info:
  title: LoveCoach API
  version: 0.1.0
paths:
  /auth/guest:
    post:
      responses: { '200': { description: OK } }
  /diag/start:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                answers:
                  type: array
                  items: { type: string }
      responses: { '200': { description: OK } }
  /chat/stream:
    post:
      responses: { '200': { description: SSE Stream } }
  /revise:
    post:
      responses: { '200': { description: OK } }
  /profile/generate:
    post:
      responses: { '200': { description: OK } }
  /billing/receipt/ios:
    post:
      responses: { '200': { description: OK } }
  /safety/moderate:
    post:
      responses: { '200': { description: OK } }
```

---

## 16. 付録：価格テーブル（アプリ内表示用）

| プラン  |   価格/月 | 広告 | 会話/日 | 添削回数/月 | Profile  | その他  |
| ---- | -----: | -- | ---: | -----: | -------- | ---- |
| Free |     ¥0 | あり |   10 |      3 | プレビューのみ  | –    |
| Plus |   ¥580 | なし |   30 |     10 | –        | –    |
| Pro  | ¥1,480 | なし |   60 |     30 | **2回/月** | 高度添削 |

**都度**：Profile 1回¥980／3回¥2,200、キャラ1体¥490／3体¥1,100

---

## 17. リスクと回避

* モデルコスト高騰 → ルーティング/キャッシュ/短文化
* 審査リジェクト → セーフティ文言徹底、年齢ゲート厳格
* 炎上（恋愛/ジェンダー表現） → 包摂的ガイドライン、バイアス検知

---

以上。MVP開発に必要な画面・API・課金・安全要件をコンパクトに集約。これをベースにIssue/チケットへ分解してください。