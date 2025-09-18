import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Mencari kategori lama yang tidak memiliki field `deletedAt`...');

  const result = await prisma.category.updateMany({
    where: {
      deletedAt: {
        isSet: false 
      }
    },
    data: {
      deletedAt: null
    }
  });

  console.log(`Selesai! ${result.count} kategori telah diperbarui.`);
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
