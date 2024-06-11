import { Router } from "express";
import InvoiceController from "./http/controllers/InvoiceController";
import EnergyController from "./http/controllers/EnergyController";
import UserController from "./http/controllers/UserController";
import AuthController from "./http/controllers/AuthController";
import { authenticateToken } from "./middlewares/authenticate-jwt";

const router = Router();

router.post("/invoice", authenticateToken, InvoiceController.readInvoice);

router.get(
  "/energy-consumption-metrics",
  authenticateToken,
  EnergyController.energyConsumptionData,
);

router.get(
  "/energy-financial-metrics",
  authenticateToken,
  EnergyController.financialMetrics,
);

router.get("/invoices", authenticateToken, InvoiceController.indexInvoices);

router.post("/users", UserController.create);

router.post("/auth", AuthController.login);

export { router };
