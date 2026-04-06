import { NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const [deleted] = await db.delete(photos).where(eq(photos.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
