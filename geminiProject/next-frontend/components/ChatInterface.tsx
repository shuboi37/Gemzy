"use client";

import { useState } from "react";
import { Textarea } from "./ui/TextArea";
import { PromptInputWithActions } from "./inputBox-demo";

interface ChatInterfaceProps {
  // Add any props you need
}

export default function ChatInterface({}: ChatInterfaceProps) {
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [imageDataSrc, setImageDataSrc] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [onlyText, setOnlyText] = useState(false);

  async function fetcher() {
    // Guard clause: Exit early if there's nothing to send.
    if (!input.trim() && files.length === 0) {
      return;
    }

    setLoading(true);
    // Reset state for the new response
    setResponse("");
    setImageDataSrc(undefined);
    setOnlyText(false);

    try {
      const formdata = new FormData();
      formdata.append("input", input);
      formdata.append("model", model);
      files.forEach((file) => {
        formdata.append("files", file);
      });

      setInput(""); // Clear input immediately for a better UX
      setFiles([]); // Clear files immediately

      // --- SINGLE FETCH LOGIC ---
      const stream = await fetch("/api/response", {
        // Use relative path
        method: "POST",
        body: formdata,
      });

      if (!stream.ok) {
        // Handle HTTP errors like 500, 404 etc.
        const errorData = await stream.json();
        throw new Error(
          errorData.message || "An error occurred on the server."
        );
      }

      // --- UNIFIED RESPONSE HANDLING ---
      const reader = stream.body?.getReader();
      if (!reader) {
        throw new Error("Could not read response stream.");
      }
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // The backend will now ALWAYS stream ndjson, even for Gemini.
        // A non-streaming Gemini response will just be a single chunk.
        for (const line of chunk.trim().split("\n")) {
          try {
            const json = JSON.parse(line);

            if (json.type === "delta") {
              setResponse((prev) => prev + json.content);
            } else if (json.type === "final_gemini_response") {
              // A new response type for the complete Gemini data
              setResponse(json.data.response);
              setOnlyText(json.data.textWithPic);
              setImageDataSrc(json.data.imageDataSrc);
              setModel(json.data.effectiveModel);
            } else if (json.type === "meta") {
              setModel(json.model); // Fixed: was json.effectiveModel, should be json.model
            } else if (json.type === "error") {
              // Handle errors sent from within the stream
              throw new Error(json.message);
            }
          } catch (e) {
            console.error("Failed to parse stream chunk:", line);
          }
        }
      }
    } catch (error) {
      // This will catch both network errors and errors thrown from the stream
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      // You should display this error to the user in the UI
      setResponse(`Error: ${errorMessage}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmitHandler = () => {
    fetcher();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="w-full h-full pb-16 flex flex-col items-center space-y-20">
      {!response && (
        <h1 className="text-white font-semibold text-pretty whitespace-pre-wrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-center">
          Say it. I'll make it real.
        </h1>
      )}
      <div className="w-full max-w-4xl items-center">
        <div className="flex justify-center items-center w-full">
          <PromptInputWithActions
            model={model}
            setModel={setModel}
            files={files}
            setFiles={setFiles}
            onChange={(e) => handleOnChange(e)}
            value={input}
            loading={loading}
            onSubmit={onSubmitHandler}
            disabled={loading}
          />
        </div>
      </div>

      <div className="bg-black w-full max-w-3xl mt-10 flex flex-col items-center space-y-6">
        {response &&
          (imageDataSrc || onlyText ? (
            <div className="flex flex-col space-y-4 items-center p-6">
              {onlyText && (
                <p className="font-semibold text-white px-4 py-3">{response}</p>
              )}
              <img
                src={imageDataSrc}
                alt="Gemini Image"
                className="rounded-md shadow-md"
              />
            </div>
          ) : (
            <Textarea
              value={response}
              readOnly
              placeholder="Your response...."
              className="text-white font-semibold border border-gray-100 px-6 py-3 bg-neutral-950 w-full "
            />
          ))}
      </div>
    </div>
  );
}
