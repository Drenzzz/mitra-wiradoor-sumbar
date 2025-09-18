import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  console.log('Memulai perbaikan data kategori lama...');

  const oldCategories = await prisma.category.findMany({
    where: {
      createdAt: {
        equals: undefined,
      },
    },
    select: {
      id: true,
    },
  });

  if (oldCategories.length === 0) {
    console.log('Tidak ada kategori lama yang perlu diperbaiki. Semua data sudah konsisten.');
    return;
  }

  console.log(`Menemukan ${oldCategories.length} kategori lama yang akan diperbarui.`);

  const idsToUpdate = oldCategories.map((cat) => cat.id);

  // Lakukan update pada semua ID yang ditemukan
  const result = await prisma.category.updateMany({
    where: {
      id: {
        in: idsToUpdate,
      },
    },
    data: {
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`\nSelesai! ${result.count} kategori telah berhasil diperbaiki.`);
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

