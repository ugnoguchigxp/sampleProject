FROM node:24.1-alpine

WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache bash curl openssl

# 依存関係をインストールする前にpnpmをインストール
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# 依存関係をインストール
COPY package.json ./
RUN pnpm install
COPY prisma ./prisma
RUN pnpm prisma generate
COPY . ./

# ビルド
RUN pnpm run build

# マイグレーションを実行するためのスクリプトを作成
RUN echo '#!/bin/sh\n\
until npx prisma migrate deploy; do\n  echo "Migration failed. Retrying in 5 seconds..."\n  sleep 5\ndone\n\
npm run start\n' > /app/start.sh && chmod +x /app/start.sh

# ヘルスチェック用のスクリプトを追加
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# デバッグ用にシェルを起動
# CMD ["sh", "-c", "tail -f /dev/null"]

# アプリケーションを起動
CMD ["/bin/sh", "-c", "/app/start.sh"]

# ポートを公開
EXPOSE 3001