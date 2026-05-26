# 🍔 Restaurant POS

飲食店向けのPOSシステムです。Next.js + Laravel を使ったSPA開発のポートフォリオとして作成しました。

## 📸 画面一覧

| レジ画面             | 注文確認              | 売上管理             |
| -------------------- | --------------------- | -------------------- |
| 商品選択・カート管理 | 店内/テイクアウト選択 | 日次・週次・月次売上 |

## 🛠️ 使用技術

### フロントエンド

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- axios

### バックエンド

- Laravel 11
- PHP 8.4
- MySQL 8.0

### インフラ

- Docker / Docker Compose
- Nginx

### 開発環境

- GitHub（PRベースの開発フロー）
- phpMyAdmin

## ✨ 機能一覧

### レジ機能

- カテゴリ別商品フィルタリング
- カートへの商品追加・削除・数量変更
- 店内注文（テーブル番号必須）/ テイクアウト（お客様情報入力）
- 支払い方法選択（現金・カード・QRコード）
- 注文確定・完了画面

### 管理者機能

- 商品の追加・編集・削除
- 在庫切れフラグの切り替え
- カテゴリ管理

### 売上管理

- 日次売上確認（日付指定）
- 週次・月次売上サマリー
- 支払い方法別売上内訳

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
└── Models/ # Eloquentリレーション
\`\`\`

## 🚀 環境構築

### 必要なもの

- Docker
- Docker Compose

### セットアップ手順

\`\`\`bash

# リポジトリをクローン

git clone https://github.com/あなたのGitHubユーザー名/restaurant-pos.git
cd restaurant-pos

# Dockerを起動

docker compose up -d --build

# Laravelの設定

cp backend/.env.example backend/.env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
\`\`\`

### アクセスURL

| URL                         | 内容         |
| --------------------------- | ------------ |
| http://localhost:3000       | レジ画面     |
| http://localhost:3000/admin | 商品管理画面 |
| http://localhost:3000/sales | 売上管理画面 |
| http://localhost:8000       | Laravel API  |
| http://localhost:8080       | phpMyAdmin   |

## 📊 DB設計

| テーブル           | 役割                       |
| ------------------ | -------------------------- |
| users              | スタッフアカウント         |
| categories         | 商品カテゴリ               |
| products           | 商品情報                   |
| option_groups      | カスタマイズグループ       |
| option_items       | カスタマイズ選択肢         |
| orders             | 注文                       |
| order_items        | 注文明細                   |
| order_item_options | 注文明細のカスタマイズ内容 |
