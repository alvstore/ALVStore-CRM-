import { PrismaClient } from '@prisma/client';
import pkg from 'bcryptjs';
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting admin user seeding...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vuexy.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@vuexy.com',
      password: await hash('admin', 12),
      role: 'ADMIN',
      status: 'active',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin);
  console.log('🔑 Credentials:');
  console.log('   Email: admin@vuexy.com');
  console.log('   Password: admin');
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
