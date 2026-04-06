import { Navbar, AdminLoginFab } from "@/components/LayoutBlocks";
import MobileBottomNav from "@/components/MobileBottomNav";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ArticleEngagement from "@/components/ArticleEngagement";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article || !article.publishedAt) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white theme-dark">
      <Navbar variant="dark" />
      <main className="flex-1 py-12 pb-24 sm:pb-0">
        <article className="container mx-auto px-4 max-w-3xl hidden sm:block">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {article.title}
            </h1>
            <p className="text-white/60">
              Dipublikasikan pada{" "}
              {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {/* Very basic markdown rendering - in real app use react-markdown or similar */}
          <div className="prose prose-lg md:prose-xl mx-auto prose-invert whitespace-pre-wrap">
            {article.content}
          </div>
          <ArticleEngagement articleId={article.id} />
        </article>

        <article className="sm:hidden px-4">
          <div className="mb-4 text-xs text-white/60">
            CNN Indonesia •{" "}
            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • World
          </div>
          <h1 className="text-2xl font-bold leading-tight">{article.title}</h1>
          <div className="mt-4 rounded-3xl overflow-hidden shadow-lg">
            <div className="h-56 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700">
                Highlight
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-white/60">
            Ilustrasi kegiatan
          </p>
          <div className="mt-6 text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
            {article.content}
          </div>
          <ArticleEngagement articleId={article.id} />
        </article>
      </main>
      <MobileBottomNav />
      <AdminLoginFab />
    </div>
  );
}
