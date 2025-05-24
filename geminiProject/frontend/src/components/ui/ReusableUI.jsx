"use client";

import * as React from "react";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function DropdownSVG() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className="cursor-pointer w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="30"
        height="30"
      >
        {/* Background circle */}
        <circle cx="256" cy="256" r="256" fill="#d1d5db" />
        <g
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transformOrigin: "256px 256px",
            transition: "transform 0.3s ease",
          }}
        >
          {/* Arrow */}
          <path
            d="M135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"
            fill="#000"
          />
        </g>
      </svg>
    </div>
  );
}

export function ModelDropdown({
  onFlashClick,
  onImageGenClick,
  onDeepClick,
  model,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <DropdownSVG />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-gray-700 w-48 translate-y-3 bg-black">
        <DropdownMenuLabel className="font-extralight text-white border-b-2 border-gray-700">
          Choose Model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800"
          checked={model === "gemini-2.0-flash"}
          onClick={onFlashClick}
        >
          Gemini-2.0-flash
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800"
          checked={model === "gemini-2.0-flash-exp-image-generation"}
          onClick={onImageGenClick}
        >
          Gemini-2.0-flash-exp-image-generation
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800"
          checked={model === "deepseek/deepseek-chat-v3-0324"}
          onClick={onDeepClick}
        >
          DeepSeek_V3
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
