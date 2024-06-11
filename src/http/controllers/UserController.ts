import { Request, Response } from "express";
import { z } from "zod";
import { createUser } from "../services/createUser";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export default {
  create: async (req: Request, res: Response) => {
    const { email, password, name } = createUserSchema.parse(req.body);
    try {
      await createUser({ email, password, name });
      return res.status(201).send();
    } catch (error) {
      console.error(error);
    }
  },
};
