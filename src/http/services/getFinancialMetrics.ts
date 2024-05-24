import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FinancialMetrics {
  [referenceMonth: string]: {
    totalElectricEnergyValue: number;
    totalSceeEnergyValue: number;
    totalLightingContributionValue: number;
    totalCompensatedEnergyValue: number;
    count: number;
  };
}

export const getFinancialMetrics = async (
  year: unknown,
  clientNumber: unknown,
) => {
  let invoiceFilter = {};

  if (clientNumber) {
    invoiceFilter = {
      OR: [
        { clientNumber: { contains: String(clientNumber) } },
        { clientNumber: { equals: clientNumber } },
      ],
    };
  }

  const invoices = await prisma.invoice.findMany({
    where: invoiceFilter,
    include: {
      electricEnergy: true,
      sceeEnergy: true,
      compensatedEnergy: true,
      municipalPublicLightingContribution: true,
    },
  });

  const months = [
    "JAN/" + year,
    "FEV/" + year,
    "MAR/" + year,
    "ABR/" + year,
    "MAI/" + year,
    "JUN/" + year,
    "JUL/" + year,
    "AGO/" + year,
    "SET/" + year,
    "OUT/" + year,
    "NOV/" + year,
    "DEZ/" + year,
  ];

  const financialByMonth: FinancialMetrics = {};

  invoices.forEach((invoice) => {
    const {
      referenceMonth,
      electricEnergy,
      sceeEnergy,
      compensatedEnergy,
      municipalPublicLightingContribution,
    } = invoice;

    if (!financialByMonth[referenceMonth]) {
      financialByMonth[referenceMonth] = {
        totalElectricEnergyValue: 0,
        totalSceeEnergyValue: 0,
        totalLightingContributionValue: 0,
        totalCompensatedEnergyValue: 0,
        count: 0,
      };
    }

    if (electricEnergy) {
      financialByMonth[referenceMonth].totalElectricEnergyValue +=
        electricEnergy.value;
    }

    if (sceeEnergy) {
      financialByMonth[referenceMonth].totalSceeEnergyValue += sceeEnergy.value;
    }

    if (municipalPublicLightingContribution) {
      financialByMonth[referenceMonth].totalLightingContributionValue +=
        municipalPublicLightingContribution.value;
    }

    if (compensatedEnergy) {
      financialByMonth[referenceMonth].totalCompensatedEnergyValue +=
        compensatedEnergy.value;
    }

    financialByMonth[referenceMonth].count += 1;
  });

  const financialData = months.map((month) => {
    if (financialByMonth[month]) {
      const data = financialByMonth[month];
      const totalValueWithoutGD =
        data.totalElectricEnergyValue +
        data.totalSceeEnergyValue +
        data.totalLightingContributionValue;
      console.log(totalValueWithoutGD, month);
      return {
        referenceMonth: month,
        numberOfInvoices: Number(data.count.toFixed(2)),
        averageValueWithoutGD: Number(totalValueWithoutGD.toFixed(2)),
        gdEconomy: Number(data.totalCompensatedEnergyValue.toFixed(2)),
      };
    } else {
      return {
        referenceMonth: month,
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      };
    }
  });

  return financialData;
};
