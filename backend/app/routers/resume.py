from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth, resume_analyzer

router = APIRouter(prefix="/api/resume", tags=["Resume Analysis"])

@router.post("", response_model=schemas.ResumeAnalysisResponse)
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF format documents are supported for resume scanning."
        )

    # Read binary contents
    pdf_bytes = await file.read()
    
    # Extract text from PDF
    extracted_text = resume_analyzer.extract_text_from_pdf(pdf_bytes)
    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to extract readable text content from the PDF file. Please ensure the PDF is not scanned/image-only."
        )

    # 1. Fetch user's preferred career required skills to look for gaps
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    preferred_career_skills = []
    if profile and profile.preferred_career:
        # Check if the preferred career exists in CAREER_DATABASE to fetch its skills
        from ..recommendation_engine import CAREER_DATABASE
        career_meta = CAREER_DATABASE.get(profile.preferred_career)
        if career_meta:
            preferred_career_skills = career_meta["required_skills"]

    # 2. Analyze
    analysis = resume_analyzer.analyze_resume_text(extracted_text, preferred_career_skills)

    # Remove any existing analysis to maintain one record per user
    db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).delete()
    db.commit()

    # 3. Save
    db_analysis = models.ResumeAnalysis(
        user_id=current_user.id,
        filename=file.filename,
        resume_score=analysis["resume_score"],
        extracted_skills=analysis["extracted_skills"],
        extracted_education=analysis["extracted_education"],
        extracted_projects=analysis["extracted_projects"],
        extracted_certifications=analysis["extracted_certifications"],
        missing_skills=analysis["missing_skills"],
        suggestions=analysis["suggestions"]
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    return db_analysis

@router.get("/latest", response_model=schemas.ResumeAnalysisResponse)
def get_latest_resume_analysis(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(models.ResumeAnalysis).filter(
        models.ResumeAnalysis.user_id == current_user.id
    ).order_by(models.ResumeAnalysis.created_at.desc()).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume analysis results found. Please upload a resume first."
        )
    return analysis
