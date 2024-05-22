import { Request, Response } from "express";
import { getEnergyConsumptionData } from "../services/getEnergyConsumptionData";
import { getFinancialMetrics } from "../services/getFinancialMetrics";

export default {
  energyConsumptionData: async (req: Request, res: Response) => {
    try {
      const { year, clientNumber } = req.query;
      const energyConsumptionData = await getEnergyConsumptionData(
        year,
        clientNumber,
      );

      res.json(energyConsumptionData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  financialMetrics: async (req: Request, res: Response) => {
    try {
      const { year, clientNumber } = req.query;

      const financialData = await getFinancialMetrics(year, clientNumber);

      res.json(financialData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
