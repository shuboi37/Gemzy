"use client";

import { useState } from "react";
import { LogoSVG } from "@/components/ui/LogoSVG";
import { MiniBar } from "@/components/ui/Minibar";
import {
  PanelRightClose,
  PanelLeftClose,
  ChevronsDownUp,
  Search,
  MessageSquarePlus,
  Images,
  ChevronDown,
  User,
  Settings,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./dropdown-menu";
export const Sidebar = () => {
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);
  const [isChatsExpanded, setIsChatsExpanded] = useState(false);
  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(!isOpen);
    } else {
      return;
    }
    setIsHoverable(false);
  };

  return !isCollapsible ? (
    <div
      onClick={handleClick}
      className={`${
        isOpen ? "w-68" : "w-16 cursor-e-resize"
      } relative h-screen bg-neutral-900/85`}
    >
      <div
        className={`flex h-full flex-col items-center ${
          isOpen
            ? "bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-950"
            : ""
        }`}
      >
        <div className="flex h-20 w-full flex-shrink-0 items-center gap-28 p-2">
          <button
            onClick={handleClick}
            onMouseLeave={!isOpen ? () => setIsHoverable(false) : undefined}
            onMouseEnter={!isOpen ? () => setIsHoverable(true) : undefined}
            className={`flex h-12 w-12 items-center justify-center rounded-lg px-2 transition-all ease-in-out hover:bg-neutral-700 ${
              isOpen && ""
            }`}
          >
            {isHoverable && !isOpen && (
              <PanelRightClose className="h-7 w-7 text-white" />
            )}
            {(!isHoverable || isOpen) && (
              <LogoSVG className="transition-colors duration-200" />
            )}
          </button>
          {isOpen && (
            <div className="flex w-1/3 items-center space-x-3">
              <button
                onClick={() => setIsCollapsible(true)}
                className="rounded-lg p-2 hover:bg-neutral-700"
              >
                <ChevronsDownUp className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-2 hover:bg-neutral-700"
              >
                <PanelLeftClose className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </div>

        <div className="flex w-full flex-1 flex-col overflow-hidden">
          {isOpen ? (
            <div className="mt-2 mb-4 flex w-full flex-col space-y-3 px-2">
              <button className="h-10 w-full rounded-3xl hover:bg-neutral-700">
                <span className="ml-1 flex items-center space-x-3 p-2 text-white">
                  <MessageSquarePlus className="h-6 w-6" />
                  <span className="-translate-y-[2.5px] font-sans text-[16px]">
                    New Chat
                  </span>
                </span>
              </button>
              <button className="h-10 w-full rounded-3xl hover:bg-neutral-700">
                <span className="ml-1 flex w-full items-center space-x-3 p-2 text-white">
                  <Search className="h-6 w-6" />
                  <span className="-translate-y-[2.5px] font-sans text-[16px] tracking-wide">
                    Search
                  </span>
                </span>
              </button>
              <button className="h-10 w-full rounded-3xl hover:bg-neutral-700">
                <span className="ml-1 flex w-full items-center space-x-3 p-2 text-white">
                  <Images className="h-6 w-6" />
                  <span className="-translate-y-[2.5px] font-sans text-[16px] tracking-wide">
                    Library
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <div className="relative mt-5 flex w-16 flex-1 flex-col items-center">
              <div className="flex h-[25%] flex-col items-center space-y-2">
                <button className="rounded-lg p-3 hover:bg-neutral-700">
                  <MessageSquarePlus className="h-6 w-6 flex-1 text-white transition-all duration-200 ease-in-out" />
                </button>
                <button className="rounded-lg p-3 hover:bg-neutral-700">
                  <Search className="h-6 w-6 flex-1 text-white transition-all duration-200 ease-in-out" />
                </button>
                <button className="rounded-lg p-3 hover:bg-neutral-700">
                  <Images className="h-6 w-6 flex-1 text-white transition-all duration-200 ease-in-out" />
                </button>
              </div>
              <div className="absolute bottom-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-rose-600">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          {isOpen && (
            <div className="flex w-full flex-1 flex-col overflow-hidden px-2">
              <div className="flex h-[396px] w-full flex-col">
                <button
                  onClick={() => setIsChatsExpanded(!isChatsExpanded)}
                  className="flex w-full flex-shrink-0 items-center justify-between rounded-lg px-3 py-2 text-neutral-300/80 transition-all duration-200 hover:bg-neutral-700/50 hover:text-white"
                >
                  <span className="text-[16px] font-medium">Chats</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isChatsExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isChatsExpanded && (
                  <div className="custom-scrollbar mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Chat with AI Assistant
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Project Discussion
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Code Review Session
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Bug Investigation
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Feature Planning
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Documentation Review
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      API Integration Chat
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Database Design Discussion
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Bug Investigation
                    </div>
                    <div className="text-md cursor-pointer rounded-lg px-3 py-2 text-neutral-300/95 transition-all duration-150 hover:bg-neutral-700/30 hover:text-white">
                      Feature Planning
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="absolute bottom-0 left-0 w-full border-t border-neutral-700/50 bg-neutral-800/50">
            <div className="p-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-rose-600">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    Shubhankar
                  </div>
                  <div className="truncate text-xs text-neutral-400">
                    shubhankar@gemzy.ai
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded p-1 text-neutral-400 transition-all duration-150 hover:bg-neutral-700/50 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`border-neutral-700 bg-slate-900 shadow-lg ${
                      isOpen ? "w-[262px]" : "w-auto"
                    }`}
                    side="top"
                    align="end"
                    sideOffset={12}
                  >
                    <DropdownMenuItem className="cursor-pointer text-white outline-none hover:bg-neutral-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-white outline-none hover:bg-neutral-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <MiniBar setIsCollapsible={setIsCollapsible} />
  );
};
