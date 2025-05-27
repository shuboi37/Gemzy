import { ai, createPartFromUri } from "../utils/geminiClient.js";
import axios from "axios";

export const handleGemini = async (req, res) => {
  try {
    const input = req.body.input;
    const model = req.model;
    const files = req.files;
    const fileObj = files[0];
    // console.log("hi");

    if (
      model === "gemini-2.0-flash" ||
      model === "gemini-2.0-flash-exp-image-generation"
    ) {
      console.log("1");

      const detectUrl = (input) => {
        const regex =
          /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
        const matches = input.match(regex);
        if (!matches)
          return { prompt: input.trim(), pdfUrl: null, displayName: null };
        const rawUrl = matches[0];
        const pdfUrl = rawUrl.startsWith("http") ? rawUrl : "https://" + rawUrl;

        const prompt = input.replace(rawUrl, "").trim();
        const displayName = pdfUrl.split("/").pop().split("?")[0].split("#")[0];

        return { prompt, pdfUrl, displayName };
      };

      const { prompt, pdfUrl, displayName } = detectUrl(input);
      let content;
      if (pdfUrl) {
        const pdfBuffer = await fetch(pdfUrl).then((response) =>
          response.arrayBuffer()
        );

        const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

        const file = await ai.files.upload({
          file: fileBlob,
          config: {
            displayName: displayName,
          },
        });

        // Wait for the file to be processed.
        let getFile = await ai.files.get({ name: file.name });

        while (getFile.state === "PROCESSING") {
          getFile = await ai.files.get({ name: file.name });
          console.log(`current file status: ${getFile.state}`);
          console.log("File is still processing, retrying in 5 seconds");

          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
        if (file.state === "FAILED") {
          throw new Error("File processing failed.");
        }

        // Add the file to the contents.
        content = [prompt];

        if (file.uri && file.mimeType) {
          const fileContent = createPartFromUri(file.uri, file.mimeType);
          content.push(fileContent);
        }
      } else if (fileObj) {
        const file = await ai.files.upload({
          file: new Blob([fileObj.buffer], { type: fileObj.mimetype }),
          config: {
            displayName: fileObj.originalname,
          },
        });
        let getFile = await ai.files.get({ name: file.name });
        while (getFile.state === "PROCESSING") {
          getFile = await ai.files.get({ name: file.name });
          console.log(`current file status: ${getFile.state}`);
          console.log("File is still processing, retrying in 5 seconds");

          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
        if (file.state === "FAILED") {
          throw new Error("File processing failed.");
        }

        content = [input];

        if (file.uri && file.mimeType) {
          const fileContent = createPartFromUri(file.uri, file.mimeType);
          content.push(fileContent);
        }
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: pdfUrl || fileObj ? content : input,
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
//todos
// error handling middleware
// try catch above
// image handling
// multiple pdfs handling and if user uploads pdf and give url both
// pdf validation
//
// ui/ux
// tooltip
// streaming response
//
//
//
//
//
//
//
//
//
//
//
//
