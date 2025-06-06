import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers(count = 5) {
  // 既存のユーザーを削除
  await prisma.user.deleteMany({});
  console.log('Deleted existing users');

  const exampleNames = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
    "Diana Evans",
    "Ethan Foster",
    "Fiona Green",
    "George Harris",
    "Hannah Lee"
  ];

  const users = Array.from({ length: count }, (_, i) => {
    const name = exampleNames[i % exampleNames.length] || `User${i + 1}`;
    // 固定の値を使用して同じユーザー名が生成されるようにする
    const uniqueSuffix = `${i}`;
    const username = `${name.toLowerCase().replace(/\s+/g, '_')}_${uniqueSuffix}`;
    return {
      email: `${name.toLowerCase().replace(/\s+/g, '.')}+${uniqueSuffix}@example.com`,
      username: username.slice(0, 20), // Truncate to 20 characters
      password: bcrypt.hashSync('password', 10),
      // Removed 'name' field as it is not defined in the Prisma schema
    };
  });

  await prisma.user.createMany({ 
    data: users,
    skipDuplicates: true // 重複があった場合はスキップする
  });
  console.log(`${count} users seeded.`);
}

seedUsers().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
