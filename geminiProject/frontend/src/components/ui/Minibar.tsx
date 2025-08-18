import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageSquarePlus,
  Images,
  ChevronsUpDown,
} from "lucide-react";

export const MiniBar = ({
  setIsCollapsible,
  className,
}: {
  setIsCollapsible: (prev: boolean) => void;
  className?: string;
}) => {
  const [position, setPosition] = useState({ x: 56, y: 112 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const minibarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minibarWidth = 44;
    const minibarHeight = 384;

    const constrainedX = Math.max(
      0,
      Math.min(newX, viewportWidth - minibarWidth)
    );
    const constrainedY = Math.max(
      0,
      Math.min(newY, viewportHeight - minibarHeight)
    );

    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  return (
    <div
      ref={minibarRef}
      onMouseDown={handleMouseDown}
      className={`${className} w-11 h-96 absolute bg-gradient-to-b from-white/20 via-white/65 to-white/20 rounded-3xl cursor-move select-none ${
        isDragging ? "z-50" : "z-10"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        boxShadow:
          "0 15px 35px rgba(255, 255, 255, 0.12), " +
          "0 -15px 35px rgba(255, 255, 255, 0.12), " +
          "0 0 20px rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="w-full h-full flex flex-col ">
        <div className="flex flex-col rounded-3xl items-center h-full">
          <MessageSquarePlus className="flex-1 hover:bg-black/75 hover:scale-110 text-white p-2 rounded-3xl cursor-pointer w-10 h-10 transition-all ease-in-out " />
          <Search className="flex-1 hover:bg-black/75 hover:scale-110 text-white p-2 rounded-3xl cursor-pointer w-10 h-10 transition-all ease-in-out" />
          <ChevronsUpDown
            onClick={() => setIsCollapsible(false)}
            className="flex-1 hover:bg-black/75 hover:scale-110 text-white p-2 rounded-3xl cursor-pointer w-10 h-10 transition-all ease-in-out"
          />
          <Images className="flex-1 hover:bg-black/75 hover:scale-110 text-white p-2 rounded-3xl cursor-pointer w-10 h-10 transition-all ease-in-out" />
        </div>
      </div>
    </div>
  );
};
