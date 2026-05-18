export default function Home() {
  return (
    <div className="w-full max-w-4xl backdrop-blur-md bg-white/10 dark:bg-black/20 p-8 rounded-2xl shadow-2xl border border-white/20">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
        Garage Management System
      </h1>
      <p className="text-lg opacity-80 mb-8">
        Manage your customers, vehicles, and services easily.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Vehicles', 'Services'].map((item) => (
          <div key={item} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">{item}</h2>
            <p className="opacity-70 text-sm">View and manage {item.toLowerCase()} records.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
