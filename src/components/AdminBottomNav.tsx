"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Image,
  Mail,
  Settings,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/home-content", label: "Konten", icon: Settings },
  { href: "/admin/articles", label: "Artikel", icon: FileText },
  { href: "/admin/gallery", label: "Galeri", icon: Image },
  { href: "/admin/inbox", label: "Inbox", icon: Mail },
  { href: "/admin/comments", label: "Komentar", icon: MessageCircle },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

const primaryNavItems = adminNavItems.slice(0, 4);

const moreNavItems = adminNavItems.slice(4);

export default function AdminBottomNav() {
  const pathname = usePathname();
  const isMoreActive = moreNavItems.some((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <nav className="sm:hidden fixed bottom-4 left-1/2 z-40 w-[92%] -translate-x-1/2">
      <div className="relative rounded-[28px] bg-slate-900/90 text-white shadow-2xl backdrop-blur-md border border-white/10">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${
                  isActive ? "text-blue-300" : "text-white/60"
                }`}
              >
                {isActive ? (
                  <span className="absolute inset-x-2 -top-1 h-1 rounded-full bg-blue-400/80" />
                ) : null}
                <Icon size={20} />
                <span className="text-center">{item.label}</span>
              </Link>
            );
          })}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${
                  isMoreActive ? "text-blue-300" : "text-white/60"
                }`}
              >
                {isMoreActive ? (
                  <span className="absolute inset-x-2 -top-1 h-1 rounded-full bg-blue-400/80" />
                ) : null}
                <MoreHorizontal size={20} />
                <span className="text-center">More</span>
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="bottom-0 left-1/2 top-auto w-full max-w-[calc(100%-2rem)] -translate-x-1/2 translate-y-0 rounded-b-none rounded-t-3xl bg-slate-900 text-white pb-6 pt-4 ring-1 ring-white/10 data-open:slide-in-from-bottom-8 data-closed:slide-out-to-bottom-8"
            >
              <DialogHeader className="pb-2">
                <DialogTitle>Menu Lainnya</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        isActive
                          ? "border-blue-400/40 bg-blue-500/10 text-blue-300"
                          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
