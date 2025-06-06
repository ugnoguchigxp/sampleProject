import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

async function seedCategories(count = 5) {
  const exampleCategories = [
    "Technology",
    "Health",
    "Space Exploration",
    "Cooking",
    "History",
    "Programming",
    "Minimalism",
    "Travel",
    "Artificial Intelligence",
    "Meditation"
  ];

  const categories = Array.from({ length: count }, (_, i) => ({
    name: exampleCategories[Math.floor(Math.random() * exampleCategories.length)] + ` ${Date.now()}-${i + 1}`,
  }));

  await prisma.category.createMany({ data: categories });
  console.log(`${count} categories seeded.`);
}

seedCategories().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
