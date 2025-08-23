export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
        <p className="text-lg text-white">Loading Gemzy...</p>
      </div>
    </div>
  );
}
