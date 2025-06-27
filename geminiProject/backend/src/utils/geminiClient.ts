import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

export const ai = new GoogleGenAI({
  apiKey: `${process.env.GEMINI_APIKEY}`,
});

export { createPartFromUri };
export { createUserContent };
