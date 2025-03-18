import { Request, Response, NextFunction } from "express";
import * as userController from "../controllers/userController.js";

// authentication middleware used for requests that require a user
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await userController.findUserByToken(token);

  // add user info to request data
  req.user = user;
  next();
};
