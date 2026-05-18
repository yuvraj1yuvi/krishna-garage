import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { addServicePart, removeServicePart, updateServiceStatus } from "./actions";
import Link from "next/link";

export default async function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const serviceId = parseInt(params.id);
  if (isNaN(serviceId)) return notFound();

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      customer: true,
      vehicle: true,
      parts: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!service) return notFound();

  const totalCalculatedCost = service.parts.reduce((total: any, part: any) => total + (Number(part.price) * part.quantity), 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/services" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
        ← Back to Services
      </Link>

      <div className="flex justify-between items-start bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent mb-1">
            Job #{service.id}
          </h1>
          <div className="text-slate-400 flex items-center gap-3">
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-mono">{service.vehicle.vehicleNumber}</span>
            <span>{service.customer.name}</span>
          </div>
        </div>
        
        <form action={updateServiceStatus} className="flex flex-col items-end gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
          <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Status</label>
          <input type="hidden" name="serviceId" value={service.id} />
          <div className="flex gap-2 items-center">
            <select name="status" defaultValue={service.status} className="bg-slate-900 border border-slate-700 text-sm rounded-lg p-2 text-white focus:border-accent outline-none">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress (Repairing)</option>
              <option value="COMPLETED">Completed (Ready)</option>
              <option value="DELIVERED">Delivered</option>
            </select>
            <button type="submit" className="bg-accent hover:bg-accent/90 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors">
              Update
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Details */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Problem Description</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{service.problemDescription}</p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Date Logged</span> <span className="text-slate-300">{new Date(service.serviceDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Vehicle</span> <span className="text-slate-300">{service.vehicle.brand} {service.vehicle.model} ({service.vehicle.vehicleType})</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Customer Phone</span> <span className="text-slate-300">{service.customer.phone}</span></div>
            </div>
          </div>
        </div>

        {/* Right Col: Parts Estimate & Cart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-white">Parts Estimate & Budget</h2>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Cost</p>
                <p className="text-2xl font-mono text-emerald-400">${totalCalculatedCost.toFixed(2)}</p>
              </div>
            </div>

            {/* List Parts */}
            <div className="space-y-3 mb-6">
              {service.parts.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No parts added to this job yet.</p>
              ) : (
                service.parts.map((part: any) => (
                  <div key={part.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 group">
                    <div>
                      <p className="text-slate-200 font-medium">{part.partName}</p>
                      <p className="text-xs text-slate-500">{part.quantity} x ${Number(part.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-white font-mono">${(part.quantity * Number(part.price)).toFixed(2)}</p>
                      <form action={removeServicePart}>
                        <input type="hidden" name="serviceId" value={service.id} />
                        <input type="hidden" name="partId" value={part.id} />
                        <button className="text-red-400 hover:text-red-300 p-2 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Part Form */}
            <form action={addServicePart} className="flex gap-2 items-end bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <input type="hidden" name="serviceId" value={service.id} />
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Part / Labor Name</label>
                <input name="partName" required placeholder="e.g. Brake Pads" className="w-full bg-slate-800 border-none rounded p-2 text-white text-sm focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div className="w-20">
                <label className="text-xs text-slate-400 mb-1 block">Qty</label>
                <input type="number" name="quantity" required defaultValue={1} min={1} className="w-full bg-slate-800 border-none rounded p-2 text-white text-sm text-center focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div className="w-24">
                <label className="text-xs text-slate-400 mb-1 block">Price</label>
                <input type="number" step="0.01" name="price" required placeholder="0.00" className="w-full bg-slate-800 border-none rounded p-2 text-white text-sm focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-white text-sm font-medium transition-colors h-[36px]">
                Add
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
