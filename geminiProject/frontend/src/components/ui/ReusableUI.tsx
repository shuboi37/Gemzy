"use client";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function DropdownSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-select"
    >
      {/* Circle outline */}
      <circle cx="12" cy="12" r="10" />

      {/* Centered downward chevron */}
      <path d="M9 12l3 3l3-3" />
    </svg>
  );
}

type ModelDropdownProps = {
  onFlashClick: () => void;
  onImageGenClick: () => void;
  onDeepClick: () => void;
  model: string;
};

export function ModelDropdown({
  onFlashClick,
  onImageGenClick,
  onDeepClick,
  model,
}: ModelDropdownProps) {
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
