import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: { url: 'mongodb://root:example@localhost:27017/updates' },
  },
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'xddd',
  },
  {
    name: 'aha',
  },
  {
    name: 'lmao',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
