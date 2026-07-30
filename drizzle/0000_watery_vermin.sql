CREATE TABLE `form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`form_type` text DEFAULT 'contact' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`subject` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`product` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source_path` text DEFAULT '/' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `form_status_idx` ON `form_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `form_created_at_idx` ON `form_submissions` (`created_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`content_type` text DEFAULT 'application/octet-stream' NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`alt_text` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`location` text DEFAULT 'header' NOT NULL,
	`parent_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`open_new_tab` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `menu_location_idx` ON `menu_items` (`location`);--> statement-breakpoint
CREATE INDEX `menu_parent_idx` ON `menu_items` (`parent_id`);--> statement-breakpoint
CREATE INDEX `menu_sort_order_idx` ON `menu_items` (`sort_order`);--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`referrer` text DEFAULT '' NOT NULL,
	`session_id` text DEFAULT '' NOT NULL,
	`device` text DEFAULT 'desktop' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `page_views_path_idx` ON `page_views` (`path`);--> statement-breakpoint
CREATE INDEX `page_views_created_at_idx` ON `page_views` (`created_at`);--> statement-breakpoint
CREATE INDEX `page_views_session_idx` ON `page_views` (`session_id`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`template` text DEFAULT 'standard' NOT NULL,
	`parent_id` text,
	`menu_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text DEFAULT '' NOT NULL,
	`seo_description` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_status_idx` ON `pages` (`status`);--> statement-breakpoint
CREATE INDEX `pages_menu_order_idx` ON `pages` (`menu_order`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`featured_image` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'News' NOT NULL,
	`published_at` text,
	`seo_title` text DEFAULT '' NOT NULL,
	`seo_description` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_at_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`family` text DEFAULT 'Solar Products' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`tag` text DEFAULT '' NOT NULL,
	`specifications` text DEFAULT '[]' NOT NULL,
	`menu_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text DEFAULT '' NOT NULL,
	`seo_description` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE INDEX `products_family_idx` ON `products` (`family`);--> statement-breakpoint
CREATE INDEX `products_menu_order_idx` ON `products` (`menu_order`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL
);
