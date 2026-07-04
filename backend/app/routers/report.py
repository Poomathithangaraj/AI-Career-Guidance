import os
import tempfile
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, auth, pdf_generator

router = APIRouter(prefix="/api/report", tags=["PDF Report Generation"])

@router.get("")
def download_career_report(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all details needed for the report
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    assessment = db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id).order_by(models.Assessment.completed_at.desc()).first()
    recommendations = db.query(models.Recommendation).filter(models.Recommendation.user_id == current_user.id).order_by(models.Recommendation.match_percentage.desc()).all()
    resume_analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile data is missing. Please populate your profile details first."
        )
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment scores not found. Please complete the career guidance assessment exam first."
        )
    if not recommendations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recommendations are not ready. Please re-submit your assessment answers."
        )

    # Convert profiles and assessments to dict structures for pdf generator
    profile_dict = {
        "full_name": profile.full_name,
        "college": profile.college,
        "department": profile.department,
        "qualification": profile.qualification,
        "cgpa": profile.cgpa,
    }
    
    assessment_dict = {
        "total_score": assessment.total_score,
        "category_scores": assessment.category_scores,
    }
    
    recs_list = []
    for rec in recommendations[:5]:
        recs_list.append({
            "career_name": rec.career_name,
            "match_percentage": rec.match_percentage,
            "reason": rec.reason,
            "required_skills": rec.required_skills,
            "missing_skills": rec.missing_skills,
            "salary_range": rec.salary_range,
            "top_hiring_companies": rec.top_hiring_companies,
            "job_demand": rec.job_demand,
            "difficulty": rec.difficulty,
        })

    resume_dict = None
    if resume_analysis:
        resume_dict = {
            "filename": resume_analysis.filename,
            "resume_score": resume_analysis.resume_score,
            "extracted_skills": resume_analysis.extracted_skills,
            "suggestions": resume_analysis.suggestions,
        }

    # Generate PDF in a temporary file directory
    temp_dir = tempfile.gettempdir()
    pdf_filename = f"career_report_user_{current_user.id}.pdf"
    pdf_path = os.path.join(temp_dir, pdf_filename)

    try:
        pdf_generator.generate_career_pdf(
            file_path=pdf_path,
            user_email=current_user.email,
            profile_data=profile_dict,
            assessment_data=assessment_dict,
            recommendations=recs_list,
            resume_analysis=resume_dict
        )
        
        # Save file path details to reports table in database
        new_report = models.Report(
            user_id=current_user.id,
            file_path=pdf_path
        )
        db.add(new_report)
        db.commit()
        
        return FileResponse(
            path=pdf_path,
            filename=f"AI_Career_Guidance_Report.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate Report PDF: {str(e)}"
        )
