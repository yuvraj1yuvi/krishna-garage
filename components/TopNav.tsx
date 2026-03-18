export default function TopNav() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 md:hidden">
      <div className="font-bold text-xl tracking-tighter text-white">
        <span className="text-primary">Garage</span>Manager
      </div>
      <button className="text-slate-300 hover:text-white p-2">
        Menu
      </button>
    </header>
  );
}
