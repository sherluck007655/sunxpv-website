CREATE TABLE pages (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  content LONGTEXT NOT NULL,
  template VARCHAR(50) NOT NULL DEFAULT 'standard',
  parent_id VARCHAR(64) NULL,
  menu_order INT NOT NULL DEFAULT 0,
  seo_title VARCHAR(255) NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX pages_status_idx (status),
  INDEX pages_menu_order_idx (menu_order)
);

CREATE TABLE posts (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'News',
  published_at DATETIME(3) NULL,
  seo_title VARCHAR(255) NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX posts_status_idx (status),
  INDEX posts_published_at_idx (published_at)
);

CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  family VARCHAR(120) NOT NULL DEFAULT 'Solar Products',
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  summary TEXT NOT NULL,
  description LONGTEXT NOT NULL,
  image TEXT NOT NULL,
  tag VARCHAR(100) NOT NULL DEFAULT '',
  specifications JSON NOT NULL,
  menu_order INT NOT NULL DEFAULT 0,
  seo_title VARCHAR(255) NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX products_status_idx (status),
  INDEX products_family_idx (family),
  INDEX products_menu_order_idx (menu_order)
);

CREATE TABLE menu_items (
  id VARCHAR(64) PRIMARY KEY,
  label VARCHAR(160) NOT NULL,
  url TEXT NOT NULL,
  location VARCHAR(60) NOT NULL DEFAULT 'header',
  parent_id VARCHAR(64) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  open_new_tab BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX menu_location_idx (location),
  INDEX menu_parent_idx (parent_id),
  INDEX menu_sort_order_idx (sort_order)
);

CREATE TABLE form_submissions (
  id VARCHAR(64) PRIMARY KEY,
  form_type VARCHAR(60) NOT NULL DEFAULT 'contact',
  name VARCHAR(160) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(80) NOT NULL DEFAULT '',
  city VARCHAR(120) NOT NULL DEFAULT '',
  subject VARCHAR(255) NOT NULL DEFAULT '',
  message LONGTEXT NOT NULL,
  product VARCHAR(255) NOT NULL DEFAULT '',
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  source_path VARCHAR(400) NOT NULL DEFAULT '/',
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX form_status_idx (status),
  INDEX form_created_at_idx (created_at)
);

CREATE TABLE page_views (
  id VARCHAR(64) PRIMARY KEY,
  path VARCHAR(400) NOT NULL,
  referrer TEXT NOT NULL,
  session_id VARCHAR(120) NOT NULL DEFAULT '',
  device VARCHAR(40) NOT NULL DEFAULT 'desktop',
  created_at DATETIME(3) NOT NULL,
  INDEX page_views_path_idx (path),
  INDEX page_views_created_at_idx (created_at),
  INDEX page_views_session_idx (session_id)
);

CREATE TABLE media (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  content_type VARCHAR(120) NOT NULL DEFAULT 'application/octet-stream',
  size BIGINT NOT NULL DEFAULT 0,
  alt_text VARCHAR(500) NOT NULL DEFAULT '',
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  INDEX media_created_at_idx (created_at)
);

CREATE TABLE settings (
  `key` VARCHAR(160) PRIMARY KEY,
  value LONGTEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL
);
