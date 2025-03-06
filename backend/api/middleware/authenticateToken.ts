import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserViewModel } from "../models/user/UserViewModel.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "",
  ) as UserViewModel;

  req.user = decoded;
  next();
};
