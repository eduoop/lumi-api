import { Router } from "express";
import InvoiceController from "./http/controllers/InvoiceController";
import EnergyController from "./http/controllers/EnergyController";

const router = Router();

router.post("/invoice", InvoiceController.readInvoice);

router.get(
  "/energy-consumption-metrics",
  EnergyController.energyConsumptionData,
);

router.get("/energy-financial-metrics", EnergyController.financialMetrics);

export { router };
