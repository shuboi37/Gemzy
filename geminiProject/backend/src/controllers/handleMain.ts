import type { Request, Response, NextFunction } from "express";
import { handleGemini } from "./gemini.controller";
import { handleGroq } from "./handleGroq";

export const handleMain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const model = req.body.model;

    if (model === "llama-3.3-70b-versatile") {
      handleGroq(req, res);
    } else {
      handleGemini(req, res, next);
    }
  } catch (error: unknown) {
    next(error);
  }
};
