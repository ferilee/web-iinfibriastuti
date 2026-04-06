import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { homeContent } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  normalizeHomeContent,
  parseMissionItems,
  serializeMissionItems,
} from "@/lib/home-content";
import { verifyToken } from "@/lib/auth";

function mapRowToContent(row: typeof homeContent.$inferSelect | undefined) {
  if (!row) return normalizeHomeContent();
  return normalizeHomeContent({
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
  });
}

export async function GET() {
  try {
    const [row] = await db
      .select()
      .from(homeContent)
      .orderBy(desc(homeContent.id))
      .limit(1);
    return NextResponse.json(mapRowToContent(row));
  } catch (error) {
    console.error("Home content fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
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

    const body = await req.json();
    const normalized = normalizeHomeContent({
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      heroImageUrl: body.heroImageUrl,
      heroPrimaryLabel: body.heroPrimaryLabel,
      heroPrimaryHref: body.heroPrimaryHref,
      heroSecondaryLabel: body.heroSecondaryLabel,
      heroSecondaryHref: body.heroSecondaryHref,
      profileTitle: body.profileTitle,
      profileBody: body.profileBody,
      profileBody2: body.profileBody2,
      visionTitle: body.visionTitle,
      visionBody: body.visionBody,
      missionTitle: body.missionTitle,
      missionItems: parseMissionItems(body.missionItems),
      extraTitle: body.extraTitle,
      extraBody: body.extraBody,
    });

    const [existing] = await db
      .select()
      .from(homeContent)
      .orderBy(desc(homeContent.id))
      .limit(1);

    const payloadToSave = {
      heroTitle: normalized.heroTitle,
      heroSubtitle: normalized.heroSubtitle,
      heroImageUrl: normalized.heroImageUrl,
      heroPrimaryLabel: normalized.heroPrimaryLabel,
      heroPrimaryHref: normalized.heroPrimaryHref,
      heroSecondaryLabel: normalized.heroSecondaryLabel,
      heroSecondaryHref: normalized.heroSecondaryHref,
      profileTitle: normalized.profileTitle,
      profileBody: normalized.profileBody,
      profileBody2: normalized.profileBody2,
      visionTitle: normalized.visionTitle,
      visionBody: normalized.visionBody,
      missionTitle: normalized.missionTitle,
      missionItems: serializeMissionItems(normalized.missionItems),
      extraTitle: normalized.extraTitle || null,
      extraBody: normalized.extraBody || null,
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(homeContent)
        .set(payloadToSave)
        .where(eq(homeContent.id, existing.id));
    } else {
      await db.insert(homeContent).values(payloadToSave);
    }

    return NextResponse.json({ message: "Home content updated" });
  } catch (error) {
    console.error("Home content update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
