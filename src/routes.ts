import { Router } from "express";
import InvoiceController from "./http/controllers/InvoiceController";

const router = Router();

router.post("/invoice", InvoiceController.createInvoice);

export { router };