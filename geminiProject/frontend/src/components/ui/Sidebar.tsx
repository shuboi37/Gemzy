import { useState } from "react";
import LogoSVG from "./LogoSVG";
import { MiniBar } from "./Minibar";
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
      } h-screen relative bg-neutral-900/85`}
    >
      <div
        className={`flex flex-col h-full items-center ${
          isOpen
            ? "bg-gradient-to-b from-neutral-900/85 via-neutral-700 to-neutral-900/85"
            : ""
        }`}
      >
        {/* Top Section - Header */}
        <div className="flex items-center gap-28 w-full h-20 p-2 flex-shrink-0">
          <button
            onClick={handleClick}
            onMouseLeave={!isOpen ? () => setIsHoverable(false) : undefined}
            onMouseEnter={!isOpen ? () => setIsHoverable(true) : undefined}
            className={`rounded-lg px-2 hover:bg-neutral-700 w-12 h-12 flex items-center justify-center transition-all ease-in-out ${
              isOpen && ""
            }`}
          >
            {isHoverable && !isOpen && (
              <PanelRightClose className="text-white w-7 h-7" />
            )}
            {(!isHoverable || isOpen) && <LogoSVG className="text-white" />}
          </button>
          {isOpen && (
            <div className="flex w-1/3 items-center space-x-3">
              <button
                onClick={() => setIsCollapsible(true)}
                className="p-2 hover:bg-neutral-700 rounded-lg"
              >
                <ChevronsDownUp className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-neutral-700 rounded-lg"
              >
                <PanelLeftClose className="w-7 h-7 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Middle Section - Scrollable Content */}
        <div className="flex flex-col w-full flex-1 overflow-hidden">
          {/* Navigation Buttons */}
          {isOpen && (
            <div className="flex flex-col w-full space-y-3 px-2 mb-4 mt-2">
              <button className="w-full rounded-3xl hover:bg-neutral-700 h-10">
                <span className="flex p-2 space-x-3 ml-1 items-center text-white">
                  <MessageSquarePlus className="w-6 h-6" />
                  <span className="text-[16px] -translate-y-[2.5px] font-sans">
                    New Chat
                  </span>
                </span>
              </button>
              <button className="w-full rounded-3xl hover:bg-neutral-700 h-10">
                <span className="flex p-2 space-x-3 ml-1 w-full items-center text-white">
                  <Search className="w-6 h-6" />
                  <span className="text-[16px] -translate-y-[2.5px] tracking-wide font-sans">
                    Search
                  </span>
                </span>
              </button>
              <button className="w-full rounded-3xl hover:bg-neutral-700 h-10">
                <span className="flex p-2 space-x-3 ml-1 w-full items-center text-white">
                  <Images className="w-6 h-6" />
                  <span className="text-[16px] -translate-y-[2.5px] tracking-wide font-sans">
                    Library
                  </span>
                </span>
              </button>
            </div>
          )}

          {/* Chats Section */}
          {isOpen && (
            <div className="flex flex-col w-full flex-1 overflow-hidden px-2">
              <div className="w-full h-full flex flex-col">
                <button
                  onClick={() => setIsChatsExpanded(!isChatsExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-neutral-300/80 hover:text-white hover:bg-neutral-700/50 rounded-lg transition-all duration-200 flex-shrink-0"
                >
                  <span className="text-[16px] font-medium">Chats</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isChatsExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isChatsExpanded && (
                  <div className="mt-2 space-y-1 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Chat with AI Assistant
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Project Discussion
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Code Review Session
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Bug Investigation
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Feature Planning
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Documentation Review
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      API Integration Chat
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Database Design Discussion
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Bug Investigation
                    </div>
                    <div className="px-3 py-2 text-md text-neutral-300/95 hover:text-white hover:bg-neutral-700/30 rounded-lg cursor-pointer transition-all duration-150">
                      Feature Planning
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Profile (Fixed at bottom) */}
        {isOpen && (
          <div className="w-full border-t border-neutral-700/50 bg-neutral-800/50 relative">
            <div className="p-2">
              {/* Profile Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-rose-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm truncate">
                    Shubhankar Arun
                  </div>
                  <div className="text-neutral-400 text-xs truncate">
                    shubhankar@gemzy.ai
                  </div>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded transition-all duration-150">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-slate-900 border-neutral-700 shadow-lg"
                    side="top"
                    align="end"
                    sideOffset={12}
                    style={{
                      width: isOpen ? "260px" : "auto",
                      // marginRight: "15px",
                    }}
                  >
                    <DropdownMenuItem className="text-white hover:bg-neutral-700 cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-neutral-700 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
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
