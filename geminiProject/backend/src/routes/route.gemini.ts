import upload from "../middlewares/upload.middleware";
import { handleGemini } from "../controllers/gemini.controller";
import { detectModel } from "../middlewares/model.middleware";
import express from "express";

const router = express.Router();
router.post("/response", upload.any(), detectModel, handleGemini);

export default router;
