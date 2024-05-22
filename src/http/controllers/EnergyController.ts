import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const months = [
  "JAN/2023",
  "FEV/2023",
  "MAR/2023",
  "ABR/2023",
  "MAI/2023",
  "JUN/2023",
  "JUL/2023",
  "AGO/2023",
  "SET/2023",
  "OUT/2023",
  "NOV/2023",
  "DEZ/2023",
];

interface ConsumptionByMonth {
  [referenceMonth: string]: {
    totalElectricEnergyKWh: number;
    totalSceeEnergyKWh: number;
    totalCompensatedEnergyKWh: number;
    count: number;
  };
}

interface FinancialMetrics {
  [referenceMonth: string]: {
    totalElectricEnergyValue: number;
    totalSceeEnergyValue: number;
    totalLightingContributionValue: number;
    totalCompensatedEnergyValue: number;
    count: number;
  };
}

export default {
  energyConsumptionData: async (req: Request, res: Response) => {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          electricEnergy: true,
          sceeEnergy: true,
          compensatedEnergy: true,
        },
      });

      const consumptionByMonth: ConsumptionByMonth = {};

      invoices.forEach((invoice) => {
        const {
          referenceMonth,
          electricEnergy,
          sceeEnergy,
          compensatedEnergy,
        } = invoice;

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

      res.json(energyConsumptionData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  financialMetrics: async (req: Request, res: Response) => {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          electricEnergy: true,
          sceeEnergy: true,
          compensatedEnergy: true,
          municipalPublicLightingContribution: true,
        },
      });

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
          financialByMonth[referenceMonth].totalSceeEnergyValue +=
            sceeEnergy.value;
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
            averageValueWithoutGD: Number(
              (totalValueWithoutGD / data.count).toFixed(2),
            ),
            gdEconomy: Number(
              (data.totalCompensatedEnergyValue / data.count).toFixed(2),
            ),
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

      res.json(financialData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
