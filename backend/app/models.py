import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    answers = relationship("Answer", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    resume_analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    college = Column(String(200), nullable=True)
    department = Column(String(100), nullable=True)
    qualification = Column(String(100), nullable=True)
    cgpa = Column(Float, nullable=True)
    current_skills = Column(Text, nullable=True) # Comma-separated list
    interests = Column(Text, nullable=True) # Comma-separated list
    strengths = Column(Text, nullable=True) # Comma-separated list
    weaknesses = Column(Text, nullable=True) # Comma-separated list
    preferred_career = Column(Text, nullable=True)
    preferred_location = Column(Text, nullable=True)
    profile_photo_url = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False) # e.g. Programming, Python, Java, SQL, AI, ML...
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(1), nullable=False) # 'A', 'B', 'C', or 'D'

    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_option = Column(String(1), nullable=False) # 'A', 'B', 'C', or 'D'
    is_correct = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="answers")
    question = relationship("Question", back_populates="answers")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_score = Column(Integer, nullable=False) # Number of correct answers out of 50
    category_scores = Column(Text, nullable=False) # JSON encoded: {"Python": 4, "Logical Reasoning": 5, ...}
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="assessments")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    career_name = Column(String(100), nullable=False)
    match_percentage = Column(Float, nullable=False)
    reason = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False) # Comma-separated or JSON list
    missing_skills = Column(Text, nullable=False) # Comma-separated or JSON list
    salary_range = Column(String(50), nullable=False)
    future_scope = Column(Text, nullable=False)
    job_demand = Column(String(50), nullable=False)
    difficulty = Column(String(50), nullable=False) # Easy, Medium, Hard
    roadmap = Column(Text, nullable=False) # JSON string of monthly roadmap
    recommended_certifications = Column(Text, nullable=False) # Comma-separated or JSON
    top_hiring_companies = Column(Text, nullable=False) # Comma-separated or JSON
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recommendations")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    career_name = Column(String(100), nullable=False)
    month_wise_plan = Column(Text, nullable=False) # JSON encoded
    week_wise_plan = Column(Text, nullable=False) # JSON encoded
    projects = Column(Text, nullable=False) # JSON encoded
    assignments = Column(Text, nullable=False) # JSON encoded
    practice_problems = Column(Text, nullable=False) # JSON encoded
    interview_prep = Column(Text, nullable=False) # JSON encoded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    provider = Column(String(100), nullable=False) # Coursera, Udemy, etc.
    url = Column(String(255), nullable=False)
    duration = Column(String(50), nullable=False)
    rating = Column(Float, default=4.5)
    difficulty = Column(String(50), nullable=False)
    career_name = Column(String(100), nullable=False)
    required_skills = Column(Text, nullable=False)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    salary = Column(String(100), nullable=False)
    required_skills = Column(Text, nullable=False)
    apply_link = Column(String(255), nullable=False)
    career_name = Column(String(100), nullable=False)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    resume_score = Column(Integer, nullable=False)
    extracted_skills = Column(Text, nullable=True)
    extracted_education = Column(Text, nullable=True)
    extracted_projects = Column(Text, nullable=True)
    extracted_certifications = Column(Text, nullable=True)
    missing_skills = Column(Text, nullable=True)
    suggestions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resume_analyses")
