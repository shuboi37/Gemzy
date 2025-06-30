import { Part } from "@google/genai";
import { ai, createUserContent } from "../utils/geminiClient";

interface getGeminiServiceProps {
  model: string;
  mergedContent: (
    | Part
    | {
        text: string;
      }
  )[];
}

export const getGeminiService = async ({
  model,
  mergedContent,
}: getGeminiServiceProps) => {
  const response = await ai.models.generateContent({
    model,
    contents: createUserContent(mergedContent),

    ...(model === "gemini-2.0-flash-exp-image-generation" && {
      config: {
        responseModalities: ["Text", "Image"],
      },
    }),
  });
  return response;
};
