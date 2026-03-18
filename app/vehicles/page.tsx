export default function VehiclesPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent">Vehicles</h1>
          <p className="text-slate-400 mt-1">Manage vehicles registered in the system.</p>
        </div>
        <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)]">
          + Add Vehicle
        </button>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-4 font-semibold">Plate #</th>
              <th className="p-4 font-semibold">Brand & Model</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Customer ID</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 font-medium text-slate-200">MH12 AB {1000 + i}</td>
                <td className="p-4 text-slate-400">Toyota Corolla</td>
                <td className="p-4 text-slate-400">SUV</td>
                <td className="p-4 text-slate-400">Customer {i}</td>
                <td className="p-4 text-right">
                  <button className="text-secondary hover:text-white transition-colors text-sm font-medium mr-3">Edit</button>
                  <button className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
