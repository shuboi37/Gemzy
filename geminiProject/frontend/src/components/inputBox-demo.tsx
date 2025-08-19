"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "./ui/InputBox";
import { Button } from "./ui/Button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { ModelDropdown } from "./ui/ReusableUI";

type PromptInputWithActionsProps = {
  model: string;
  setModel: (model: string) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  value: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled: boolean;
};

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
}: PromptInputWithActionsProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const globalEnterListener = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && files.length > 0 && !loading) {
        e.preventDefault();
        onSubmit?.();
      }
    };
    window.addEventListener("keydown", () => globalEnterListener);
    return () =>
      window.removeEventListener("keydown", () => globalEnterListener);
  }, [files, loading, onSubmit]);
  console.log(model);

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
              <Paperclip
                className={`size-4 rounded-xl ${
                  model === "gemini-2.0-flash"
                    ? "hover:bg-gray-400"
                    : "pointer-events-none cursor-not-allowed"
                }`}
              />
              <span className="max-w-[120px] truncate">{file.name}</span>
              {(() => {
                console.log(file.name);
                return null;
              })()}
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

      <PromptInputTextarea />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-4">
          <PromptInputAction tooltip="Attach files">
            <label
              htmlFor="file-upload"
              className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                model === "gemini-2.0-flash"
                  ? "hover:bg-gray-400 cursor-pointer"
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                ref={uploadInputRef}
                disabled={model !== "gemini-2.0-flash"}
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>
          <PromptInputAction
            tooltip="Choose Model"
            disabled={isOpen}
            isDropOpen={isDropOpen}
          >
            <div className="cursor-pointer hover:bg-gray-400 rounded-2xl w-8 h-8">
              <ModelDropdown
                onFlashClick={() => setModel("gemini-2.0-flash")}
                onImageGenClick={() =>
                  setModel("gemini-2.0-flash-exp-image-generation")
                }
                onGroqClick={() => setModel("llama-3.3-70b-versatile")}
                model={model}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setIsDropOpen={setIsDropOpen}
                files={files}
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
              className="h-8 w-8 rounded-full hover:bg-gray-400 fill-current"
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
