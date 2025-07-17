import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vuexy.com' },
    update: {},
    create: {
      email: 'admin@vuexy.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  })

  console.log('Created admin user:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
