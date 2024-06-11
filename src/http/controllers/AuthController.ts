import { z } from "zod";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { suid } from "rand-token";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const prisma = new PrismaClient();

export default {
  login: async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    try {
      const token = await prisma.token.create({
        data: {
          userId: user.id,
          expiration: new Date(Date.now() + 3600000),
          token: suid(32),
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      console.log(_);

      return res.status(200).json({
        user: userWithoutPassword,
        token: {
          token: token.token,
          type: "Bearer",
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
};
