import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Pagination from "@/components/Pagination";
export const dynamic = 'force-dynamic';

export default async function ServicesPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
  const searchQuery = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const whereClause = {
    vehicle: { vehicleNumber: { contains: searchQuery, mode: 'insensitive' } }
  };

  const totalItems = await prisma.service.count({ where: whereClause as any });
  const totalPages = Math.ceil(totalItems / pageSize);

  const services = await prisma.service.findMany({
    where: whereClause as any,
    include: { customer: true, vehicle: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });



  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent mb-4">Service Records</h1>
        

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
            {services.map((s: any) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-slate-400">{new Date(s.serviceDate).toLocaleDateString()}</td>
                <td className="p-4 font-medium text-slate-200">{s.vehicle.vehicleNumber}</td>
                <td className="p-4 text-slate-400 truncate max-w-[150px]">{s.problemDescription}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border
                    ${s.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : ''}
                    ${s.status === 'IN_PROGRESS' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' : ''}
                    ${s.status === 'COMPLETED' ? 'border-green-500/50 text-green-500 bg-green-500/10' : ''}
                    ${s.status === 'DELIVERED' ? 'border-purple-500/50 text-purple-500 bg-purple-500/10' : ''}
                  `}>
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono">${Number(s.totalCost || 0).toFixed(2)}</td>
                <td className="p-4 text-right flex justify-end items-center gap-2">
                  <Link href={`/services/${s.id}`} className="text-accent hover:text-white transition-colors text-sm font-medium border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10">View Job</Link>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
               <tr>
                 <td colSpan={6} className="p-8 text-center text-slate-500">No service jobs created.</td>
               </tr>
            )}
          </tbody>
        </table>

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          basePath="/services" 
          searchQuery={searchQuery} 
        />
      </div>
    </div>
  );
}
