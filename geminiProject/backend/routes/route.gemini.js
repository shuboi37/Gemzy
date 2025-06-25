import upload from "../middlewares/upload.middleware.js";
import { handleGemini } from "../controllers/gemini.controller.js";
import { detectModel } from "../middlewares/model.middleware.js";
import express from "express";

const router = express.Router();
router.post("/response", upload.any(), detectModel, handleGemini);

export default router;
