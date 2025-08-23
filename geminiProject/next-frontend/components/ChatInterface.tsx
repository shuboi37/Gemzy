"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/TextArea";
import { PromptInputWithActions } from "@/components/inputBox-demo";

interface ChatInterfaceProps {}

export default function ChatInterface({}: ChatInterfaceProps) {
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [imageDataSrc, setImageDataSrc] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [onlyText, setOnlyText] = useState(false);

  async function fetcher() {
    if (!input.trim() && files.length === 0) {
      return;
    }

    setLoading(true);
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

      setInput("");
      setFiles([]);

      const stream = await fetch("/api/response", {
        method: "POST",
        body: formdata,
      });

      if (!stream.ok) {
        const errorData = await stream.json();
        throw new Error(
          errorData.message || "An error occurred on the server."
        );
      }

      const reader = stream.body?.getReader();
      if (!reader) {
        throw new Error("Could not read response stream.");
      }
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        for (const line of chunk.trim().split("\n")) {
          try {
            const json = JSON.parse(line);

            if (json.type === "delta") {
              setResponse((prev) => prev + json.content);
            } else if (json.type === "final_gemini_response") {
              setResponse(json.data.response);
              setOnlyText(json.data.textWithPic);
              setImageDataSrc(json.data.imageDataSrc);
              setModel(json.data.effectiveModel);
            } else if (json.type === "meta") {
              setModel(json.model);
            } else if (json.type === "error") {
              throw new Error(json.message);
            }
          } catch (e) {
            console.error("Failed to parse stream chunk:", line);
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
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
    <div className="flex h-full w-full flex-col items-center space-y-20 pb-16">
      {!response && (
        <h1 className="text-center text-2xl leading-tight font-semibold text-pretty whitespace-pre-wrap text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Say it. I'll make it real.
        </h1>
      )}
      <div className="w-full max-w-4xl items-center">
        <div className="flex w-full items-center justify-center">
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

      <div className="mt-10 flex w-full max-w-3xl flex-col items-center space-y-6 bg-black">
        {response &&
          (imageDataSrc || onlyText ? (
            <div className="flex flex-col items-center space-y-4 p-6">
              {onlyText && (
                <p className="px-4 py-3 font-semibold text-white">{response}</p>
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
              className="w-full border border-gray-100 bg-neutral-950 px-6 py-3 font-semibold text-white"
            />
          ))}
      </div>
    </div>
  );
}
