"use client";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
// import { useState } from "react";

type ModelDropdownProps = {
  onFlashClick: () => void;
  onImageGenClick: () => void;
  onGroqClick: () => void;
  model: string;
  isOpen: boolean;
  setIsOpen: (prev: boolean) => void;
  // setTooltipOpen: (prev: boolean) => void;
};

export function ModelDropdown({
  onFlashClick,
  onImageGenClick,
  onGroqClick,
  model,
  isOpen,
  // onClick,
  setIsOpen,
}: // setTooltipOpen,
ModelDropdownProps) {
  // const [isOpen, setIsOpen] = useState(false)
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        // setTooltipOpen(false);
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-gray-400 rounded-2xl">
          {isOpen ? (
            <ChevronUp
              className="w-8 h-8 bg-gray-400 rounded-2xl"
              strokeOpacity="0.79"
            />
          ) : (
            <ChevronDown className="w-8 h-8" strokeOpacity="0.79" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-gray-700 w-48 translate-y-3 bg-black">
        <DropdownMenuLabel className="font-extralight text-white border-b-2 border-gray-700">
          Choose Model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800 focus:outline-none"
          checked={model === "gemini-2.0-flash"}
          onClick={onFlashClick}
        >
          Gemini-2.0-flash
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800 focus:outline-none"
          checked={model === "gemini-2.0-flash-exp-image-generation"}
          onClick={onImageGenClick}
        >
          Gemini-2.0-flash-exp-image-generation
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800 focus:outline-none"
          checked={model === "llama-3.3-70b-versatile"}
          onClick={onGroqClick}
        >
          Llama-3.3-70b-versatile
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
