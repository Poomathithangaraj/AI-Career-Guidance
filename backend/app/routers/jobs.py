from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/jobs", tags=["Job Recommendations"])

@router.get("", response_model=List[schemas.JobResponse])
def get_jobs(
    career_name: Optional[str] = Query(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Job)
    if career_name:
        query = query.filter(models.Job.career_name == career_name)
    else:
        # Fallback to user's highest recommended career track
        top_rec = db.query(models.Recommendation).filter(
            models.Recommendation.user_id == current_user.id
        ).order_by(models.Recommendation.match_percentage.desc()).first()
        
        if top_rec:
            query = query.filter(models.Job.career_name == top_rec.career_name)
            
    jobs = query.all()
    # Fallback to return general listings if none are mapped to recommended career
    if not jobs:
        jobs = db.query(models.Job).limit(10).all()
        
    return jobs
