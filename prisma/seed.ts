import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
}

async function seedUsers() {
  const data = [];
  const password = await bcrypt.hash('password', await bcrypt.genSalt(10));
  for (let index = 0; index < 100; index++) {
    data.push([faker.internet.email(), faker.name.fullName(), password]);
  }

  const result = await prisma.$executeRaw`
    INSERT INTO users (email, name, password) 
    VALUES ${Prisma.join(data.map((row) => Prisma.sql`(${Prisma.join(row)})`))} 
    ON DUPLICATE KEY UPDATE email = email`;

  console.log(result);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
