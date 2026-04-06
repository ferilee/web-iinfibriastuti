"use client";

import { useState } from "react";
import { Navbar, AdminLoginFab } from "@/components/LayoutBlocks";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successToastDurationMs = 4000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.custom(
          () => (
            <div
              className="w-[320px] rounded-2xl border border-white/10 bg-slate-900/95 px-5 py-4 text-white shadow-xl"
              style={
                {
                  "--toast-duration": `${successToastDurationMs}ms`,
                } as React.CSSProperties
              }
            >
              <p className="text-sm font-semibold">
                Pesan Anda berhasil dikirim
              </p>
              <p className="text-sm text-white/70 mt-1">
                Terima kasih. Kami akan segera merespons.
              </p>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="toast-progress h-full w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" />
              </div>
            </div>
          ),
          { duration: successToastDurationMs },
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Gagal mengirim pesan.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white theme-dark">
      <Navbar variant="dark" />
      <main className="flex-1 py-12 pb-24 sm:pb-0">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Hubungi Saya
            </h1>
            <p className="text-lg text-white/70">
              Saya senang mendengar dari Anda. Silakan tinggalkan pesan melalui
              formulir di bawah ini.
            </p>
          </header>

          <div className="grid md:grid-cols-[1fr_2fr] gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border border-white/10 bg-white/5 shadow-sm h-full max-h-fit text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-white/70">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-300 flex-shrink-0" />
                    <p>
                      SMPN 2 Temanggung
                      <br />
                      Jalan Pendidikan No.1
                      <br />
                      Temanggung, Jawa Tengah
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-blue-300 flex-shrink-0" />
                    <p>info@iinfibriastuti.com</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-blue-300 flex-shrink-0" />
                    <p>+62 XXX XXXXXXX</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="shadow-md border border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription className="text-white/60">
                  Pesan Anda akan langsung masuk ke kotak masuk (inbox) di
                  dashboard admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80">
                        Nama Lengkap
                      </Label>
                      <Input
                        id="name"
                        placeholder="Budi Santoso"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="budi@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">
                      Pesan Anda
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                      className="min-h-[150px]"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan Sekarang"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MobileBottomNav />
      <AdminLoginFab />
    </div>
  );
}
