// types/express.d.ts
import { Request } from "express";
import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[]; // Properly typed for multer
    }
  }
}

// Remove the duplicate DetectModelRequest - use the global extension instead
export {}; // This makes the file a module
