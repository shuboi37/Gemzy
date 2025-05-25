import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { detectModel } from "../middlewares/model.middleware.js";
import { handleGemini } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/response", upload.any(), detectModel, handleGemini);

export default router;
