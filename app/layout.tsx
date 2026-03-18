import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garage Management System",
  description: "Manage customers, vehicles, and services.",
};

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans text-slate-300 bg-[#0B1120] flex h-screen overflow-hidden">
        <Sidebar  />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
