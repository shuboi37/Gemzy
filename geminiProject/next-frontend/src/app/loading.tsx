export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="text-white text-lg">Loading Gemzy...</p>
      </div>
    </div>
  );
}
