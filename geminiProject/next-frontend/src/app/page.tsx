import { Sidebar } from "@/components/ui/Sidebar";
import { NavBar } from "@/components/ui/NavBar";
import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("@/components/ChatInterface"), {
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex h-screen items-center">
      <div>
        <Sidebar />
      </div>
      <div className="flex h-full w-full flex-1 flex-col items-center justify-between space-y-36 overflow-y-auto">
        <div className="w-full">
          <NavBar />
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}
