import { NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit);
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, publishedAt } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const [newArticle] = await db
      .insert(articles)
      .values({
        title,
        slug,
        content,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      })
      .returning();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    if ((error as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
