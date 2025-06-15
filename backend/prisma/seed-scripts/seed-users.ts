import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers(count = 5) {
  // 既存ユーザーの削除は行わない

  // E2Eテスト用の固定ユーザー
  const e2eUser = {
    id: 'e2e-test-user-id',
    email: 'e2e-test@example.com',
    username: 'test_e2e',
    password: bcrypt.hashSync('Password@123', 10),
  };

  // Test-[number]命名ルールのユーザー
  const users = Array.from({ length: count }, (_, i) => {
    const firstName = `Test-${i + 1}`;
    const username = `test_${i + 1}`;
    return {
      email: `${firstName.toLowerCase()}@example.com`,
      username: username.slice(0, 20),
      password: bcrypt.hashSync('password', 10),
    };
  });

  // 固定ユーザーを先頭に追加
  await prisma.user.createMany({
    data: [e2eUser, ...users],
    skipDuplicates: true // 重複があった場合はスキップする
  });
  console.log(`${count + 1} users seeded (including e2e user).`);
}

seedUsers().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
