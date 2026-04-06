import { NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const allPhotos = await db.select().from(photos).orderBy(desc(photos.createdAt));
    return NextResponse.json(allPhotos);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, imageUrl } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const [newPhoto] = await db
      .insert(photos)
      .values({
        title,
        imageUrl,
      })
      .returning();

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
