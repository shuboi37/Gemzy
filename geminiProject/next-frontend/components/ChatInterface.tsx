"use client";

import { useState } from "react";
import axios from "axios";
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
    try {
      if (input.trim() || files.length > 0) {
        setLoading(true);
        setImageDataSrc((prev) => prev);
        let updatedModel = model;
        console.log(input);
        const regex =
          /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w.-]+)+(?:\/[\w\-./?%&=]*)?\.pdf/gi;
        const matches = input.match(regex);
        console.log(matches);

        if (
          matches ||
          (model === "llama-3.3-70b-versatile" && files.length > 0)
        ) {
          updatedModel = "gemini-2.0-flash";
          setModel(updatedModel);
          console.log("hola");
        }

        const formdata = new FormData();
        formdata.append("input", input);
        formdata.append("model", updatedModel);
        files.map((file) => {
          formdata.append("files", file);
        });
        console.log(formdata);
        console.log("i ran again");
        if (model.startsWith("gemini") || files.length > 0 || matches) {
          setResponse((prev) => prev);
          setInput("");
          console.log(model);

          console.log("hii, in gemini");
          const backendResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/response`,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const data = await backendResponse.data;
          setResponse(data?.response),
            setOnlyText(data?.textWithPic),
            setImageDataSrc(data?.imageDataSrc);
          setModel(data?.model);
        } else if (!files.length) {
          console.log("hiiiii");
          console.log(model);
          setResponse((prev) => prev && "");
          setImageDataSrc((prev) => prev && undefined);
          setOnlyText((prev) => prev && false);
          setInput("");
          const stream = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/response`,
            {
              method: "POST",
              body: formdata,
            }
          );

          const reader = stream.body?.getReader();
          const decoder = new TextDecoder("utf-8");

          let fullText: string = "";
          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.trim().split("\n")) {
              const json = JSON.parse(line);
              if (json.type === "delta") {
                fullText += json.content;
                setResponse((prev) => prev + json.content);
              } else if (json.type === "meta") {
                setModel(json.model);
              }
            }
          }
        }

        setFiles([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error("Something went wrong....");
      }
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
