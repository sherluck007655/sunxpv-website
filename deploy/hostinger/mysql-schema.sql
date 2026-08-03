CREATE TABLE IF NOT EXISTS contact_enquiries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(60) NOT NULL DEFAULT '',
  city VARCHAR(100) NOT NULL DEFAULT '',
  subject VARCHAR(180) NOT NULL DEFAULT 'General enquiry',
  message TEXT NOT NULL,
  source_path VARCHAR(300) NOT NULL DEFAULT '/contact-us',
  status ENUM('new', 'in_progress', 'resolved', 'spam') NOT NULL DEFAULT 'new',
  email_notified TINYINT(1) NOT NULL DEFAULT 0,
  email_error VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX contact_enquiries_status_created_idx (status, created_at),
  INDEX contact_enquiries_email_idx (email),
  INDEX contact_enquiries_created_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
