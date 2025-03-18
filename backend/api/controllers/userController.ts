import { PrismaClient } from "@prisma/client";
import { CreateUserRequest } from "../models/user/CreateUserRequest.js";
import { User } from "../models/user/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserViewModel } from "../models/user/UserViewModel.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required but not set");
}

export const createUser = async (
  user: CreateUserRequest,
): Promise<UserViewModel> => {
  const newUser: User = await prisma.user.create({
    data: { email: user.email, name: user.name, password: user.password },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
};

export const findUserByEmail = async (email: string) => {
  const user: User | null = await prisma.user.findUnique({ where: { email } });

  return user;
};

export const generateTokenForUser = (user: User) => {
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

export const findUserById = async (id: number) => {
  const user: User | null = await prisma.user.findUnique({ where: { id } });

  return user;
};

export const validateCreateUserRequest = (newUser: CreateUserRequest) => {
  const errors: string[] = [];

  const passwordProvided =
    newUser.password && newUser.password.trim().length > 0;
  if (!passwordProvided) {
    errors.push("Password is required");
    return errors;
  }

  const passwordTooShort = newUser.password.length < 8;
  if (passwordTooShort) {
    errors.push("Password must be at least 8 characters");
  }

  const hasLowerCase = /[a-z]/.test(newUser.password);
  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }

  const hasUpperCase = /[A-Z]/.test(newUser.password);
  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }

  const hasNumber = /\d/.test(newUser.password);
  if (!hasNumber) {
    errors.push("Password must contain at least one number");
  }

  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newUser.password);
  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  const nameProvided = newUser.name && newUser.name.trim().length > 0;
  if (!nameProvided) {
    errors.push("Name is required");
  }

  const emailIsValid = newUser.email && /^\S+@\S+\.\S+$/.test(newUser.email);
  if (!emailIsValid) {
    errors.push("Invalid email address");
  }

  return errors;
};
