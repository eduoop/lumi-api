import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInvoices = async (page: number, userId: number) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId },
    skip: 10 * (page - 1),
    take: 10,
    include: {
      electricEnergy: true,
      sceeEnergy: true,
      compensatedEnergy: true,
      municipalPublicLightingContribution: true,
    },
  });

  const totalPages = Math.ceil((await prisma.invoice.count()) / 10);

  return {
    invoices: invoices || [],
    totalPages: totalPages,
  };
};
