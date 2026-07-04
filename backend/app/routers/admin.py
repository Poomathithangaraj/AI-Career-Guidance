import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["Admin Portal Management"])

# Dependency shortcut to guarantee administrator permissions
admin_dependency = Depends(auth.get_current_admin)

@router.get("/metrics", response_model=schemas.DashboardMetricsResponse, dependencies=[admin_dependency])
def get_admin_dashboard_metrics(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_assessments = db.query(models.Assessment).count()
    total_resume_uploads = db.query(models.ResumeAnalysis).count()

    # 1. Career recommendations distribution
    careers_recommended_count = {}
    recommendations = db.query(models.Recommendation.career_name).all()
    for rec in recommendations:
        name = rec[0]
        careers_recommended_count[name] = careers_recommended_count.get(name, 0) + 1

    # 2. Category averages across all exams
    assessment_averages = {}
    assessments = db.query(models.Assessment.category_scores).all()
    category_totals = {}
    category_counts = {}
    
    for assessment in assessments:
        try:
            scores = json.loads(assessment[0])
            for cat, val in scores.items():
                category_totals[cat] = category_totals.get(cat, 0.0) + float(val)
                category_counts[cat] = category_counts.get(cat, 0) + 1
        except Exception:
            continue
            
    for cat, total in category_totals.items():
        count = category_counts[cat]
        assessment_averages[cat] = round(total / count, 2) if count > 0 else 0.0

    return {
        "total_users": total_users,
        "total_assessments": total_assessments,
        "total_resume_uploads": total_resume_uploads,
        "careers_recommended_count": careers_recommended_count,
        "assessment_averages": assessment_averages
    }

@router.get("/users", response_model=List[schemas.UserAdminResponse], dependencies=[admin_dependency])
def list_all_registered_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dependency])
def delete_user_account(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
        
    db.delete(user)
    db.commit()
    return None

@router.get("/questions", response_model=List[schemas.QuestionAdminResponse], dependencies=[admin_dependency])
def list_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).all()

@router.post("/questions", response_model=schemas.QuestionAdminResponse, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def add_new_assessment_question(question_in: schemas.QuestionCreate, db: Session = Depends(get_db)):
    new_q = models.Question(
        category=question_in.category,
        question_text=question_in.question_text,
        option_a=question_in.option_a,
        option_b=question_in.option_b,
        option_c=question_in.option_c,
        option_d=question_in.option_d,
        correct_option=question_in.correct_option
    )
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[admin_dependency])
def delete_assessment_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question entry not found")
        
    db.delete(question)
    db.commit()
    return None

@router.post("/courses", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def add_new_course_listing(course_in: schemas.CourseCreate, db: Session = Depends(get_db)):
    new_course = models.Course(
        title=course_in.title,
        provider=course_in.provider,
        url=course_in.url,
        duration=course_in.duration,
        rating=course_in.rating,
        difficulty=course_in.difficulty,
        career_name=course_in.career_name,
        required_skills=course_in.required_skills
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.post("/jobs", response_model=schemas.JobResponse, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def add_new_job_listing(job_in: schemas.JobCreate, db: Session = Depends(get_db)):
    new_job = models.Job(
        company=job_in.company,
        role=job_in.role,
        location=job_in.location,
        salary=job_in.salary,
        required_skills=job_in.required_skills,
        apply_link=job_in.apply_link,
        career_name=job_in.career_name
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job
