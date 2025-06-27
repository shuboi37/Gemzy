import express from "express";
import dotenv from "dotenv";
import geminiRouter from "./routes/route.gemini.js";
import cors from "cors";
import { handleError } from "./middlewares/error.middleware.js";

dotenv.config({ path: "./config/.env" });

const app = express();
// app.use(express.json());
app.use(cors());
app.use("/api", geminiRouter);
app.use(handleError);

const port: string | number = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
