"use client";
import { useState } from "react";
import { searchVehicle, createReceptionJob } from "./actions";

export default function ReceptionPage() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber) return;
    setIsSearching(true);
    const result = await searchVehicle(vehicleNumber);
    setVehicle(result);
    setSearched(true);
    // If vehicle exists, we default to its existing customer
    setIsNewCustomer(!result);
    setIsSearching(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">New Reception</h1>
        <p className="text-slate-400 mb-6">Log a new vehicle entry and generate a job estimate.</p>

        {/* Step 1: Search Vehicle */}
        <form onSubmit={handleSearch} className="flex gap-4 items-end mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 block">Search Vehicle Number</label>
            <input 
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. MH12AB1234" 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 font-mono text-lg tracking-wider" 
            />
          </div>
          <button type="submit" disabled={isSearching} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 h-[50px]">
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Step 2: Details & Create Job */}
        {searched && (
          <form action={createReceptionJob} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <input type="hidden" name="vehicleNumber" value={vehicleNumber} />
            <input type="hidden" name="isNewCustomer" value={isNewCustomer.toString()} />
            {vehicle?.customer && !isNewCustomer && (
              <input type="hidden" name="customerId" value={vehicle.customer.id} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vehicle Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-200 border-b border-white/10 pb-2">Vehicle Details</h2>
                {vehicle ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                    <p className="text-sm text-emerald-400 font-medium mb-1">Found Existing Vehicle</p>
                    <p className="font-mono text-lg text-white">{vehicle.vehicleNumber}</p>
                    <p className="text-slate-400">{vehicle.brand} {vehicle.model} ({vehicle.vehicleType})</p>
                    
                    {/* Send hidden fields if vehicle exists */}
                    <input type="hidden" name="brand" value={vehicle.brand} />
                    <input type="hidden" name="model" value={vehicle.model} />
                    <input type="hidden" name="vehicleType" value={vehicle.vehicleType} />
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-amber-400 font-medium mb-1">New Vehicle Registration</p>
                    <div className="flex gap-2">
                      <input name="brand" required placeholder="Brand (e.g. Toyota)" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                      <input name="model" required placeholder="Model (e.g. Corolla)" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                    </div>
                    <input name="vehicleType" required placeholder="Type (e.g. SUV, Sedan)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                  </div>
                )}
              </div>

              {/* Customer Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-slate-200">Customer Details</h2>
                  {vehicle?.customer && (
                    <button type="button" onClick={() => setIsNewCustomer(!isNewCustomer)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      {isNewCustomer ? "Use Existing Customer" : "Different Owner? Create New"}
                    </button>
                  )}
                </div>

                {!isNewCustomer && vehicle?.customer ? (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-400 font-medium mb-1">Previous Owner Linked</p>
                    <p className="text-lg text-white font-medium">{vehicle.customer.name}</p>
                    <p className="text-slate-400">{vehicle.customer.phone}</p>
                    <p className="text-slate-500 text-sm mt-1">{vehicle.customer.address}</p>
                  </div>
                ) : (
                  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-slate-400 font-medium mb-1">Enter Customer Details</p>
                    <input name="customerName" required placeholder="Full Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                    <input name="customerPhone" required placeholder="Phone Number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                    <input name="customerAddress" required placeholder="Home Address" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Problem & Create Job */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xl font-semibold text-slate-200">Problem Description</h2>
              <textarea 
                name="problemDescription" 
                required 
                rows={4}
                placeholder="What exactly is the issue? (e.g. Engine making knocking sounds, brakes lacking responsiveness...)" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Create Job & Estimate Build
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
