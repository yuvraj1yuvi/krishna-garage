import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Pagination from "@/components/Pagination";
export const dynamic = 'force-dynamic';

export default async function CustomersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const totalItems = await prisma.customer.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  async function addCustomer(formData: FormData) {
    "use server";
    
    // In a real app we would use a user ID from session. Hardcoding 1 for MVP.
    const createdBy = 1;

    // Check if the placeholder user 1 exists, if not create it
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: { 
        id: 1, 
        name: 'Admin', 
        email: 'admin@garage.local', 
        password: 'password123' 
      }
    });

    await prisma.customer.create({
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        createdBy: user.id,
        updatedBy: user.id,
      }
    });

    revalidatePath("/customers");
  }

  async function deleteCustomer(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await prisma.customer.delete({ where: { id } });
    revalidatePath("/customers");
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">Customers</h1>
        
        {/* Simple Add Form */}
        <form action={addCustomer} className="flex flex-col md:flex-row gap-4 items-end bg-black/20 p-4 rounded-xl border border-white/5">
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
            <input name="name" required placeholder="John Doe" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 mb-1 block">Phone</label>
            <input name="phone" required placeholder="123-456-7890" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 mb-1 block">Address</label>
            <input name="address" required placeholder="123 Main St" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors md:w-auto w-full">
            Add
          </button>
        </form>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-300">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c: any) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 font-medium text-slate-200">{c.name}</td>
                <td className="p-4 text-slate-400">{c.phone}</td>
                <td className="p-4 text-slate-400">{c.address}</td>
                <td className="p-4 text-right">
                  <form action={deleteCustomer}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-slate-500">No customers found. Add your first one above!</td>
               </tr>
            )}
          </tbody>
        </table>

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          basePath="/customers" 
        />
      </div>
    </div>
  );
}
