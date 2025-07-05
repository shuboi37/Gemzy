import upload from "../middlewares/upload.middleware";
import { detectModel } from "../middlewares/model.middleware";
import { handleMain } from "../controllers/handleMain";
import express from "express";

const router = express.Router();
router.post("/response", upload.any(), detectModel, handleMain);
export default router;
