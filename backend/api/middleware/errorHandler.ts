import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log error for debugging
  console.error(err);
  // Send generic error to client
  res.status(500).send("Internal Server Error");
};
