import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12); // Ganti dengan password yang kuat
  const adminEmail = 'admin@example.com';

  console.log(`Mencari atau membuat pengguna admin dengan email: ${adminEmail}`);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail }, 
    update: {
      name: 'Admin User',
      role: 'ADMIN',
    },
    create: { 
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Pengguna admin berhasil disiapkan:', { id: adminUser.id, email: adminUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });