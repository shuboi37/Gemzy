import { Share2 } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="h-14 overflow-hidden border-b-[1px] bg-transparent">
      <div className="flex w-full items-center py-4 px-3 h-full relative">
        <button className="bg-transparent rounded-lg justify-center p-3 items-center flex space-x-[6px] absolute right-8 hover:bg-neutral-700 active:scale-95 transition-all ease-in-out duration-200 active:duration-75">
          <Share2 className="w-4 h-4 text-white" />
          <span className="text-white font-semibold tracking-wide text-pretty whitespace-nowrap">
            Share
          </span>
        </button>
      </div>
    </div>
  );
};
