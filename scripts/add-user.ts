import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const name = args[1];
  const password = args[2];
  const role = args[3] as Role;

  if (!email || !password || !name || !role) {
    console.error("Penggunaan: pnpm db:adduser <email> \"<nama lengkap>\" <password> <ROLE>");
    console.error("Contoh: pnpm db:adduser test@example.com \"Test User\" password123 STAF");
    console.error("PENTING: Gunakan tanda kutip untuk nama jika mengandung spasi.");
    process.exit(1);
  }

  if (!(role in Role)) {
    console.error(`Error: Role tidak valid. Gunakan 'ADMIN' atau 'STAF'.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  console.log(`Menambahkan pengguna baru dengan email: ${email}`);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });
    console.log('Pengguna baru berhasil ditambahkan:', { id: newUser.id, email: newUser.email, role: newUser.role });
  } catch (e: any) {
    if (e.code === 'P2002') { // Kode error Prisma untuk unique constraint violation
      console.error(`\nError: Email "${email}" sudah terdaftar di database.`);
    } else {
      console.error("\nTerjadi kesalahan:", e);
    }
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
