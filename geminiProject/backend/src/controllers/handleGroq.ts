import type { Request, Response } from "express";
import { getGroqChatCompletion } from "../services/groqServices";
export const handleGroq = async (req: Request, res: Response) => {
  try {
    const { input, model } = req.body;
    console.log("groq");
    // let reply: string = "";
    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const stream = await getGroqChatCompletion({ input, model });
    console.log(stream);
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        console.log(delta);
        res.write(JSON.stringify({ type: "delta", content: delta }) + "\n");
      }
    }

    res.write(JSON.stringify({ type: "meta", model }) + "\n");
    res.end();
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.write(
        JSON.stringify({ type: "error", message: error.message }) + "\n"
      );
      return;
    } else {
      res.write(
        JSON.stringify({ type: "error", message: "Something went wrong...." }) +
          "\n"
      );
      return;
    }
  }
};
