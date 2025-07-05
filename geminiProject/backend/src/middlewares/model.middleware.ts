import { ai } from "../utils/geminiClient.js";
import type { Request, Response, NextFunction } from "express";
import express from "express";
const app = express();

app.use(express.json());

export const detectModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { input, model } = req.body;
    let finalModel = model;
    const files = req.files;

    const regex =
      /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
    const matches = input.match(regex);
    // console.log(files);

    if (!files || !matches) {
      const ourPrompt = `Is this prompt related to image generation? Reply in yes or no only.Prompt:${input}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: ourPrompt,
      });
      const verdict = response.text;
      finalModel =
        verdict && verdict.toLowerCase().includes("yes")
          ? "gemini-2.0-flash-exp-image-generation"
          : finalModel === "llama-3.3-70b-versatile"
          ? "llama-3.3-70b-versatile"
          : "gemini-2.0-flash";
    }
    req.model = finalModel;
    // console.log(req.model);

    next();
  } catch (error) {
    next(error);
  }
};
