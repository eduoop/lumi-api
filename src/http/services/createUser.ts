import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateUser } from "../controllers/UserController";

const prisma = new PrismaClient();

export const createUser = async ({ name, email, password }: CreateUser) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });
  return user;
};
