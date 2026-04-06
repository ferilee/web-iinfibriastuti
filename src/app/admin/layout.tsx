"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminToast } from "@/lib/admin-toast";
import Link from "next/link";
import AdminBottomNav, { adminNavItems } from "@/components/AdminBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        adminToast.success("Logged out successfully");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      adminToast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold">Iin Fibriastuti Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-slate-900/70 backdrop-blur flex items-center px-6 md:hidden">
          <h2 className="font-semibold">Iin Fibriastuti Admin</h2>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8 pb-24 sm:pb-8">
          {children}
        </div>
        <AdminBottomNav />
      </main>
    </div>
  );
}
