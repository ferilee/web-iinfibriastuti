import { Navbar, AdminLoginFab } from "@/components/LayoutBlocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/db";
import { homeContent } from "@/db/schema";
import { desc } from "drizzle-orm";
import { normalizeHomeContent, parseMissionItems } from "@/lib/home-content";
import MobileIntro from "@/components/MobileIntro";
import MobileBottomNav from "@/components/MobileBottomNav";
import UserLoginCard from "@/components/UserLoginCard";

export default async function Home() {
  let content = normalizeHomeContent();
  try {
    const [row] = await db
      .select()
      .from(homeContent)
      .orderBy(desc(homeContent.id))
      .limit(1);
    content = normalizeHomeContent(
      row
        ? {
            heroTitle: row.heroTitle || undefined,
            heroSubtitle: row.heroSubtitle || undefined,
            heroImageUrl: row.heroImageUrl || undefined,
            heroPrimaryLabel: row.heroPrimaryLabel || undefined,
            heroPrimaryHref: row.heroPrimaryHref || undefined,
            heroSecondaryLabel: row.heroSecondaryLabel || undefined,
            heroSecondaryHref: row.heroSecondaryHref || undefined,
            profileTitle: row.profileTitle || undefined,
            profileBody: row.profileBody || undefined,
            profileBody2: row.profileBody2 || undefined,
            visionTitle: row.visionTitle || undefined,
            visionBody: row.visionBody || undefined,
            missionTitle: row.missionTitle || undefined,
            missionItems: parseMissionItems(row.missionItems),
            extraTitle: row.extraTitle || undefined,
            extraBody: row.extraBody || undefined,
          }
        : undefined,
    );
  } catch {
    content = normalizeHomeContent();
  }

  const ctaTitle = content.extraTitle || "Siap Meningkatkan Dampak Pendidikan?";
  const ctaBody =
    content.extraBody ||
    "Mari berkolaborasi untuk menghadirkan pengalaman belajar yang relevan, hangat, dan penuh inspirasi.";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white theme-dark">
      <Navbar variant="dark" />
      <MobileIntro
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        buttonLabel={content.heroPrimaryLabel}
        imageSrc={content.heroImageUrl || "/hero-mobile.svg"}
      />
      <main className="flex-1 pb-24 sm:pb-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-purple-500/30 blur-[140px]" />
          <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-blue-500/30 blur-[140px]" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[160px]" />
        </div>

        <section className="relative z-10" id="home-main">
          <div className="container mx-auto px-4 pt-14 pb-20 md:pt-24 md:pb-28 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Ruang Berbagi Inspirasi
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="block bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  {content.heroTitle}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-white/70 max-w-xl">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={content.heroPrimaryHref}>
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:opacity-90"
                  >
                    {content.heroPrimaryLabel}
                  </Button>
                </Link>
                <Link href={content.heroSecondaryHref}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-transparent bg-white text-slate-900 shadow-md shadow-white/20 hover:bg-white/90"
                  >
                    {content.heroSecondaryLabel}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <span>Berbagi praktik terbaik</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>Kolaborasi pendidikan</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-blue-500/40 blur-2xl pointer-events-none" />
              <div className="relative rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.heroImageUrl}
                  alt="Ilustrasi inovasi pendidikan"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 pointer-events-auto">
                <UserLoginCard />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                Program Unggulan
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Apa yang Kami Tawarkan
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto mt-4">
                Pendekatan holistik untuk membangun budaya belajar yang
                berkarakter, kreatif, dan relevan dengan tantangan masa depan.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl"
                id="profile"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                    P
                  </div>
                  <h3 className="text-xl font-semibold">
                    {content.profileTitle}
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {content.profileBody}
                </p>
                <p className="text-white/60 leading-relaxed mt-4">
                  {content.profileBody2}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold">
                    V
                  </div>
                  <h3 className="text-xl font-semibold">
                    {content.visionTitle}
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed">
                  {content.visionBody}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-xl font-bold">
                    M
                  </div>
                  <h3 className="text-xl font-semibold">
                    {content.missionTitle}
                  </h3>
                </div>
                <ul className="space-y-3 text-white/70 list-disc pl-5">
                  {content.missionItems.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 pb-20">
          <div className="container mx-auto px-4">
            <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-12 sm:px-12 text-center shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold">{ctaTitle}</h2>
              <p className="text-white/70 max-w-2xl mx-auto mt-4">{ctaBody}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href={content.heroPrimaryHref}>
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90"
                  >
                    {content.heroPrimaryLabel}
                  </Button>
                </Link>
                <Link href={content.heroSecondaryHref}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-transparent bg-white text-slate-900 shadow-md shadow-white/20 hover:bg-white/90"
                  >
                    {content.heroSecondaryLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MobileBottomNav />
      <AdminLoginFab />
    </div>
  );
}
