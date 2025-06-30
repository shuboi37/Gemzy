import { groq } from "../utils/groqClient";

interface GroqChatOptions {
  input: string;
  model: string;
}

export const getGroqChatCompletion = async ({
  input,
  model,
}: GroqChatOptions) => {
  return groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: input,
      },
    ],
    model: model ?? "llama-3.3-70b-versatile",
  });
};
