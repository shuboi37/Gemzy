import type { Request, Response, NextFunction, Express } from "express";
import dotenv from "dotenv";
import {
  ai,
  createPartFromUri,
  createUserContent,
} from "../utils/geminiClient.js";
import axios from "axios";
import { Part } from "@google/genai";
import path from "path";

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
    const imagesArr = [];
    // console.log("hi");

    if (
      model === "gemini-2.0-flash" ||
      model === "gemini-2.0-flash-exp-image-generation"
    ) {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
      const matches = input.match(regex);
      if (matches) {
        const urls = matches.map((url: string) =>
          url.startsWith("http") ? url : "https://" + url
        );
        let cleanedPrompt = input;
        for (const url of urls) {
          cleanedPrompt = cleanedPrompt.replace(url, "").trim();
        }

        content = [cleanedPrompt];

        for (const url of urls) {
          const displayName =
            url.split("/").pop()?.split("?")[0].split("#")[0] ?? "file.pdf";
          const pdfBuffer = await fetch(url).then((response) =>
            response.arrayBuffer()
          );

          const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

          const file = await ai.files.upload({
            file: fileBlob,
            config: { displayName },
          });

          // Wait for the file to be processed.
          if (!file.name) {
            throw new Error("File name is missing!");
          }
          let getFile = await ai.files.get({ name: file.name });

          while (getFile.state === "PROCESSING") {
            getFile = await ai.files.get({ name: file.name });
            console.log(`current file status: ${getFile.state}`);
            console.log("File is still processing, retrying in 5 seconds");

            await new Promise((resolve) => {
              setTimeout(resolve, 5000);
            });
          }
          if (file.state === "FAILED") {
            throw new Error("File processing failed.");
          }

          if (file.uri && file.mimeType) {
            const fileContent = createPartFromUri(file.uri, file.mimeType);
            content.push(fileContent);
          }
        }
      }

      if (files.length > 0) {
        // const pdfArr = files.some(
        //   (file) => file.mimetype === "application/pdf"
        // );
        for (const fileObj of files) {
          console.log("fileObj:", fileObj);

          const isImg =
            fileObj.mimetype.split("/")[0] === "image" ? true : false;
          console.log(isImg);

          const file = await ai.files.upload({
            file: new Blob([fileObj.buffer], { type: fileObj.mimetype }),
            config: isImg
              ? { mimeType: fileObj.mimetype }
              : { displayName: fileObj.originalname },
          });
          console.log("File:", file);
          if (!isImg) {
            console.log("hi");
            if (!file.name) {
              throw new Error("File name is missing!");
            }
            let getFile = await ai.files.get({ name: file.name });
            while (getFile.state === "PROCESSING") {
              getFile = await ai.files.get({ name: file.name });
              console.log(`current file status: ${getFile.state}`);
              console.log("File is still processing, retrying in 5 seconds");

              await new Promise((resolve) => {
                setTimeout(resolve, 5000);
              });
            }
            if (file.state === "FAILED") {
              throw new Error("File processing failed.");
            }

            if (file.uri && file.mimeType) {
              const fileContent = createPartFromUri(file.uri, file.mimeType);
              console.log("Filecontent", fileContent);

              content.push(fileContent);
              console.log("Content: ", content);
            }
          } else {
            if (file.uri && file.mimeType) {
              imagesArr.push(createPartFromUri(file.uri, file.mimeType));
            }
            console.log("ImagesArr: ", imagesArr);
          }
        }
      }
      const mergedContent = [
        { text: input.trim() },
        ...content.filter((cont) => typeof cont !== "string"),
        ...imagesArr,
      ];

      const response = await ai.models.generateContent({
        model,
        contents: createUserContent(mergedContent),

        ...(model === "gemini-2.0-flash-exp-image-generation" && {
          config: {
            responseModalities: ["Text", "Image"],
          },
        }),
      });
      // console.log("hi");

      if (model === "gemini-2.0-flash-exp-image-generation") {
        // console.log("check");
        let finalResponse = "";
        let imageDataSrc = "";
        let textWithPic = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          // Based on the part type, either show the text or save the image
          if (part.text) {
            finalResponse = part.text;
            textWithPic = true;
            // console.log("hi");
          } else if (part.inlineData) {
            const metaData = part.inlineData.mimeType;
            const imageData = part.inlineData.data;

            imageDataSrc = `data:${metaData};base64,${imageData}`;
            console.log("Image saved as gemini-native-image.png");
          }
          console.log(part);
        }
        res.json({
          response: finalResponse,
          textWithPic,
          imageDataSrc,
          model,
        });
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
        console.log("deep");

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: [
              {
                role: "user",
                content: input,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DEEPSEEK_V3_APIKEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          const errorText = response.statusText;
          throw new Error(
            `OpenRouter Error: ${response.status} - ${errorText}`
          );
        }

        const reply = response.data.choices?.[0]?.message?.content;
        console.log(reply);

        res.json({ response: reply, model: model });
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
