import Link from "next/link";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath, 
  searchQuery = "" 
}: { 
  currentPage: number, 
  totalPages: number, 
  basePath: string, 
  searchQuery?: string 
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (searchQuery) params.set("q", searchQuery);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={buildUrl(Math.max(1, currentPage - 1))}
          className={`relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Previous
        </Link>
        <Link
          href={buildUrl(Math.min(totalPages, currentPage + 1))}
          className={`relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Showing Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link
              href={buildUrl(Math.max(1, currentPage - 1))}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </Link>
            
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i + 1}
                href={buildUrl(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-white/10 ${currentPage === i + 1 ? 'z-10 bg-primary/20 text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
              >
                {i + 1}
              </Link>
            ))}

            <Link
              href={buildUrl(Math.min(totalPages, currentPage + 1))}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
