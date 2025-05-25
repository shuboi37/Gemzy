import { ai } from "../utils/geminiClient.js";
export const detectModel = async (req, res, next) => {
  try {
    const input = req.body.input;
    let finalModel = req.body.model;
    const ourPrompt = `Is this prompt related to image generation? Reply in yes or no only.Prompt:${input}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: ourPrompt,
    });
    const verdict = response.text;
    finalModel =
      verdict && verdict.toLowerCase().includes("yes")
        ? "gemini-2.0-flash-exp-image-generation"
        : finalModel === "deepseek/deepseek-chat-v3-0324"
        ? "deepseek/deepseek-chat-v3-0324"
        : "gemini-2.0-flash";
    req.model = finalModel;
    // console.log(req.model);

    next();
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
