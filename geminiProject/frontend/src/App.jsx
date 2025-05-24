import { useState } from "react";
import axios from "axios";
import { Textarea } from "./components/ui/TextArea";
import PlaceholdersAndVanishInputDemo from "./components/placeholders-and-vanish-input-demo";
import { PromptInputWithActions } from "./components/inputBox-demo";
function App() {
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [imageDataSrc, setImageDataSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const [onlyText, setOnlyText] = useState(false);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setInput("");
        setFiles([]);
      }, 2000);
    }
  };

  async function fetcher() {
    try {
      setImageDataSrc("");
      setLoading(true);

      const backendResponse = await axios.post(
        "http://localhost:3000/api/response",
        {
          input: input,
          model: model,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await backendResponse.data;
      setResponse(data?.response),
        setOnlyText(data?.textWithPic),
        setImageDataSrc(data?.imageDataSrc);
      setModel(data?.model);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const onSubmitHandler = () => {
    handleSubmit(), fetcher();
  };

  return (
    <div className="flex flex-col h-screen px-4 py-10 space-y-12 items-center">
      {response !== "Thinking" && (
        <h1 className="text-white text-pretty whitespace-pre-wrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-center">
          Say it. I’ll make it real.
        </h1>
      )}
      <div className="w-full max-w-4xl">
        <PromptInputWithActions
          model={model}
          setModel={setModel}
          files={files}
          setFiles={setFiles}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          loading={loading}
          onSubmit={onSubmitHandler}
          disabled={!imageDataSrc && loading}
        />
      </div>

      <div className="bg-black w-full max-w-3xl mt-10 flex flex-col items-center space-y-6">
        {response &&
          (imageDataSrc ? (
            <div className="flex flex-col space-y-4 items-center">
              {onlyText && (
                <p className="font-semibold text-white px-4 py-3">{response}</p>
              )}
              <img
                src={imageDataSrc}
                alt="Gemini Image"
                className="rounded-md shadow-md mb-4"
                width="250px"
                height="250px"
              />
            </div>
          ) : (
            <Textarea
              value={response}
              readOnly
              placeholder="Your response...."
              className="text-white font-semibold border-2 border-red-800 px-6 py-3 bg-neutral-900 w-full "
            />
          ))}
      </div>
    </div>
  );
}

export default App;
