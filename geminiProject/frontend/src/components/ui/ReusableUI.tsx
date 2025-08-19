"use client";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronUp } from "lucide-react";

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
  files: File[];
  isOpen: boolean;
  setIsOpen: (prev: boolean) => void;
  setIsDropOpen: (prev: boolean) => void;
  // setTooltipOpen: (prev: boolean) => void;
};

export function ModelDropdown({
  onFlashClick,
  onImageGenClick,
  onGroqClick,
  model,
  isOpen,
  files,
  // onClick,
  setIsOpen,
  setIsDropOpen,
}: // setTooltipOpen,
ModelDropdownProps) {
  // const [isOpen, setIsOpen] = useState(false)
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        // setTooltipOpen(false);
        setIsOpen(open);
        setIsDropOpen(!open);
      }}
      open={isOpen}
    >
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-gray-400 rounded-2xl">
          <ChevronUp
            className={`${
              isOpen ? "rotate-0 bg-gray-400" : "rotate-180"
            } w-8 h-8 hover:bg-gray-400 rounded-2xl transition-all ease-in-out duration-150`}
            strokeOpacity="0.79"
          />
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
          disabled={files.length > 0 ? true : false}
        >
          Gemini-2.0-flash-exp-image-generation
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="text-white hover:bg-gray-800 focus:outline-none"
          checked={model === "llama-3.3-70b-versatile"}
          onClick={onGroqClick}
          disabled={files.length > 0 ? true : false}
        >
          Llama-3.3-70b-versatile
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
