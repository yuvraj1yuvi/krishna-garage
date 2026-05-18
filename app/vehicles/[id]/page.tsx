import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);
  if (isNaN(vehicleId)) return notFound();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      customer: true,
      services: {
        where: { status: 'DELIVERED' },
        orderBy: { deliveredAt: 'desc' },
        include: { parts: true }
      }
    }
  });

  if (!vehicle) return notFound();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/vehicles" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
        ← Back to Vehicles Lookup
      </Link>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent mb-1">
          {vehicle.vehicleNumber} - Service History
        </h1>
        <div className="text-slate-400 flex items-center gap-3">
          <span>{vehicle.brand} {vehicle.model} ({vehicle.vehicleType})</span>
          <span>•</span>
          <span>Owner: {vehicle.customer?.name || "Unknown"}</span>
        </div>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Delivered Records</h2>
          <p className="text-sm text-slate-400">Past completed and returned jobs for this vehicle, sorted by date.</p>
        </div>

        {vehicle.services.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No delivered service records found for this vehicle.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {vehicle.services.map((service: any) => {
               const total = service.parts.reduce((acc: any, part: any) => acc + (Number(part.price) * part.quantity), 0);

               return (
                 <div key={service.id} className="p-6 hover:bg-white/5 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-lg font-medium text-slate-200">
                         {service.deliveredAt ? new Date(service.deliveredAt).toLocaleDateString() : new Date(service.createdAt).toLocaleDateString()}
                       </h3>
                       <p className="text-slate-400 mt-1 max-w-xl">{service.problemDescription}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Billed</p>
                        <p className="text-xl font-mono text-emerald-400">${total.toFixed(2)}</p>
                     </div>
                   </div>
                   
                   <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                     <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Parts & Labor Breakdown</p>
                     {service.parts.length === 0 ? (
                       <p className="text-sm text-slate-500">No parts recorded.</p>
                     ) : (
                       <ul className="space-y-1">
                         {service.parts.map((part: any) => (
                           <li key={part.id} className="text-sm flex justify-between text-slate-300">
                             <span>{part.quantity}x {part.partName}</span>
                             <span className="font-mono text-slate-400">${(part.quantity * Number(part.price)).toFixed(2)}</span>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 </div>
               )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
