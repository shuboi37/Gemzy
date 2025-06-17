"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "./ui/InputBox";
import { Button } from "./ui/Button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ModelDropdown } from "../components/ui/ReusableUI";

export function PromptInputWithActions({
  model,
  setModel,
  files,
  setFiles,
  value,
  loading,
  onChange,
  onSubmit,
  disabled,
}) {
  // const [input, setInput] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [files, setFiles] = useState([]);
  const uploadInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const globalEnterListener = (e) => {
      if (e.key === "Enter" && !e.shiftKey && files.length > 0 && !loading) {
        e.preventDefault();
        onSubmit?.(e);
      }
    };
    window.addEventListener("keydown", globalEnterListener);
    return () => window.removeEventListener("keydown", globalEnterListener);
  }, [files, loading, onSubmit]);

  return (
    <PromptInput
      value={value}
      loading={loading}
      onSubmit={onSubmit}
      onChange={onChange}
      disabled={disabled}
      className="w-full max-w-(--breakpoint-md)"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className=" bg-gray-800 text-white text-pretty flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            >
              <Paperclip className="size-4" />
              <span className="max-w-[120px] truncate">{file.name}</span>
              {console.log(file.name)}
              <button
                onClick={() => handleRemoveFile(index)}
                className="hover:bg-black rounded-full p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <PromptInputTextarea placeholder="What's on your mind?" />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-4">
          <PromptInputAction tooltip="Attach files">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                ref={uploadInputRef}
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>
          <PromptInputAction tooltip="Choose model">
            <div>
              <ModelDropdown
                onFlashClick={() => setModel("gemini-2.0-flash")}
                onImageGenClick={() =>
                  setModel("gemini-2.0-flash-exp-image-generation")
                }
                onDeepClick={() => setModel("deepseek/deepseek-chat-v3-0324")}
                model={model}
              />
            </div>
          </PromptInputAction>
        </div>

        {(value.trim() || files.length > 0) && (
          <PromptInputAction
            tooltip={loading ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-300 fill-current"
              onClick={onSubmit}
            >
              {loading ? (
                <Square className="size-5 hover:fill-white fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        )}
      </PromptInputActions>
    </PromptInput>
  );
}
