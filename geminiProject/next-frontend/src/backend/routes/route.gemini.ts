import upload from "../middlewares/upload.middleware";
import { handleMain } from "../controllers/handleMain";
import express from "express";

const router = express.Router();
router.post("/response", upload.any(), handleMain);
export default router;
