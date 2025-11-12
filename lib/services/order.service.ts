import prisma from "@/lib/prisma";

export const getOrderById = (id: string) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValidObjectId) {
    return null;
  }

  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          productName: true,
          isReadyStock: true,
          quantity: true
        }
      }
    }
  });
};
