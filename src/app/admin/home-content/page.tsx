"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { adminToast } from "@/lib/admin-toast";
import { defaultHomeContent, parseMissionItems } from "@/lib/home-content";

type HomeContentForm = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  profileTitle: string;
  profileBody: string;
  profileBody2: string;
  visionTitle: string;
  visionBody: string;
  missionTitle: string;
  missionItems: string;
  extraTitle: string;
  extraBody: string;
};

const toFormState = (data: any): HomeContentForm => {
  const missionItems = parseMissionItems(data?.missionItems).join("\n");
  return {
    heroTitle: data?.heroTitle ?? defaultHomeContent.heroTitle,
    heroSubtitle: data?.heroSubtitle ?? defaultHomeContent.heroSubtitle,
    heroImageUrl: data?.heroImageUrl ?? defaultHomeContent.heroImageUrl,
    heroPrimaryLabel:
      data?.heroPrimaryLabel ?? defaultHomeContent.heroPrimaryLabel,
    heroPrimaryHref:
      data?.heroPrimaryHref ?? defaultHomeContent.heroPrimaryHref,
    heroSecondaryLabel:
      data?.heroSecondaryLabel ?? defaultHomeContent.heroSecondaryLabel,
    heroSecondaryHref:
      data?.heroSecondaryHref ?? defaultHomeContent.heroSecondaryHref,
    profileTitle: data?.profileTitle ?? defaultHomeContent.profileTitle,
    profileBody: data?.profileBody ?? defaultHomeContent.profileBody,
    profileBody2: data?.profileBody2 ?? defaultHomeContent.profileBody2,
    visionTitle: data?.visionTitle ?? defaultHomeContent.visionTitle,
    visionBody: data?.visionBody ?? defaultHomeContent.visionBody,
    missionTitle: data?.missionTitle ?? defaultHomeContent.missionTitle,
    missionItems,
    extraTitle: data?.extraTitle ?? defaultHomeContent.extraTitle,
    extraBody: data?.extraBody ?? defaultHomeContent.extraBody,
  };
};

export default function AdminHomeContent() {
  const [form, setForm] = useState<HomeContentForm>(
    toFormState(defaultHomeContent),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const heroFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/home-content");
        if (!res.ok) return;
        const data = await res.json();
        setForm(toFormState(data));
      } catch {
        adminToast.error("Gagal memuat konten beranda");
      }
    }

    fetchContent();
  }, []);

  const handleChange = (key: keyof HomeContentForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleHeroImageUpload = async (file?: File | null) => {
    if (!file) {
      adminToast.error("Pilih gambar terlebih dahulu.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      adminToast.error("File harus berupa gambar.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/hero-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        adminToast.error(data.error || "Gagal mengunggah gambar");
        return;
      }

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, heroImageUrl: data.url }));
        adminToast.success("Gambar hero diperbarui");
      }
    } catch {
      adminToast.error("Terjadi kesalahan saat mengunggah");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...form,
        missionItems: form.missionItems
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        adminToast.success("Konten beranda berhasil diperbarui");
      } else {
        const data = await res.json();
        adminToast.error(data.error || "Gagal menyimpan konten");
      }
    } catch {
      adminToast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Konten Beranda</h1>
        <p className="text-white/60 mt-2">
          Ubah profil singkat, visi &amp; misi, dan konten tambahan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-white/10 bg-slate-900/70 text-white">
          <CardHeader>
            <CardTitle>Hero</CardTitle>
            <CardDescription>
              Judul utama dan tombol CTA di atas beranda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Judul</Label>
              <Input
                id="heroTitle"
                value={form.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="heroSubtitle"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Subjudul
              </Label>
              <Textarea
                id="heroSubtitle"
                className="min-h-[120px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="heroImage"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Gambar Hero
              </Label>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                {form.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.heroImageUrl}
                    alt="Preview hero"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-40 w-full rounded-xl border border-dashed border-white/10 flex items-center justify-center text-sm text-white/50">
                    Belum ada gambar
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  ref={heroFileRef}
                  id="heroImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleHeroImageUpload(e.target.files?.[0] || null)
                  }
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  onClick={() => heroFileRef.current?.click()}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:opacity-90"
                >
                  {isUploading ? "Mengunggah..." : "Upload Gambar"}
                </Button>
                <span className="text-xs text-white/50">
                  Format: JPG, PNG, WebP, GIF
                </span>
              </div>
              {form.heroImageUrl ? (
                <p className="text-xs text-white/50">
                  URL saat ini: {form.heroImageUrl}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heroPrimaryLabel">Label Tombol Utama</Label>
                <Input
                  id="heroPrimaryLabel"
                  value={form.heroPrimaryLabel}
                  onChange={(e) =>
                    handleChange("heroPrimaryLabel", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroPrimaryHref">Link Tombol Utama</Label>
                <Input
                  id="heroPrimaryHref"
                  value={form.heroPrimaryHref}
                  onChange={(e) =>
                    handleChange("heroPrimaryHref", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heroSecondaryLabel">
                  Label Tombol Sekunder
                </Label>
                <Input
                  id="heroSecondaryLabel"
                  value={form.heroSecondaryLabel}
                  onChange={(e) =>
                    handleChange("heroSecondaryLabel", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSecondaryHref">Link Tombol Sekunder</Label>
                <Input
                  id="heroSecondaryHref"
                  value={form.heroSecondaryHref}
                  onChange={(e) =>
                    handleChange("heroSecondaryHref", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-400/20 bg-sky-500/10 text-white">
          <CardHeader>
            <CardTitle>Profil Singkat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileTitle">Judul</Label>
              <Input
                id="profileTitle"
                value={form.profileTitle}
                onChange={(e) => handleChange("profileTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="profileBody"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Paragraf 1
              </Label>
              <Textarea
                id="profileBody"
                className="min-h-[140px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.profileBody}
                onChange={(e) => handleChange("profileBody", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="profileBody2"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Paragraf 2
              </Label>
              <Textarea
                id="profileBody2"
                className="min-h-[140px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.profileBody2}
                onChange={(e) => handleChange("profileBody2", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-400/20 bg-amber-500/10 text-white">
          <CardHeader>
            <CardTitle>Visi &amp; Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visionTitle">Judul Visi</Label>
              <Input
                id="visionTitle"
                value={form.visionTitle}
                onChange={(e) => handleChange("visionTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="visionBody"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Isi Visi
              </Label>
              <Textarea
                id="visionBody"
                className="min-h-[120px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.visionBody}
                onChange={(e) => handleChange("visionBody", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="missionTitle">Judul Misi</Label>
              <Input
                id="missionTitle"
                value={form.missionTitle}
                onChange={(e) => handleChange("missionTitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="missionItems"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Daftar Misi (1 baris = 1 poin)
              </Label>
              <Textarea
                id="missionItems"
                className="min-h-[160px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.missionItems}
                onChange={(e) => handleChange("missionItems", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-400/20 bg-emerald-500/10 text-white">
          <CardHeader>
            <CardTitle>Konten Tambahan</CardTitle>
            <CardDescription>
              Gunakan bagian ini untuk menambahkan konten baru di beranda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extraTitle">Judul</Label>
              <Input
                id="extraTitle"
                value={form.extraTitle}
                onChange={(e) => handleChange("extraTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="extraBody"
                className="inline-flex w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
              >
                Isi Konten
              </Label>
              <Textarea
                id="extraBody"
                className="min-h-[140px] bg-slate-900/60 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                value={form.extraBody}
                onChange={(e) => handleChange("extraBody", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full md:w-auto bg-gradient-to-r from-emerald-400 via-green-500 to-lime-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
