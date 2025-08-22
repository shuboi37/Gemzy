import type { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export const handleError = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error occured:", err);
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ message });
  return;
};
