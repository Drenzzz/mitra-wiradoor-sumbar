import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as bcrypt from "bcrypt";
import * as schema from "../src/db/schema";

const VALID_ROLES = ["ADMIN", "STAF"] as const;
type Role = (typeof VALID_ROLES)[number];

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL atau DIRECT_URL harus di-set di environment.");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const name = args[1];
  const password = args[2];
  const role = args[3] as Role;

  if (!email || !password || !name || !role) {
    console.error('Penggunaan: bun run db:adduser <email> "<nama lengkap>" <password> <ROLE>');
    console.error('Contoh: bun run db:adduser test@example.com "Test User" password123 STAF');
    console.error("PENTING: Gunakan tanda kutip untuk nama jika mengandung spasi.");
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`Error: Role tidak valid. Gunakan 'ADMIN' atau 'STAF'.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  console.log(`Menambahkan pengguna baru dengan email: ${email}`);

  try {
    const newUser = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(schema.users)
        .values({ email, name, role })
        .returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role });

      const user = inserted[0];

      // Better Auth stores credentials in the account table, not on the user.
      await tx.insert(schema.accounts).values({
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      });

      return user;
    });

    console.log("Pengguna baru berhasil ditambahkan:", { id: newUser.id, email: newUser.email, role: newUser.role });
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("unique constraint")) {
      console.error(`\nError: Email "${email}" sudah terdaftar di database.`);
    } else {
      console.error("\nTerjadi kesalahan:", e);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
