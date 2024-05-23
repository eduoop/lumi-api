import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInvoices = async (page: number) => {
  const invoices = await prisma.invoice.findMany({
    skip: 10 * (page - 1),
    take: 10,
    include: {
      electricEnergy: true,
      sceeEnergy: true,
      compensatedEnergy: true,
      municipalPublicLightingContribution: true,
    },
  });
  return invoices || [];
};
