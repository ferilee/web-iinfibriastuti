import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type NavProps = {
  variant?: "light" | "dark";
};

export function Navbar({ variant = "light" }: NavProps) {
  const isDark = variant === "dark";
  const headerClass = isDark
    ? "bg-slate-950/70 border-white/10 text-white"
    : "bg-white/80 border-b text-slate-900";
  const linkClass = isDark
    ? "text-sm font-medium text-white/70 hover:text-white transition-colors"
    : "text-sm font-medium hover:text-primary transition-colors";
  const brandClass = isDark
    ? "font-bold text-xl tracking-tight text-white"
    : "font-bold text-xl tracking-tight";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${headerClass}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between pointer-events-auto">
        <Link href="/" className={brandClass}>
          Iin Fibriastuti
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className={linkClass}>
            Beranda
          </Link>
          <Link href="/blog" className={linkClass}>
            Artikel & Opini
          </Link>
          <Link href="/gallery" className={linkClass}>
            Galeri
          </Link>
          <Link href="/contact" className={linkClass}>
            Kontak
          </Link>
          <Link
            href="/admin/login"
            className={`${linkClass} rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide hover:border-white/40`}
          >
            Login Admin
          </Link>
        </nav>
        {/* Mobile menu could be added here later */}
      </div>
    </header>
  );
}

export function Footer({ variant = "light" }: NavProps) {
  const isDark = variant === "dark";
  const wrapperClass = isDark
    ? "bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-white/10"
    : "border-t bg-gray-50 text-slate-900";
  const mutedClass = isDark ? "text-white/70" : "text-muted-foreground";

  return (
    <footer className={`border-t py-12 px-4 mt-auto ${wrapperClass}`}>
      <div className="container mx-auto grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-lg mb-4">Iin Fibriastuti</h3>
          <p className={`${mutedClass} text-sm`}>
            Mendedikasikan diri untuk kemajuan pendidikan dan penciptaan
            lingkungan belajar yang inspiratif.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
          <ul className={`space-y-2 text-sm ${mutedClass}`}>
            <li>
              <Link href="/" className="hover:text-primary">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary">
                Artikel & Opini
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-primary">
                Galeri
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Kontak
              </Link>
            </li>
          </ul>
        </div>
        <div />
      </div>
      <div
        className={`container mx-auto mt-12 pt-8 border-t text-center text-sm items-center ${
          isDark ? "border-white/10 text-white/60" : "text-muted-foreground"
        }`}
      >
        <p>
          &copy; {new Date().getFullYear()} Iin Fibriastuti. Semua hak cipta
          dilindungi.
        </p>
      </div>
    </footer>
  );
}

export function AdminLoginFab() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="md:hidden fixed bottom-24 right-4 z-40 h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
          aria-label="Login admin"
        >
          <Plus className="mx-auto h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Login Admin</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Masuk ke dashboard admin untuk mengelola konten.
        </p>
        <div className="pt-3">
          <Button asChild className="w-full">
            <Link href="/admin/login">Login Admin</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
