export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-400 font-medium animate-pulse">Loading data...</p>
    </div>
  );
}
