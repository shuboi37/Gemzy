import {
  Search,
  MessageSquarePlus,
  Images,
  ChevronsUpDown,
} from "lucide-react";
export const MiniBar = ({
  setIsCollapsible,
}: {
  setIsCollapsible: (prev: boolean) => void;
}) => {
  return (
    <div
      className="w-11 h-96 bg-gradient-to-b from-white/20 via-white/65 to-white/20 ml-14 mt-32 rounded-3xl "
      style={{
        boxShadow:
          "0 15px 35px rgba(255, 255, 255, 0.12), " +
          "0 -15px 35px rgba(255, 255, 255, 0.12), " +
          "0 0 20px rgba(255, 255, 255, 0.08)",
      }}
    >
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
  );
};
