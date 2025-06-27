import { ai } from "../utils/geminiClient.js";
import type { Request, Response, NextFunction } from "express";

export const detectModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { input, model } = req.body as { input: string; model: string };
    let finalModel = model;
    const files = req.files as Express.Multer.File[] | undefined;

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
          : finalModel === "deepseek/deepseek-chat-v3-0324"
          ? "deepseek/deepseek-chat-v3-0324"
          : "gemini-2.0-flash";
    }
    req.model = finalModel;
    // console.log(req.model);

    next();
  } catch (error) {
    next(error);
  }
};
