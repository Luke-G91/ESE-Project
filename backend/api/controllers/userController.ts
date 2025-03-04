import { PrismaClient } from "@prisma/client";
import { CreateUserRequest } from "../models/user/CreateUserRequest";
import { User } from "../models/user/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserViewModel } from "../models/user/UserViewModel";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const createUser = async (user: CreateUserRequest) => {
  const newUser: User = await prisma.user.create({
    data: { email: user.email, name: user.name, password: user.password },
  });

  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const user: User | null = await prisma.user.findUnique({ where: { email } });

  return user;
};

export const generateTokenForuser = (user: User) => {
  const userViewModel: UserViewModel = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(userViewModel, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
};

export const findUserByToken = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as UserViewModel;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return null;
  }

  const userViewModel: UserViewModel = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return userViewModel;
};
