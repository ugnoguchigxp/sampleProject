import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedComments(count = 50) {
  const firstUser = await prisma.user.findFirst();
  if (!firstUser) {
    console.error('No users found. Please seed users first.');
    process.exit(1);
  }

  const firstPost = await prisma.post.findFirst();
  if (!firstPost) {
    console.error('No posts found. Please seed posts first.');
    process.exit(1);
  }

  const exampleComments = [
    "Great post! Thanks for sharing.",
    "I completely agree with your points.",
    "This was very insightful, thank you!",
    "Could you elaborate more on this topic?",
    "I learned a lot from this post.",
    "This is exactly what I was looking for.",
    "Amazing content, keep it up!",
    "I have a question about one of your points.",
    "This is a game-changer, thank you!",
    "I appreciate the effort you put into this."
  ];

  const comments = Array.from({ length: count }, (_, i) => ({
    content: exampleComments[i % exampleComments.length] + ` (Comment ${i + 1})`,
    postId: firstPost.id, // Use the first post's ID
    authorId: firstUser.id, // Use the first user's ID
  }));

  await prisma.comment.createMany({ data: comments });
  console.log(`${count} comments seeded.`);
}

seedComments().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
