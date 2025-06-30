import type { Request, Response, NextFunction, Express } from "express";
import dotenv from "dotenv";
import { Part } from "@google/genai";
import path from "path";
import { getGroqChatCompletion } from "../services/groqServices.js";
import { getUrlToUploadService } from "../services/urlToUploadServices.js";
import { getFileUploadService } from "../services/fileUploadService.js";
import { getImageService } from "../services/imageServices.js";
import { getGeminiService } from "../services/geminiSdkService.js";

dotenv.config({ path: path.resolve("src/config/.env") });

export const handleGemini = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body.input;
    const model = req.model!;
    const files: Express.Multer.File[] = Array.isArray(req.files)
      ? req.files
      : [];
    let content: (string | Part)[] = [input];
    let imagesArr: Part[] = [];
    // console.log("hi");

    if (
      model === "gemini-2.0-flash" ||
      model === "gemini-2.0-flash-exp-image-generation"
    ) {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
      const matches = input.match(regex);
      if (matches) {
        content = await getUrlToUploadService({
          input,
          matches,
        });
      }

      if (files.length > 0) {
        // const pdfArr = files.some(
        //   (file) => file.mimetype === "application/pdf"
        // );
        const { contentArr, imagesArray } = await getFileUploadService({
          files,
        });
        if (contentArr.length) content.push(...contentArr);
        if (imagesArray.length) imagesArr.push(...imagesArray);
      }
      const mergedContent = [
        { text: input.trim() },
        ...content.filter((cont) => typeof cont !== "string"),
        ...imagesArr,
      ];
      console.log(model);

      const response = await getGeminiService({ model, mergedContent });
      // console.log("hi");

      if (model === "gemini-2.0-flash-exp-image-generation") {
        const { finalResponse, textWithPic, imageDataSrc } =
          await getImageService(response);
        if (imageDataSrc) {
          res.json({
            response: finalResponse,
            textWithPic,
            imageDataSrc,
            model,
          });
        } else {
          res.json({
            response: finalResponse,
            model,
          });
        }
        return;
      } else {
        const finalResponse = response.text;
        res.json({
          response: finalResponse,
          model,
        });
        return;
      }
    } else {
      try {
        console.log("groq");
        const completion = await getGroqChatCompletion({ input, model });
        console.log(completion);
        const reply = completion.choices?.[0]?.message?.content || "";
        // console.log(reply);

        res.json({ response: reply, model });
        return;
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.json({ message: error.message });
          return;
        } else {
          res.json({ message: "Something went wrong...." });
          return;
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
//todos
// error handling middleware
// try catch above
// image handling
// multiple pdfs handling and if user uploads pdf and give url both
// pdf validation
//
// ui/ux
// tooltip
// streaming response
//
//
//
//
//
//
//
//
//
//
//
//
