import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json(allMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        name,
        email,
        message,
      })
      .returning();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
