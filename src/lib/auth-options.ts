import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { oauthUsers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function upsertOauthUser(params: {
  provider: string;
  providerAccountId: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  const [existing] = await db
    .select()
    .from(oauthUsers)
    .where(
      and(
        eq(oauthUsers.provider, params.provider),
        eq(oauthUsers.providerAccountId, params.providerAccountId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(oauthUsers)
      .set({
        email: params.email ?? existing.email,
        name: params.name ?? existing.name,
        image: params.image ?? existing.image,
      })
      .where(eq(oauthUsers.id, existing.id));
    return existing.id;
  }

  const inserted = await db
    .insert(oauthUsers)
    .values({
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      email: params.email ?? null,
      name: params.name ?? null,
      image: params.image ?? null,
      createdAt: new Date(),
    })
    .returning({ id: oauthUsers.id });

  return inserted[0]?.id;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: NonNullable<NextAuthOptions["providers"]> = [];
if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  );
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "NextAuth: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set; Google provider disabled.",
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;
      const userId = await upsertOauthUser({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        email: user.email,
        name: user.name,
        image: user.image,
      });
      return Boolean(userId);
    },
    async jwt({ token, user, account }) {
      if (account) {
        const userId = await upsertOauthUser({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user?.email,
          name: user?.name,
          image: user?.image,
        });
        if (userId) {
          token.userId = userId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: number }).id = token.userId as number;
      }
      return session;
    },
  },
};
