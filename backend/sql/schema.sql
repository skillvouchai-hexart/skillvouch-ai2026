CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar TEXT NOT NULL,
  bio TEXT NOT NULL,
  discord_link VARCHAR(255) NULL,
  skills_known TEXT NOT NULL,
  skills_to_learn TEXT NOT NULL,
  rating FLOAT NOT NULL,
  learning_hours INT DEFAULT 0,
  weekly_activity INT DEFAULT 0,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  dob DATE NULL,
  address TEXT NULL,
  qualification ENUM('TENTH', 'TWELFTH', 'UG', 'PG') NULL,
  tenth_school VARCHAR(255) NULL,
  tenth_percent FLOAT NULL,
  twelfth_school VARCHAR(255) NULL,
  twelfth_college VARCHAR(255) NULL,
  twelfth_percent FLOAT NULL,
  ug_college VARCHAR(255) NULL,
  ug_university VARCHAR(255) NULL,
  ug_percent FLOAT NULL,
  pg_college VARCHAR(255) NULL,
  pg_university VARCHAR(255) NULL,
  pg_percent FLOAT NULL,
  marksheet_10th_url TEXT NULL,
  marksheet_12th_url TEXT NULL,
  resume_url TEXT NULL,
  highest_qual_marksheet_url TEXT NULL
);

CREATE TABLE IF NOT EXISTS exchange_requests (
  id VARCHAR(64) PRIMARY KEY,
  from_user_id VARCHAR(64) NOT NULL,
  to_user_id VARCHAR(64) NOT NULL,
  offered_skill VARCHAR(255) NOT NULL,
  requested_skill VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
  created_at BIGINT NOT NULL,
  completed_at BIGINT NULL,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS exchange_feedback (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL,
  from_user_id VARCHAR(64) NOT NULL,
  to_user_id VARCHAR(64) NOT NULL,
  stars INT NOT NULL,
  comment TEXT NULL,
  created_at BIGINT NOT NULL,
  UNIQUE KEY uniq_feedback_per_request_per_user (request_id, from_user_id),
  FOREIGN KEY (request_id) REFERENCES exchange_requests(id),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(64) PRIMARY KEY,
  sender_id VARCHAR(64) NOT NULL,
  receiver_id VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(64) PRIMARY KEY,
  skill_name VARCHAR(255) NOT NULL,
  questions TEXT NOT NULL, -- JSON array of questions
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS skill_quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  skill_name VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  questions JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_skill (user_id, skill_name, difficulty),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  quiz_id VARCHAR(64) NOT NULL,
  answers TEXT NOT NULL, -- JSON array of user's answers
  score INT NOT NULL, -- Percentage score
  completed_at BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(255) NULL,
  type VARCHAR(50) DEFAULT 'Full-time',
  category ENUM('Private', 'Government') DEFAULT 'Private',
  min_qualification ENUM('TENTH', 'TWELFTH', 'UG', 'PG') DEFAULT 'TENTH',
  required_skills TEXT NULL,
  deadline BIGINT NULL,
  selection_process TEXT NULL,
  exam_date BIGINT NULL,
  exam_mode VARCHAR(50) NULL,
  link TEXT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_applications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  job_id VARCHAR(64) NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
  applied_at BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS competitions (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  platform VARCHAR(255) NOT NULL,
  description TEXT NULL,
  link TEXT NOT NULL,
  prize VARCHAR(255) NULL,
  deadline BIGINT NULL,
  start_date BIGINT NULL,
  type VARCHAR(100) NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS research_papers (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  conference VARCHAR(255) NULL,
  description TEXT NULL,
  link TEXT NOT NULL,
  deadline BIGINT NULL,
  topic VARCHAR(255) NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS ideas (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  technologies TEXT NOT NULL,
  impact TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
