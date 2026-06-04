# 🍔 Restaurant POS

飲食店向けのPOSシステムです。Next.js + Laravel を使ったSPA開発のポートフォリオとして作成しました。

## 🖥️ 画面一覧

| 画面     | URL      | 説明                                         |
| -------- | -------- | -------------------------------------------- |
| レジ画面 | /        | 商品選択・カート・注文フロー                 |
| キッチン | /kitchen | リアルタイム注文表示・ステータス管理         |
| 注文履歴 | /orders  | 注文一覧・詳細・キャンセル・レシート印刷     |
| 商品管理 | /admin   | 商品追加・編集・削除・在庫管理（管理者のみ） |
| 売上管理 | /sales   | グラフ・日次・週次・月次売上（管理者のみ）   |

## 🛠️ 使用技術

### フロントエンド

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- axios
- Recharts（売上グラフ）

### バックエンド

- Laravel 11
- PHP 8.4
- Laravel Sanctum（認証）
- MySQL 8.0

### インフラ

- Docker / Docker Compose
- Nginx
- phpMyAdmin

## ✨ 機能一覧

### レジ機能

- カテゴリ別商品フィルタリング
- カスタマイズ選択（ピクルス抜き・ソース変更・トッピング追加など）
- カートへの商品追加・削除・数量変更
- 店内注文（テーブル番号必須）/ テイクアウト（お客様情報入力）
- 支払い方法選択（現金・カード・QRコード）
- 注文完了後にレシートプレビュー・印刷

### キッチンディスプレイ

- 5秒ごとのポーリングでリアルタイム自動更新
- 受付中・調理中の2カラム表示
- 調理開始・提供完了ボタンでステータス管理
- 経過時間のカウントアップ（10分超で警告表示）
- 本日の何番目の注文かを表示

### 注文履歴

- 全注文の一覧表示
- 注文詳細・キャンセル機能（理由入力）
- レシートプレビュー・印刷

### 管理者機能（管理者のみ）

- 商品の追加・編集・削除
- 在庫切れフラグの切り替え
- カスタマイズオプションのSeeder管理

### 売上管理（管理者のみ）

- 日別売上グラフ（← →で週を切り替え）
- 週別売上グラフ（← →で月を切り替え）
- 日次売上・支払い方法別内訳
- 今週・今月のサマリー

### 認証

- Laravel Sanctumによるトークン認証
- 管理者・店員のロール管理
- 未認証時のリダイレクト
- 店員は管理者画面・売上画面にアクセス不可

## 🏗️ 設計のこだわり

### フロントエンド（責務分離）

\`\`\`
src/
├── app/ # ルーティングのみ（page.tsxは薄く保つ）
├── features/ # 機能単位で分割
│ ├── register/ # レジ機能
│ │ ├── components/ # UIコンポーネント
│ │ ├── hooks/ # ロジック
│ │ └── types/ # 型定義
│ ├── kitchen/ # キッチンディスプレイ
│ ├── orders/ # 注文履歴
│ ├── admin/ # 管理者機能
│ └── sales/ # 売上管理
├── shared/ # 共通コンポーネント
├── lib/ # API通信層
└── types/ # 全体の型定義
\`\`\`

### バックエンド（責務分離）

\`\`\`
app/
├── Http/
│ ├── Controllers/ # 振り分けのみ・薄く保つ
│ ├── Requests/ # FormRequestでバリデーション
│ └── Resources/
├── Services/ # ビジネスロジック集約
│ ├── AuthService
│ ├── CategoryService
│ ├── ProductService
│ └── OrderService（トランザクション・売上集計）
└── Models/ # Eloquentリレーション
\`\`\`

## 🚀 環境構築

### 必要なもの

- Docker
- Docker Compose

### セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/Arii-sa/restaurant-pos.git
cd restaurant-pos

# Dockerを起動
docker compose up -d --build

# Laravelの設定
cp backend/.env.example backend/.env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
```

### アクセスURL

| URL                   | 内容           |
| --------------------- | -------------- |
| http://localhost:3000 | フロントエンド |
| http://localhost:8000 | Laravel API    |
| http://localhost:8080 | phpMyAdmin     |

### テスト用アカウント

| ロール | メール               | パスワード |
| ------ | -------------------- | ---------- |
| 管理者 | admin@restaurant.com | password   |
| 店員   | staff@restaurant.com | password   |

## 📊 DB設計

| テーブル           | 役割                                           |
| ------------------ | ---------------------------------------------- |
| users              | スタッフアカウント（role: admin/staff）        |
| categories         | 商品カテゴリ                                   |
| products           | 商品情報                                       |
| option_groups      | カスタマイズグループ（single/multi）           |
| option_items       | カスタマイズ選択肢                             |
| orders             | 注文（dine_in/takeout・ステータス管理）        |
| order_items        | 注文明細                                       |
| order_item_options | 注文明細のカスタマイズ（価格スナップショット） |

## 📝 開発フロー

- GitHubのPRベースで開発
- PRには実装内容・動作確認を記載
- featureブランチ → mainへのマージ
