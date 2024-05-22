import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ConsumptionByMonth {
  [referenceMonth: string]: {
    totalElectricEnergyKWh: number;
    totalSceeEnergyKWh: number;
    totalCompensatedEnergyKWh: number;
    count: number;
  };
}

export const getEnergyConsumptionData = async (year: unknown) => {
  const invoices = await prisma.invoice.findMany({
    include: {
      electricEnergy: true,
      sceeEnergy: true,
      compensatedEnergy: true,
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

  const consumptionByMonth: ConsumptionByMonth = {};

  invoices.forEach((invoice) => {
    const { referenceMonth, electricEnergy, sceeEnergy, compensatedEnergy } =
      invoice;

    if (!consumptionByMonth[referenceMonth]) {
      consumptionByMonth[referenceMonth] = {
        totalElectricEnergyKWh: 0,
        totalSceeEnergyKWh: 0,
        totalCompensatedEnergyKWh: 0,
        count: 0,
      };
    }

    if (electricEnergy) {
      consumptionByMonth[referenceMonth].totalElectricEnergyKWh +=
        electricEnergy.quantity;
    }

    if (sceeEnergy) {
      consumptionByMonth[referenceMonth].totalSceeEnergyKWh +=
        sceeEnergy.quantity;
    }

    if (compensatedEnergy) {
      consumptionByMonth[referenceMonth].totalCompensatedEnergyKWh +=
        compensatedEnergy.quantity;
    }

    consumptionByMonth[referenceMonth].count += 1;
  });

  const energyConsumptionData = months.map((month) => {
    if (consumptionByMonth[month]) {
      const data = consumptionByMonth[month];
      const totalEnergyConsumptionKWh =
        data.totalElectricEnergyKWh + data.totalSceeEnergyKWh;
      const averageEnergyConsumptionKWh =
        totalEnergyConsumptionKWh / data.count;
      return {
        referenceMonth: month,
        numberOfInvoices: data.count,
        averageEnergyConsumptionKWh,
        totalCompensatedEnergyKWh: data.totalCompensatedEnergyKWh,
      };
    } else {
      return {
        referenceMonth: month,
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      };
    }
  });

  return energyConsumptionData;
};
