import { useState } from "react";
import LogoSVG from "./LogoSVG";
import { MiniBar } from "./Minibar";
import { PanelRightClose, PanelLeftClose, ChevronsDownUp } from "lucide-react";
export const Sidebar = () => {
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);
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
        isOpen ? "w-68" : "w-14 cursor-e-resize"
      } h-screen relative bg-neutral-900/85`}
    >
      <div className="flex flex-col h-full items-center">
        <div className="flex items-center gap-28 w-full h-20 p-2">
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
      </div>
    </div>
  ) : (
<MiniBar/>  );
};
