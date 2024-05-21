import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express from "express";

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default {
  createInvoice: async (req: express.Request, res: express.Response) => {
   
  },
};
