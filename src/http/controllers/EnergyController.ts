import { Request, Response } from "express";
import { getEnergyConsumptionData } from "../services/getEnergyConsumptionData";
import { getFinancialMetrics } from "../services/getFinancialMetrics";

export default {
  energyConsumptionData: async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
      const { year, clientNumber, id } = req.query;

      const energyConsumptionData = await getEnergyConsumptionData(
        year,
        clientNumber,
        userId,
        id,
      );

      res.json(energyConsumptionData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  financialMetrics: async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const userId = req.user.id;

    try {
      const { year, clientNumber, id } = req.query;

      const financialData = await getFinancialMetrics(
        year,
        clientNumber,
        userId,
        id,
      );

      res.json(financialData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
