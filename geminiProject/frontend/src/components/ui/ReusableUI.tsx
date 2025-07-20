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
import { useState } from "react";

// export function DropdownSVG() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="32"
//       height="32"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="#000"
//       strokeWidth="1.75"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="icon cursor-pointer rounded-2xl icon-tabler icons-tabler-outline icon-tabler-select hover:bg-gray-400"
//     >
//       {/* Circle outline
//       <circle cx="12" cy="12" r="10" /> */}
//       {/* Downward stretched chevron */}
//       <path d="M8 10l4 5l4-5" />
//     </svg>
//   );
// }

type ModelDropdownProps = {
  onFlashClick: () => void;
  onImageGenClick: () => void;
  onGroqClick: () => void;
  model: string;
  isOpen: boolean;
  // onClick: () => void;
  setIsOpen: (prev: boolean) => void;
  setTooltipOpen: (prev: boolean) => void;
};

export function ModelDropdown({
  onFlashClick,
  onImageGenClick,
  onGroqClick,
  model,
  isOpen,
  // onClick,
  setIsOpen,
  setTooltipOpen,
}: ModelDropdownProps) {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        setTooltipOpen(false);
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DropdownMenuTrigger asChild>
        <div>{isOpen ? <ChevronUp /> : <ChevronDown />}</div>
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
