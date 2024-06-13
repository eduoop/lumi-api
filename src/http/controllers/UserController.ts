import { Request, Response } from "express";
import { z } from "zod";
import { createUser } from "../services/createUser";
import { PrismaClient } from "@prisma/client";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type CreateUser = z.infer<typeof createUserSchema>;

const prisma = new PrismaClient();

export default {
  create: async (req: Request, res: Response) => {
    const { email, password, name } = createUserSchema.parse(req.body);
    const existsUserEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existsUserEmail) {
      return res.status(400).send("E-mail already exists");
    }

    try {
      await createUser({ email, password, name });
      return res.status(201).send();
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },
};
