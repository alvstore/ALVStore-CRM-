import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { db as userData } from '../src/fake-db/apps/userList';
import { db as invoiceData } from '../src/fake-db/apps/invoice';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.$transaction([
    prisma.invoice.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all(
    userData.slice(0, 10).map(async (user) => {
      return prisma.user.create({
        data: {
          name: user.fullName,
          email: user.email.toLowerCase(),
          role: user.role.toUpperCase(),
          status: user.status || 'active',
          company: user.company,
          contact: user.contact,
          country: user.country,
          currentPlan: user.currentPlan,
          billing: user.billing,
          avatarColor: user.avatarColor,
          password: await hash('password123', 12),
          emailVerified: new Date(),
        },
      });
    })
  );

  console.log(`✅ Created ${users.length} users`);

  // Create invoices
  console.log('🧾 Creating invoices...');
  const invoices = await Promise.all(
    invoiceData.slice(0, 20).map((invoice) => {
      const issuedDate = new Date(invoice.issuedDate);
      const dueDate = new Date(invoice.dueDate || issuedDate);
      dueDate.setDate(issuedDate.getDate() + 10); // Add 10 days to issued date if no due date

      return prisma.invoice.create({
        data: {
          invoiceNumber: invoice.id,
          issuedDate,
          dueDate,
          address: invoice.address,
          company: invoice.company,
          companyEmail: invoice.companyEmail,
          country: invoice.country,
          contact: invoice.contact,
          name: invoice.name,
          service: invoice.service,
          total: invoice.total,
          avatar: invoice.avatar,
          avatarColor: invoice.avatarColor,
          status: invoice.invoiceStatus || 'Pending',
          balance: String(invoice.balance || '0'),
          user: {
            connect: { id: users[Math.floor(Math.random() * users.length)].id }
          }
        },
      });
    })
  );

  console.log(`✅ Created ${invoices.length} invoices`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
