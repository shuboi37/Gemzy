import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("src/config/.env") });

export const ai = new GoogleGenAI({
  apiKey: `${process.env.GEMINI_APIKEY}`,
});

export { createPartFromUri };
export { createUserContent };
