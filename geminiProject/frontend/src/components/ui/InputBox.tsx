"use client";

import { Textarea } from "./TextArea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { cn } from "../../../lib/utils";
import React, { createContext, useContext, useEffect, useRef } from "react";

const PromptInputContext = createContext({
  isLoading: false,
  value: "",
  onChange: () => {},
  maxHeight: 240,
  onSubmit: () => {},
  disabled: false,
});

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}

type PromptInputProps = {
  className: string;
  loading: boolean;
  maxHeight?: number;
  value: string;
  onChange: () => void;
  onSubmit: () => void;
  disabled: boolean;
  children: React.ReactNode;
};

function PromptInput({
  className,
  loading = false,
  maxHeight = 240,
  value,
  onChange,
  onSubmit,
  disabled = false,
  children,
}: PromptInputProps) {
  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading: loading,
          value,
          onChange,
          maxHeight,
          onSubmit,
          disabled,
        }}
      >
        <div
          className={cn(
            "border-input bg-gray-300 rounded-3xl border p-2 shadow-xs",
            className
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

type PromptInputTextareaProps = {
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disableAutosize?: boolean;
  placeholder: string;
};

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,

  ...props
}: PromptInputTextareaProps) {
  const { value, maxHeight, onSubmit, disabled, onChange, isLoading } =
    usePromptInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (disableAutosize) return;

    if (!textareaRef.current) return;
    textareaRef.current?.focus();
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={cn(
        `text-black placeholder:text-gray-600
        font-semibold min-h-[70px] w-full resize-none border-none bg-gray-300 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0`,
        className
      )}
      rows={1}
      disabled={disabled} //....
      {...props}
    />
  );
}

type PromptInputActionsProps = {
  children: React.ReactNode;
  className: string;
};

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

type PromptInputActionProps = {
  tooltip: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
};

function PromptInputAction({
  tooltip,
  children,
  className = "bg-black text-white",
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
};
