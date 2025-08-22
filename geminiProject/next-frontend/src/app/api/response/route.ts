// src/app/api/response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleGemini } from "../../../backend/controllers/gemini.controller";
import { handleGroq } from "../../../backend/controllers/handleGroq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const model = formData.get("model") as string;
    const input = formData.get("input") as string;
    const files = formData.getAll("files") as File[];

    console.log(`[API Route] Received request for model: ${model}`);
    console.log(`[API Route] Input: "${input}"`);
    console.log(`[API Route] Files count: ${files.length}`);

    // This is the variable we'll use for the final routing decision.
    let effectiveModel = model;

    // The backend now inspects the input directly.
    const pdfRegex =
      /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
    const hasPdfMatches = pdfRegex.test(input);

    // **This is the core logic you requested:**
    // If a PDF URL is found AND a non-Gemini model was selected,
    // override the model to use gemini-2.0-flash.
    if (hasPdfMatches && !model.startsWith("gemini")) {
      effectiveModel = "gemini-2.0-flash";
      console.log(
        `[API Route] PDF URL detected with incompatible model '${model}'. Switched to '${effectiveModel}'.`
      );
    }

    let stream: ReadableStream;

    // The final routing decision is based on the 'effectiveModel'.
    if (effectiveModel.startsWith("llama")) {
      console.log("[API Route] Handing off to Groq handler.");
      stream = await handleGroq(input, effectiveModel);
    } else {
      console.log("[API Route] Handing off to Gemini handler.");
      stream = handleGemini(input, effectiveModel, files);
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("[API Route] Critical Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred on the server.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
