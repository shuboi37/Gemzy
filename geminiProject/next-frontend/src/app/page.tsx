import { Sidebar } from "../../components/ui/Sidebar";
import { NavBar } from "../../components/ui/NavBar";
import dynamic from "next/dynamic";

// Lazy load the chat interface to reduce initial bundle size
const ChatInterface = dynamic(() => import("../../components/ChatInterface"), {
  loading: () => (
    <div className="flex items-center justify-center w-full h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex h-screen items-center">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-1 w-full flex-col h-full space-y-32 items-center justify-between overflow-y-auto">
        <div className="w-full">
          <NavBar />
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}
