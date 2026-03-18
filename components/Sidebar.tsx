import Link from 'next/link';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', href: '/' },
    { name: 'Customers', href: '/customers' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'Services', href: '/services' },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6 font-bold text-2xl tracking-tighter text-white">
        <span className="text-primary">Garage</span>Manager
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-500 text-center">
        v1.0.0
      </div>
    </div>
  );
}
