"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type MobileIntroProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  imageSrc: string;
};

export default function MobileIntro({
  title,
  subtitle,
  buttonLabel,
  imageSrc,
}: MobileIntroProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("mobileIntroDismissed");
    if (dismissed === "true") {
      setShowIntro(false);
    }
  }, []);

  const handleDismiss = () => {
    window.localStorage.setItem("mobileIntroDismissed", "true");
    setShowIntro(false);
    const target = document.getElementById("home-main");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!showIntro) return null;

  return (
    <section className="sm:hidden fixed inset-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>
      <div className="relative h-full w-full px-6 pb-10 pt-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-white/5">
              <img
                src={imageSrc}
                alt="Ilustrasi hero"
                className="h-[360px] w-full object-cover"
              />
            </div>
            <h1 className="mt-6 text-2xl font-semibold leading-tight">{title}</h1>
            <p className="mt-3 text-sm text-white/80">{subtitle}</p>
          </div>
        </div>
        <Button
          size="lg"
          className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleDismiss}
        >
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
