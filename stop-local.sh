#!/bin/sh
# start-local.sh で起動したサービスを停止するスクリプト

# Postgres・backend（docker-compose）を停止
docker-compose stop postgres backend

# フロントエンドのdevプロセスをkill
pkill -f "pnpm run dev" 2>/dev/null

echo "Postgres・backend(Docker)を停止、フロントエンドもkillしました。"