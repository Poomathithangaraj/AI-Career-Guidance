from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
import datetime

# Authentication Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    is_admin: Optional[bool] = False

# Profile Schemas
class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    qualification: Optional[str] = None
    cgpa: Optional[float] = None
    current_skills: Optional[str] = None
    interests: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    preferred_career: Optional[str] = None
    preferred_location: Optional[str] = None
    profile_photo_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

# Assessment Schemas
class QuestionResponse(BaseModel):
    id: int
    category: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True

class QuestionAdminResponse(BaseModel):
    id: int
    category: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    question_id: int
    selected_option: str = Field(..., pattern="^[A-D]$")

class AssessmentResponse(BaseModel):
    id: int
    total_score: int
    category_scores: str # JSON String or dict can be handled by endpoints
    completed_at: datetime.datetime

    class Config:
        from_attributes = True

# Career Recommendation Schemas
class RecommendationResponse(BaseModel):
    id: int
    career_name: str
    match_percentage: float
    reason: str
    required_skills: str
    missing_skills: str
    salary_range: str
    future_scope: str
    job_demand: str
    difficulty: str
    roadmap: str
    recommended_certifications: str
    top_hiring_companies: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Roadmap Schemas
class RoadmapResponse(BaseModel):
    id: int
    career_name: str
    month_wise_plan: str
    week_wise_plan: str
    projects: str
    assignments: str
    practice_problems: str
    interview_prep: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Course Schemas
class CourseResponse(BaseModel):
    id: int
    title: str
    provider: str
    url: str
    duration: str
    rating: float
    difficulty: str
    career_name: str
    required_skills: str

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    provider: str
    url: str
    duration: str
    rating: float
    difficulty: str
    career_name: str
    required_skills: str

# Job Schemas
class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    location: str
    salary: str
    required_skills: str
    apply_link: str
    career_name: str

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    company: str
    role: str
    location: str
    salary: str
    required_skills: str
    apply_link: str
    career_name: str

# Resume Analysis Schemas
class ResumeAnalysisResponse(BaseModel):
    id: int
    filename: str
    resume_score: int
    extracted_skills: Optional[str] = None
    extracted_education: Optional[str] = None
    extracted_projects: Optional[str] = None
    extracted_certifications: Optional[str] = None
    missing_skills: Optional[str] = None
    suggestions: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Admin Panel Management Schemas
class UserAdminResponse(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime.datetime
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    category: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(..., pattern="^[A-D]$")

class DashboardMetricsResponse(BaseModel):
    total_users: int
    total_assessments: int
    total_resume_uploads: int
    careers_recommended_count: Dict[str, int]
    assessment_averages: Dict[str, float]
