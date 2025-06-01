import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPosts(count = 50) {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.error('No users found. Please seed users first.');
    process.exit(1);
  }

  const firstCategory = await prisma.category.findFirst();
  if (!firstCategory) {
    console.error('No categories found. Please seed categories first.');
    process.exit(1);
  }

  const exampleTitles = [
    "The Future of Technology",
    "10 Tips for a Healthier Lifestyle",
    "Exploring the Wonders of Space",
    "How to Cook the Perfect Steak",
    "The History of Ancient Civilizations",
    "Top 5 Programming Languages in 2025",
    "The Art of Minimalist Living",
    "Travel Guide: Best Places to Visit in Japan",
    "Understanding Artificial Intelligence",
    "The Benefits of Daily Meditation"
  ];

  const exampleContents = [
    "Technology is evolving at an unprecedented pace, shaping the way we live and work.",
    "A healthier lifestyle can be achieved with small, consistent changes in your daily routine.",
    "Space exploration has always been a source of inspiration and wonder for humanity.",
    "Cooking the perfect steak requires attention to detail and the right techniques.",
    "Ancient civilizations have left behind a rich legacy of culture and knowledge.",
    "Programming languages continue to evolve, offering new tools and capabilities for developers.",
    "Minimalist living is about focusing on what truly matters and eliminating excess.",
    "Japan offers a unique blend of tradition and modernity, making it a must-visit destination.",
    "Artificial intelligence is transforming industries and creating new opportunities.",
    "Meditation can improve mental clarity, reduce stress, and enhance overall well-being."
  ];

  const posts = Array.from({ length: count }, (_, i) => {
    const randomUser = users[Math.floor(Math.random() * users.length)] || users[0]; // Fallback to the first user
    if (!randomUser) {
      throw new Error('No user found to assign as author.');
    }
    return {
      title: exampleTitles[i % exampleTitles.length] + ` (${i + 1})`,
      content: exampleContents[i % exampleContents.length] + ` This is post number ${i + 1}.`,
      authorId: randomUser.id, // Use a random user's ID
      categoryId: firstCategory.id, // Use the first category's ID
    };
  });

  await prisma.post.createMany({ data: posts });
  console.log(`${count} posts seeded.`);
}

seedPosts().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
