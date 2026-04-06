import { NextResponse } from "next/server";
import { db } from "@/db";
import { articleReactions } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const allowedTypes = new Set(["like", "love", "clap"]);

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

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: number } | undefined)?.id;

    const counts = await db
      .select({
        type: articleReactions.type,
        count: sql<number>`count(*)`,
      })
      .from(articleReactions)
      .where(eq(articleReactions.articleId, articleId))
      .groupBy(articleReactions.type);

    const myReaction = userId
      ? await db
          .select({ type: articleReactions.type })
          .from(articleReactions)
          .where(
            and(
              eq(articleReactions.articleId, articleId),
              eq(articleReactions.userId, userId),
            ),
          )
          .limit(1)
      : [];

    return NextResponse.json({
      counts: counts.reduce<Record<string, number>>((acc, item) => {
        acc[item.type] = Number(item.count);
        return acc;
      }, {}),
      myReaction: myReaction[0]?.type || null,
    });
  } catch (error) {
    console.error("Reactions fetch error:", error);
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

    const { articleId, type } = await req.json();
    if (!articleId || !allowedTypes.has(type)) {
      return NextResponse.json({ error: "Invalid reaction" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(articleReactions)
      .where(
        and(
          eq(articleReactions.articleId, Number(articleId)),
          eq(articleReactions.userId, userId),
        ),
      )
      .limit(1);

    if (existing) {
      if (existing.type === type) {
        await db
          .delete(articleReactions)
          .where(eq(articleReactions.id, existing.id));
        return NextResponse.json({ message: "Reaction removed" });
      }

      await db
        .update(articleReactions)
        .set({ type })
        .where(eq(articleReactions.id, existing.id));
      return NextResponse.json({ message: "Reaction updated" });
    }

    await db.insert(articleReactions).values({
      articleId: Number(articleId),
      userId,
      type,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Reaction added" });
  } catch (error) {
    console.error("Reaction update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
