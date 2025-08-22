// src/backend/controllers/handleGroq.ts
import { getGroqChatCompletion } from "../services/groqServices";

export const handleGroq = async (
  input: string,
  effectiveModel: string
): Promise<ReadableStream> => {
  try {
    const groqStream = await getGroqChatCompletion({ input, effectiveModel });

    // Create a ReadableStream that processes the Groq stream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqStream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              const jsonChunk =
                JSON.stringify({ type: "delta", content: delta }) + "\n";
              controller.enqueue(new TextEncoder().encode(jsonChunk));
            }
          }

          // Send meta information at the end
          const metaChunk =
            JSON.stringify({ type: "meta", model: effectiveModel }) + "\n";
          controller.enqueue(new TextEncoder().encode(metaChunk));
          controller.close();
        } catch (error) {
          console.error("Error processing Groq stream:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Stream processing error";
          const jsonError =
            JSON.stringify({ type: "error", message: errorMessage }) + "\n";
          controller.enqueue(new TextEncoder().encode(jsonError));
          controller.close();
        }
      },
    });
  } catch (error: unknown) {
    console.error("Error in handleGroq:", error);
    // Create a readable stream that sends an error message
    return new ReadableStream({
      start(controller) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        const jsonError =
          JSON.stringify({ type: "error", message: errorMessage }) + "\n";
        controller.enqueue(new TextEncoder().encode(jsonError));
        controller.close();
      },
    });
  }
};
