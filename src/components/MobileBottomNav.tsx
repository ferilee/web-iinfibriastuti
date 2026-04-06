"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Image as ImageIcon, Mail, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/blog", label: "Artikel", icon: FileText },
  { href: "/gallery", label: "Galeri", icon: ImageIcon },
  { href: "/contact", label: "Kontak", icon: Mail },
  { href: "/#profile", label: "Profil", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-4 left-1/2 z-40 w-[92%] -translate-x-1/2">
      <div className="relative rounded-[28px] bg-slate-900/90 text-white shadow-2xl backdrop-blur-md border border-white/10">
        <div className="grid grid-cols-5 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
