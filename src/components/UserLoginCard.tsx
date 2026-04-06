"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function UserLoginCard() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthed = status === "authenticated";

  if (isLoading) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
        <p className="text-sm font-semibold text-white">Login User</p>
        <p className="text-sm text-white/70 mt-1">Memuat status login...</p>
      </div>
    );
  }

  if (isAuthed) {
    const label =
      session?.user?.name || session?.user?.email || "Pengguna";
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
        <p className="text-sm font-semibold text-white">Login User</p>
        <p className="text-sm text-white/70 mt-1">
          Berhasil login sebagai {label}.
        </p>
        <div className="mt-3">
          <Button
            size="sm"
            className="rounded-full bg-white text-slate-900 shadow-md shadow-white/20 hover:bg-white/90"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-sm font-semibold text-white">Login User</p>
      <p className="text-sm text-white/70 mt-1">
        Gunakan akun Google untuk pengalaman yang lebih personal.
      </p>
      <div className="mt-3">
        <Button
          size="sm"
          className="rounded-full bg-white text-slate-900 shadow-md shadow-white/20 hover:bg-white/90"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Login dengan Google
        </Button>
      </div>
    </div>
  );
}
