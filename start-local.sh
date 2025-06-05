#!/bin/sh
# Postgresとバックエンドだけdocker-composeで起動し、フロントエンドはローカルで起動するスクリプト

# 既存のフロントエンドのdevプロセスをkill
pkill -f "pnpm run dev" 2>/dev/null

# Postgresとバックエンドのみ起動
docker-compose up -d postgres backend

# フロントエンド（Vite）起動
cd frontend
pnpm install
pnpm run dev &
cd ..

echo "Postgres・バックエンドはDocker、フロントエンドはローカルで起動しました。"
