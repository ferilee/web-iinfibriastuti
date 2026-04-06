CREATE TABLE `oauth_users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `provider` text NOT NULL,
  `provider_account_id` text NOT NULL,
  `email` text,
  `name` text,
  `image` text,
  `created_at` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX `oauth_users_provider_account_unique` ON `oauth_users` (`provider`, `provider_account_id`);

CREATE TABLE `article_comments` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `article_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `content` text NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` integer DEFAULT (strftime('%s', 'now')),
  `updated_at` integer DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE `article_reactions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `article_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `type` text NOT NULL,
  `created_at` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX `article_reactions_article_user_unique` ON `article_reactions` (`article_id`, `user_id`);
