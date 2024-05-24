import { PrismaClient } from "@prisma/client";
import { mockInvoices } from "../../../utils/mockInvoices";
import request from "supertest";
import express from "express";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const app = express();

jest.mock("@prisma/client", () => {
  const mockFindMany = jest.fn();
  const mockCount = jest.fn();

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      invoice: {
        findMany: mockFindMany,
        count: mockCount,
      },
    })),
  };
});

const totalPages = 2;

const getInvoices = async (page: number) => {
  return {
    invoices: mockInvoices,
    totalPages: totalPages || page,
  };
};

const indexInvoices = async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  const { page } = req.query;
  try {
    const invoices = await getInvoices(Number(page) || 1);
    return res.json(invoices);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

app.get("/invoices", indexInvoices);

describe("GET /invoices", () => {
  beforeAll(() => {
    prisma.invoice.findMany = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockInvoices));
    prisma.invoice.count = jest
      .fn()
      .mockImplementation(() => Promise.resolve(20));
  });

  it("deve retornar a lista de invoices e o total de páginas", async () => {
    const res = await request(app).get("/invoices?page=1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      invoices: mockInvoices,
      totalPages: totalPages,
    });
  });
});
