import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

async function deleteTestUsers() {
  // First NameがTest-で始まるユーザーのみ削除
  const result = await prisma.user.deleteMany({
    where: {
      OR: [
        { username: { startsWith: 'test_' } },
        { email: { startsWith: 'test-' } },
        { email: { startsWith: 'e2e-test' } },
      ]
    }
  });
  console.log(`${result.count} test users deleted.`);
}

deleteTestUsers().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
