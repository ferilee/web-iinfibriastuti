import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const homeContent = sqliteTable("home_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImageUrl: text("hero_image_url"),
  heroPrimaryLabel: text("hero_primary_label"),
  heroPrimaryHref: text("hero_primary_href"),
  heroSecondaryLabel: text("hero_secondary_label"),
  heroSecondaryHref: text("hero_secondary_href"),
  profileTitle: text("profile_title"),
  profileBody: text("profile_body"),
  profileBody2: text("profile_body_2"),
  visionTitle: text("vision_title"),
  visionBody: text("vision_body"),
  missionTitle: text("mission_title"),
  missionItems: text("mission_items"),
  extraTitle: text("extra_title"),
  extraBody: text("extra_body"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const oauthUsers = sqliteTable(
  "oauth_users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    email: text("email"),
    name: text("name"),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex(
      "oauth_users_provider_account_unique",
    ).on(table.provider, table.providerAccountId),
  }),
);

export const articleComments = sqliteTable("article_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const articleReactions = sqliteTable(
  "article_reactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    articleId: integer("article_id").notNull(),
    userId: integer("user_id").notNull(),
    type: text("type").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
  },
  (table) => ({
    articleUserUnique: uniqueIndex("article_reactions_article_user_unique").on(
      table.articleId,
      table.userId,
    ),
  }),
);
