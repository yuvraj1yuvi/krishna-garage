import prisma from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/components/Pagination";
export const dynamic = 'force-dynamic';

export default async function VehiclesPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
  const searchQuery = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const totalItems = await prisma.vehicle.count({
    where: { vehicleNumber: { contains: searchQuery, mode: 'insensitive' } }
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const vehicles = await prisma.vehicle.findMany({
    where: {
      vehicleNumber: { contains: searchQuery, mode: 'insensitive' }
    },
    include: { 
      customer: true,
      services: { include: { parts: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent mb-1">Vehicle Records & Bills</h1>
            <p className="text-slate-400 text-sm">Search for a vehicle to view its past service history and total billing.</p>
          </div>
          
          {/* Search Form */}
          <form method="GET" className="flex items-center gap-2">
            <input 
               name="q" 
               defaultValue={searchQuery}
               placeholder="Search Plate #" 
               className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-secondary" 
            />
            <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors border border-slate-600">
              Search
            </button>
            {searchQuery && (
              <a href="/vehicles" className="text-xs text-slate-400 hover:text-white px-2">Clear</a>
            )}
          </form>
        </div>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-4 font-semibold">Plate #</th>
              <th className="p-4 font-semibold">Owner Info</th>
              <th className="p-4 font-semibold">Service History</th>
              <th className="p-4 font-semibold">Total Bills</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vehicles.map((v: any) => {
              // Calculate total bills for this vehicle based on its past services
              const totalBilled = v.services.reduce((total: number, service: any) => {
                const serviceTotal = service.parts.reduce((pt: number, part: any) => pt + (Number(part.price) * part.quantity), 0);
                return total + serviceTotal;
              }, 0);

              const completedJobs = v.services.filter((s:any) => s.status === 'COMPLETED' || s.status === 'DELIVERED').length;

              return (
                <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <p className="font-medium text-slate-200 text-lg">{v.vehicleNumber}</p>
                    <p className="text-xs text-slate-500">{v.brand} {v.model}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-300">{v.customer?.name || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{v.customer?.phone || ""}</p>
                  </td>
                  <td className="p-4 text-slate-400">
                    {v.services.length === 0 ? "No records" : `${v.services.length} Jobs (${completedJobs} Completed)`}
                  </td>
                  <td className="p-4 text-emerald-400 font-mono font-medium">
                    ${totalBilled.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/vehicles/${v.id}`} className="text-secondary hover:text-white transition-colors text-sm font-medium border border-secondary/50 px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/30">
                      View Service Records
                    </Link>
                  </td>
                </tr>
              )
            })}
            {vehicles.length === 0 && (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-slate-500">No vehicle records found.</td>
               </tr>
            )}
          </tbody>
        </table>
        
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          basePath="/vehicles" 
          searchQuery={searchQuery} 
        />
      </div>
    </div>
  );
}
