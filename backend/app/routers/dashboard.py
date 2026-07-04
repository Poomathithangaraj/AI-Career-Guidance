import json
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, auth

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Core"])

@router.get("")
def get_dashboard_summary(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    assessment = db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id).order_by(models.Assessment.completed_at.desc()).first()
    recommendations = db.query(models.Recommendation).filter(models.Recommendation.user_id == current_user.id).order_by(models.Recommendation.match_percentage.desc()).all()
    resume_analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()

    # 1. Calculate Profile Completion Percentage
    profile_score = 0
    total_fields = 14
    completed_fields = 0
    
    if profile:
        fields = [
            profile.full_name, profile.phone, profile.age, profile.gender,
            profile.college, profile.department, profile.qualification,
            profile.cgpa, profile.current_skills, profile.interests,
            profile.strengths, profile.weaknesses, profile.preferred_career,
            profile.preferred_location
        ]
        completed_fields = sum(1 for field in fields if field not in [None, "", 0.0, 0])
        profile_score = int((completed_fields / total_fields) * 100)

    # 2. Extract highest recommendation match
    highest_match = 0
    recommended_careers_summary = []
    if recommendations:
        highest_match = recommendations[0].match_percentage
        for r in recommendations[:3]:
            recommended_careers_summary.append({
                "career_name": r.career_name,
                "match_percentage": r.match_percentage,
                "difficulty": r.difficulty,
                "salary_range": r.salary_range
            })

    # 3. Assessment Score
    latest_score = 0
    latest_score_percentage = 0
    category_scores = {}
    if assessment:
        latest_score = assessment.total_score
        latest_score_percentage = int((latest_score / 50) * 100)
        try:
            category_scores = json.loads(assessment.category_scores)
        except Exception:
            category_scores = {}

    # 4. Resume Score
    res_score = 0
    if resume_analysis:
        res_score = resume_analysis.resume_score

    # 5. Build recent activities timeline
    activities = []
    if current_user.created_at:
        activities.append({
            "title": "Account Created",
            "time": current_user.created_at.strftime("%Y-%b-%d %H:%M"),
            "description": "Registered on the AI Career Guidance Portal."
        })
    if profile and completed_fields > 0:
        activities.append({
            "title": "Profile Updated",
            "time": profile.updated_at.strftime("%Y-%b-%d %H:%M") if profile.updated_at else "",
            "description": f"Filled {completed_fields} profile parameters."
        })
    if assessment:
        activities.append({
            "title": "Assessment Completed",
            "time": assessment.completed_at.strftime("%Y-%b-%d %H:%M"),
            "description": f"Scored {assessment.total_score}/50 correct on skill testing."
        })
    if resume_analysis:
        activities.append({
            "title": "Resume Parsed",
            "time": resume_analysis.created_at.strftime("%Y-%b-%d %H:%M"),
            "description": f"Analyzed resume filename: {resume_analysis.filename} with score {resume_analysis.resume_score}/100."
        })

    # Sort activities reverse chronologically
    activities.reverse()

    return {
        "welcome_name": profile.full_name if (profile and profile.full_name) else current_user.email.split("@")[0],
        "profile_completion": profile_score,
        "highest_career_match": highest_match,
        "latest_assessment_score": latest_score,
        "latest_assessment_percentage": latest_score_percentage,
        "resume_score": res_score,
        "recommended_careers": recommended_careers_summary,
        "category_scores": category_scores,
        "activities": activities[:5]
    }
