// src/backend/controllers/gemini.controller.ts
import { Part } from "@google/genai";
import { getUrlToUploadService } from "@/lib/backend/services/urlToUploadServices";
import { getFileUploadService } from "@/lib/backend/services/fileUploadService";
import { getImageService } from "@/lib/backend/services/imageServices";
import { getGeminiService } from "@/lib/backend/services/geminiSdkService";

export const handleGemini = (
  input: string,
  effectiveModel: string,
  files: File[]
): ReadableStream => {
  // We wrap the entire logic in a new ReadableStream.
  // The 'start' method is an async function that gives us a 'controller'
  // to enqueue (send) data chunks and close the stream.
  return new ReadableStream({
    async start(controller) {
      try {
        console.log(
          `[handleGemini] Starting process for model: ${effectiveModel}`
        );
        let content: (string | Part)[] = [];
        let imagesArr: Part[] = [];

        // Note: We don't pre-fill `content` with the input text anymore
        // because we will add it separately to the `mergedContent`.

        const regex =
          /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
        const matches = input.match(regex);

        if (matches) {
          console.log("[handleGemini] PDF URLs found, processing...");
          content = await getUrlToUploadService({ input, matches });
        }

        if (files.length > 0) {
          console.log(
            `[handleGemini] ${files.length} files found, processing...`
          );
          const { contentArr, imagesArray } = await getFileUploadService({
            files,
          });
          if (contentArr.length) content.push(...contentArr);
          if (imagesArray.length) imagesArr.push(...imagesArray);
        }

        const mergedContent = [
          { text: input.trim() },
          // Filter out the initial input string if it's still there from PDF processing
          ...content.filter((cont) => typeof cont !== "string"),
          ...imagesArr,
        ];

        console.log("[handleGemini] Sending request to Gemini service...");
        const response = await getGeminiService({
          effectiveModel,
          mergedContent,
        });
        console.log("[handleGemini] Received response from Gemini service.");

        let finalResult;
        if (effectiveModel === "gemini-2.0-flash-exp-image-generation") {
          const { finalResponse, textWithPic, imageDataSrc } =
            await getImageService(response);
          finalResult = {
            response: finalResponse,
            textWithPic,
            imageDataSrc,
            effectiveModel,
          };
        } else {
          finalResult = { response: response.text, effectiveModel };
        }

        console.log("[handleGemini] Final result:", finalResult);

        // This is the key part for "simulating" the stream.
        // We create a single chunk with a unique type.
        const chunk =
          JSON.stringify({
            type: "final_gemini_response",
            data: finalResult,
          }) + "\n";

        // We send (enqueue) our single chunk of data.
        controller.enqueue(new TextEncoder().encode(chunk));

        // And then we immediately close the stream.
        controller.close();
        console.log("[handleGemini] Sent single chunk and closed stream.");
      } catch (error) {
        // If anything in the 'try' block fails, we catch it here.
        console.error("[handleGemini] Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred in the Gemini handler.";

        const jsonError =
          JSON.stringify({ type: "error", message: errorMessage }) + "\n";

        // We enqueue the error message and close the stream.
        controller.enqueue(new TextEncoder().encode(jsonError));
        controller.close();
      }
    },
  });
};
