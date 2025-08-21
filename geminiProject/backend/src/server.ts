import express from "express";
import dotenv from "dotenv";
import geminiRouter from "./routes/route.gemini";
import cors from "cors";
import { handleError } from "./middlewares/error.middleware";

import path from "path";

dotenv.config({ path: path.resolve("src/config/.env") });

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", geminiRouter);
app.use(handleError);

const port: string | number = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server running on port ${port}`));
