import { PrismaClient } from "@prisma/client";
import parseBuffer from "pdf-parse";
import { extractDataFromPdfText } from "../../utils/getPdfData";

const prisma = new PrismaClient();

export const createInvoice = async ({
  pdfData,
}: {
  pdfData: parseBuffer.Result;
}) => {
  const pdfText = pdfData.text;

  const data = extractDataFromPdfText(pdfText);

  if (data.clientNumber && data.referenceMonth) {
    const newInvoice = await prisma.invoice.create({
      data: {
        referenceMonth: data.referenceMonth,
        clientNumber: data.clientNumber,
      },
    });

    if (data.electricEnergy) {
      const formatValue = data.electricEnergy.value.replaceAll(",", ".");
      const formatQuantity = data.electricEnergy.quantity.replaceAll(",", ".");

      await prisma.electricEnergy.create({
        data: {
          quantity: Number(formatQuantity),
          value: Number(formatValue),
          invoice: {
            connect: { id: newInvoice.id },
          },
        },
      });
    }

    if (data.sceeEnergy) {
      const formatValue = data.sceeEnergy.value.replaceAll(",", ".");
      const formatQuantity = data.sceeEnergy.quantity.replaceAll(",", ".");

      await prisma.sCEEEnergy.create({
        data: {
          quantity: Number(formatQuantity),
          value: Number(formatValue),
          invoice: {
            connect: { id: newInvoice.id },
          },
        },
      });
    }

    if (data.compensatedEnergy) {
      const formatValue = data.compensatedEnergy.value.replaceAll(",", ".");
      const formatQuantity = data.compensatedEnergy.quantity.replaceAll(
        ",",
        ".",
      );

      await prisma.compensatedEnergy.create({
        data: {
          quantity: Number(formatQuantity),
          value: Number(formatValue),
          invoice: {
            connect: { id: newInvoice.id },
          },
        },
      });
    }

    if (data.publicLightingContribution) {
      const formatValue = data.publicLightingContribution.value.replaceAll(
        ",",
        ".",
      );

      await prisma.municipalPublicLightingContribution.create({
        data: {
          value: Number(formatValue),
          invoice: {
            connect: { id: newInvoice.id },
          },
        },
      });
    }
  }
};
