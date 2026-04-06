import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { articleComments, articles, oauthUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

const allowedStatuses = new Set(["approved", "rejected", "pending"]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const commentId = Number(id);
    if (!commentId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { status } = await req.json();
    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [commentRow] = await db
      .select({
        id: articleComments.id,
        status: articleComments.status,
        content: articleComments.content,
        articleTitle: articles.title,
        articleSlug: articles.slug,
        userName: oauthUsers.name,
        userEmail: oauthUsers.email,
      })
      .from(articleComments)
      .leftJoin(articles, eq(articleComments.articleId, articles.id))
      .leftJoin(oauthUsers, eq(articleComments.userId, oauthUsers.id))
      .where(eq(articleComments.id, commentId))
      .limit(1);

    if (!commentRow) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await db
      .update(articleComments)
      .set({ status, updatedAt: new Date() })
      .where(eq(articleComments.id, commentId));

    let emailWarning: string | null = null;
    if (
      commentRow.userEmail &&
      (status === "approved" || status === "rejected")
    ) {
      const siteUrl =
        process.env.SITE_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3016";
      const articlePath = commentRow.articleSlug
        ? `/blog/${commentRow.articleSlug}`
        : "/blog";
      const articleUrl = `${siteUrl}${articlePath}`;
      const statusLabel = status === "approved" ? "disetujui" : "ditolak";
      const subject =
        status === "approved"
          ? "Komentar Anda Disetujui"
          : "Komentar Anda Ditolak";

      const intro =
        status === "approved"
          ? "Komentar Anda pada artikel berikut telah disetujui:"
          : "Komentar Anda pada artikel berikut tidak dapat ditampilkan:";

      const text = [
        `Halo${commentRow.userName ? ` ${commentRow.userName}` : ""},`,
        "",
        intro,
        `Judul: ${commentRow.articleTitle || "Artikel"}`,
        `Tautan: ${articleUrl}`,
        "",
        "Terima kasih telah berpartisipasi.",
      ].join("\n");

      const html = `
        <p>Halo${commentRow.userName ? ` ${commentRow.userName}` : ""},</p>
        <p>${intro}</p>
        <p><strong>Judul:</strong> ${commentRow.articleTitle || "Artikel"}</p>
        <p><strong>Tautan:</strong> <a href="${articleUrl}">${articleUrl}</a></p>
        <p>Terima kasih telah berpartisipasi.</p>
      `;

      try {
        await sendMail({
          to: commentRow.userEmail,
          subject,
          text,
          html,
        });
      } catch (mailError) {
        console.error("Failed sending comment notification:", mailError);
        emailWarning = "Email notification failed";
      }
    }

    return NextResponse.json({ message: "Comment updated", emailWarning });
  } catch (error) {
    console.error("Admin comment update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
