import { Navbar, AdminLoginFab } from "@/components/LayoutBlocks";
import MobileBottomNav from "@/components/MobileBottomNav";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export default async function GalleryPage() {
  const gallery = await db
    .select()
    .from(photos)
    .orderBy(desc(photos.createdAt));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white theme-dark">
      <Navbar variant="dark" />
      <main className="flex-1 py-12 pb-24 sm:pb-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Galeri Kegiatan
            </h1>
            <p className="text-lg text-white/70">
              Dokumentasi berbagai momen berharga dan kegiatan di lingkungan
              sekolah.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden group border border-white/10 bg-white/5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium text-sm truncate">
                      {photo.title}
                    </p>
                    <p className="text-white/80 text-xs mt-1">
                      {photo.createdAt
                        ? new Date(photo.createdAt).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {gallery.length === 0 && (
            <div className="text-center py-20 text-white/60 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
              <ImageIcon className="h-16 w-16 mx-auto opacity-20 mb-4" />
              <p>Belum ada foto di galeri saat ini.</p>
            </div>
          )}
        </div>
      </main>
      <MobileBottomNav />
      <AdminLoginFab />
    </div>
  );
}
