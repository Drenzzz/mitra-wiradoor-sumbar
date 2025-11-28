import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD || "password123";
  const hashedPassword = await bcrypt.hash(password, 12);
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";

  console.log(`Mencari atau membuat pengguna admin dengan email: ${adminEmail}`);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin User",
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Pengguna admin berhasil disiapkan:", { id: adminUser.id, email: adminUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
