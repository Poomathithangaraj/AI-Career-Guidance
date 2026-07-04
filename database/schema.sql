-- Database creation script for AI Career Guidance Agent
-- Compatible with MySQL (Production Ready) and SQLite

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    age INT,
    gender VARCHAR(20),
    college VARCHAR(200),
    department VARCHAR(100),
    qualification VARCHAR(100),
    cgpa FLOAT,
    current_skills TEXT,
    interests TEXT,
    strengths TEXT,
    weaknesses TEXT,
    preferred_career TEXT,
    preferred_location TEXT,
    profile_photo_url VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option VARCHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_score INT NOT NULL,
    category_scores TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_name VARCHAR(100) NOT NULL,
    match_percentage FLOAT NOT NULL,
    reason TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    missing_skills TEXT NOT NULL,
    salary_range VARCHAR(50) NOT NULL,
    future_scope TEXT NOT NULL,
    job_demand VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    roadmap TEXT NOT NULL,
    recommended_certifications TEXT NOT NULL,
    top_hiring_companies TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_name VARCHAR(100) NOT NULL,
    month_wise_plan TEXT NOT NULL,
    week_wise_plan TEXT NOT NULL,
    projects TEXT NOT NULL,
    assignments TEXT NOT NULL,
    practice_problems TEXT NOT NULL,
    interview_prep TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rating FLOAT DEFAULT 4.5,
    difficulty VARCHAR(50) NOT NULL,
    career_name VARCHAR(100) NOT NULL,
    required_skills TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    required_skills TEXT NOT NULL,
    apply_link VARCHAR(255) NOT NULL,
    career_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    resume_score INT NOT NULL,
    extracted_skills TEXT,
    extracted_education TEXT,
    extracted_projects TEXT,
    extracted_certifications TEXT,
    missing_skills TEXT,
    suggestions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
