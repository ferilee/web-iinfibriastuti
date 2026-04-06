import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { articleComments, articles, oauthUsers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const rows = await db
      .select({
        id: articleComments.id,
        content: articleComments.content,
        status: articleComments.status,
        createdAt: articleComments.createdAt,
        articleId: articles.id,
        articleTitle: articles.title,
        userName: oauthUsers.name,
        userEmail: oauthUsers.email,
      })
      .from(articleComments)
      .leftJoin(articles, eq(articleComments.articleId, articles.id))
      .leftJoin(oauthUsers, eq(articleComments.userId, oauthUsers.id))
      .where(eq(articleComments.status, status))
      .orderBy(desc(articleComments.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin comments fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
