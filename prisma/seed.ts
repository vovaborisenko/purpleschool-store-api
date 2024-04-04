import { PrismaClient, Role } from '@prisma/client';
import { config } from 'dotenv';
import { User } from '../src/users/user.entity';

const prisma = new PrismaClient();
const { parsed: { SUPER_ADMIN_LOGIN, SUPER_ADMIN_PASSWORD } = {} } = config();

async function main(): Promise<void> {
  if (!SUPER_ADMIN_LOGIN && !SUPER_ADMIN_PASSWORD) {
    throw new Error('Set in .env: SUPER_ADMIN_LOGIN, SUPER_ADMIN_PASSWORD');
  }

  const user = new User(SUPER_ADMIN_LOGIN, 'SuperAdmin', Role.SuperAdmin);

  await user.setPassword(SUPER_ADMIN_PASSWORD);
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_LOGIN },
    update: {},
    create: {
      email: user.email,
      password: user.password,
      role: user.role,
    },
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
