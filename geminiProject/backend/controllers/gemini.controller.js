import { ai } from "../utils/geminiClient.js";
import axios from "axios";

export const handleGemini = async (req, res) => {
  try {
    const input = req.body.input;
    const model = req.model;
    // console.log("hi");

    if (
      model === "gemini-2.0-flash" ||
      model === "gemini-2.0-flash-exp-image-generation"
    ) {
      const response = await ai.models.generateContent({
        model: model,
        contents: input,
        ...(model === "gemini-2.0-flash-exp-image-generation" && {
          config: {
            responseModalities: ["Text", "Image"],
          },
        }),
      });
      // console.log("hi");

      if (model === "gemini-2.0-flash-exp-image-generation") {
        // console.log("check");
        let finalResponse = "";
        let imageDataSrc = "";
        let textWithPic = false;
        for (const part of response.candidates[0]?.content?.parts || []) {
          // Based on the part type, either show the text or save the image
          if (part.text) {
            finalResponse = part.text;
            textWithPic = true;
            // console.log("hi");
          } else if (part.inlineData) {
            const metaData = part.inlineData.mimeType;
            const imageData = part.inlineData.data;

            imageDataSrc = `data:${metaData};base64,${imageData}`;
            console.log("Image saved as gemini-native-image.png");
          }
          console.log(part);
        }
        return res.json({
          response: finalResponse,
          textWithPic: textWithPic,

          imageDataSrc: imageDataSrc,
          model: model,
        });
      } else {
        const finalResponse = response.text;
        return res.json({
          response: finalResponse,
          model: model,
        });
      }
    } else {
      try {
        // console.log("deep");

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: [
              {
                role: "user",
                content: input,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DEEPSEEK_V3_APIKEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          const errorText = response.statusText;
          throw new Error(
            `OpenRouter Error: ${response.status} - ${errorText}`
          );
        }

        const reply = response.data.choices?.[0]?.message?.content;
        // console.log(reply);

        return res.json({ response: reply, model: model });
      } catch (error) {
        return res.json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
