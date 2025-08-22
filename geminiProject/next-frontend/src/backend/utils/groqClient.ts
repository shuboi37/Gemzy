import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("src/config/.env") });
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_LLAMA3_8B });
