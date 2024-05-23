import { Request, Response } from "express";
import multer from "multer";
import parseBuffer from "pdf-parse";
import { createInvoice } from "../services/createInvoice";
import { getInvoices } from "../services/getInvoices";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default {
  readInvoice: async (req: Request, res: Response) => {
    upload.single("file")(req, res, async function (err) {
      if (err) {
        return res
          .status(500)
          .send("Erro ao processar o arquivo: " + err.message);
      }

      if (!req.file) {
        return res.status(400).send("Nenhum arquivo foi enviado.");
      }

      try {
        const pdfData = await parseBuffer(req.file.buffer);
        createInvoice({ pdfData });
        res.send("Arquivo PDF recebido e analisado!");
      } catch (error) {
        console.error("Erro ao analisar o PDF:", error);
        return res.status(500).send("Erro ao analisar o PDF: " + error);
      }
    });
  },

  indexInvoices: async (req: Request, res: Response) => {
    const { page } = req.query;
    try {
      const invoices = await getInvoices(Number(page) || 1);
      return res.json(invoices);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
