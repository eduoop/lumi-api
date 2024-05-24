import { PrismaClient } from "@prisma/client";
import request from "supertest";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const app = express();

interface EnergyConsumptionData {
  totalElectricEnergyKWh: number;
  totalSceeEnergyKWh: number;
  totalCompensatedEnergyKWh: number;
  count: number;
}

interface FinancialData {
  totalElectricEnergyValue: number;
  totalSceeEnergyValue: number;
  totalLightingContributionValue: number;
  totalCompensatedEnergyValue: number;
  count: number;
}

jest.mock("@prisma/client", () => {
  const mockFindMany = jest.fn();
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      invoice: {
        findMany: mockFindMany,
      },
    })),
  };
});

const mockInvoicesConsumption = [
  {
    referenceMonth: "NOV/2023",
    electricEnergy: { quantity: 500, value: 100 },
    sceeEnergy: { quantity: 400, value: 300 },
    compensatedEnergy: { quantity: 600, value: 400 },
  },
  {
    referenceMonth: "NOV/2023",
    electricEnergy: { quantity: 800, value: 200 },
    sceeEnergy: { quantity: 750, value: 500 },
    compensatedEnergy: { quantity: 1013, value: 300 },
  },
];

const getEnergyConsumptionData = async (
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

  const consumptionByMonth: Record<string, EnergyConsumptionData> = {};

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
      const averageEnergyConsumptionKWh = Number(
        (totalEnergyConsumptionKWh / data.count).toFixed(2),
      );
      return {
        referenceMonth: month,
        numberOfInvoices: data.count,
        averageEnergyConsumptionKWh,
        totalCompensatedEnergyKWh: Number(
          data.totalCompensatedEnergyKWh.toFixed(2),
        ),
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

const getEnergyFinancialData = async (year: unknown, clientNumber: unknown) => {
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

  const financialByMonth: Record<string, FinancialData> = {};

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
      return {
        referenceMonth: month,
        numberOfInvoices: data.count,
        averageValueWithoutGD: Number(
          (totalValueWithoutGD / data.count).toFixed(2),
        ),
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

const energyConsumptionData = async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  try {
    const { year, clientNumber } = req.query;
    const data = await getEnergyConsumptionData(year, clientNumber);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const energyFinancialData = async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  try {
    const { year, clientNumber } = req.query;
    const data = await getEnergyFinancialData(year, clientNumber);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

app.get("/energy-consumption-data", energyConsumptionData);
app.get("/energy-consumption-metrics", energyFinancialData);

describe("GET /energy-consumption-data", () => {
  beforeAll(() => {
    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(
      mockInvoicesConsumption,
    );
  });

  it("should return a client's energy consumption data", async () => {
    const res = await request(app).get(
      "/energy-consumption-data?year=2023&clientNumber=7005400387",
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        referenceMonth: "JAN/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "FEV/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "MAR/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "ABR/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "MAI/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "JUN/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "JUL/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "AGO/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "SET/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "OUT/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
      {
        referenceMonth: "NOV/2023",
        numberOfInvoices: 2,
        averageEnergyConsumptionKWh: 1225,
        totalCompensatedEnergyKWh: 1613,
      },
      {
        referenceMonth: "DEZ/2023",
        numberOfInvoices: 0,
        averageEnergyConsumptionKWh: 0,
        totalCompensatedEnergyKWh: 0,
      },
    ]);
  });

  it("must return a customer's financial data", async () => {
    const res = await request(app).get(
      "/energy-consumption-metrics?year=2023&clientNumber=7005400387",
    );

    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual([
      {
        referenceMonth: "JAN/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "FEV/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "MAR/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "ABR/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "MAI/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "JUN/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "JUL/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "AGO/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "SET/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "OUT/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
      {
        referenceMonth: "NOV/2023",
        numberOfInvoices: 2,
        averageValueWithoutGD: 550,
        gdEconomy: 700,
      },
      {
        referenceMonth: "DEZ/2023",
        numberOfInvoices: 0,
        averageValueWithoutGD: 0,
        gdEconomy: 0,
      },
    ]);
  });
});
