import express from "express";
import dotenv from "dotenv";
import geminiRouter from "./routes/gemini.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", geminiRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
