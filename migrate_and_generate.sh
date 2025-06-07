#!/bin/bash
set -e

npx prisma migrate dev --name init_merge_tables
npx prisma generate
