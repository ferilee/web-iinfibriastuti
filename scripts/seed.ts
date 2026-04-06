import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@iinfibriastuti.com';
  const password = process.env.ADMIN_PASSWORD || 'password123';
  const name = 'Iin Fibriastuti';

  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    passwordHash,
    name,
  });

  console.log(`Admin user seeded successfully with email: ${email}`);
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
