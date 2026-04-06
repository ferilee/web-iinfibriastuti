import { NextResponse } from "next/server";
import { db } from "@/db";
import { articleComments, oauthUsers } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = Number(searchParams.get("articleId"));
    if (!articleId) {
      return NextResponse.json(
        { error: "Article id is required" },
        { status: 400 },
      );
    }

    const rows = await db
      .select({
        id: articleComments.id,
        content: articleComments.content,
        createdAt: articleComments.createdAt,
        userName: oauthUsers.name,
        userImage: oauthUsers.image,
        userEmail: oauthUsers.email,
      })
      .from(articleComments)
      .leftJoin(oauthUsers, eq(articleComments.userId, oauthUsers.id))
      .where(
        and(
          eq(articleComments.articleId, articleId),
          eq(articleComments.status, "approved"),
        ),
      )
      .orderBy(desc(articleComments.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: number } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId, content } = await req.json();
    if (!articleId || !content?.trim()) {
      return NextResponse.json(
        { error: "Article id and content are required" },
        { status: 400 },
      );
    }

    await db.insert(articleComments).values({
      articleId: Number(articleId),
      userId,
      content: content.trim(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Comment submitted" });
  } catch (error) {
    console.error("Comment create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
