FROM node:24.1-alpine

WORKDIR /app

# pnpmインストール
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# 依存関係をインストール
COPY package.json ./
RUN pnpm install

# アプリケーションのソースコードをコピー
COPY . ./


# ビルドステップ（本番用）
# RUN pnpm run build

# ポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["pnpm", "run", "dev"]