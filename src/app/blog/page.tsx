import { Navbar, AdminLoginFab } from "@/components/LayoutBlocks";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, isNotNull } from "drizzle-orm";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MobileBottomNav from "@/components/MobileBottomNav";

export default async function BlogPage() {
  const publishedArticles = await db
    .select()
    .from(articles)
    .where(isNotNull(articles.publishedAt))
    .orderBy(desc(articles.publishedAt));

  const featuredArticle = publishedArticles[0];
  const remainingArticles = publishedArticles.slice(1);
  const gradients = [
    "from-slate-800 via-slate-700 to-slate-900",
    "from-indigo-600 via-indigo-500 to-blue-600",
    "from-emerald-600 via-teal-500 to-cyan-500",
    "from-rose-600 via-pink-500 to-fuchsia-500",
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white theme-dark">
      <Navbar variant="dark" />
      <main className="flex-1 py-12 pb-24 sm:pb-0">
        <div className="container mx-auto px-4 max-w-4xl hidden sm:block">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">
            Artikel & Opini
          </h1>
          <p className="text-lg text-white/70 mb-12">
            Kumpulan tulisan, pemikiran, dan pandangan seputar dunia pendidikan
            dan pengalaman memimpin sekolah.
          </p>

          <div className="space-y-6">
            {publishedArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-shadow bg-white/5 border-white/10 text-white"
              >
                <CardHeader>
                  <CardTitle className="text-2xl hover:text-blue-300 transition-colors">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "long", day: "numeric" },
                        )
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 line-clamp-3">
                    {article.content.substring(0, 200)}...
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-blue-300 font-medium hover:underline"
                    >
                      Baca selengkapnya &rarr;
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {publishedArticles.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <p>Belum ada artikel yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </div>

        <div className="sm:hidden px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Artikel & Opini</h1>
            <Link href="/blog" className="text-sm text-white/60">
              Lihat Semua
            </Link>
          </div>

          {featuredArticle ? (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Breaking News</p>
                <span className="text-xs text-white/60">Show More</span>
              </div>
              <Link href={`/blog/${featuredArticle.slug}`}>
                <div className="rounded-3xl overflow-hidden shadow-lg bg-white/5 border border-white/10">
                  <div
                    className={`h-48 bg-gradient-to-br ${gradients[0]} relative`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700">
                      Artikel
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/60 mb-2">
                      {featuredArticle.publishedAt
                        ? new Date(
                            featuredArticle.publishedAt,
                          ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                    <h2 className="text-lg font-semibold leading-snug">
                      {featuredArticle.title}
                    </h2>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">
                      {featuredArticle.content.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {["All", "Pendidikan", "Kepemimpinan", "Opini", "Kegiatan"].map(
              (tag) => (
                <span
                  key={tag}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs ${
                    tag === "All"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 border border-white/10 text-white/70"
                  }`}
                >
                  {tag}
                </span>
              ),
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Recommended for you</p>
            <span className="text-xs text-white/60">Show More</span>
          </div>

          <div className="space-y-4">
            {remainingArticles.map((article, index) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <div className="flex gap-4 items-start rounded-2xl bg-white/5 p-3 shadow-sm border border-white/10">
                  <div
                    className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${gradients[(index + 1) % gradients.length]} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {publishedArticles.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <p>Belum ada artikel yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileBottomNav />
      <AdminLoginFab />
    </div>
  );
}
