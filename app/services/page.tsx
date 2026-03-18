export default function ServicesPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent">Service Records</h1>
          <p className="text-slate-400 mt-1">Track repairs, maintenance, and service jobs.</p>
        </div>
        <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          + New Service Job
        </button>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Vehicle</th>
              <th className="p-4 font-semibold">Problem</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Cost</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-slate-400">Oct 24, 2023</td>
                <td className="p-4 font-medium text-slate-200">MH12 AB 1234</td>
                <td className="p-4 text-slate-400 truncate max-w-[150px]">Engine noise...</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border
                    ${status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : ''}
                    ${status === 'IN_PROGRESS' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' : ''}
                    ${status === 'COMPLETED' ? 'border-green-500/50 text-green-500 bg-green-500/10' : ''}
                  `}>
                    {status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono">$150.00</td>
                <td className="p-4 text-right">
                  <button className="text-accent hover:text-white transition-colors text-sm font-medium mr-3">View</button>
                  <button className="text-primary hover:text-white transition-colors text-sm font-medium">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
