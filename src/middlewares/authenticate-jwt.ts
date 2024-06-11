import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export async function authenticateToken(
  request: Request,
  response: Response,
  next: express.NextFunction,
) {
  const jwt = request.headers.authorization?.split(" ")[1];
  if (!jwt) {
    response.status(401).json({ message: "Usuário nao autorizado" });
    return;
  }

  const token = await prisma.token.findFirst({
    where: {
      token: jwt,
    },
  });

  if (!token) {
    response.status(401).json({ message: "Usuário nao autorizado" });
    return;
  }

  request.user = {
    id: token.userId,
    token: token.token,
  };
  next();
}
