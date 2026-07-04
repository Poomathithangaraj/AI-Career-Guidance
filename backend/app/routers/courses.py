from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/courses", tags=["Course Recommendations"])

@router.get("", response_model=List[schemas.CourseResponse])
def get_courses(
    career_name: Optional[str] = Query(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Course)
    if career_name:
        query = query.filter(models.Course.career_name == career_name)
    else:
        # Fallback: get top recommended career and recommend courses for that
        top_rec = db.query(models.Recommendation).filter(
            models.Recommendation.user_id == current_user.id
        ).order_by(models.Recommendation.match_percentage.desc()).first()
        
        if top_rec:
            query = query.filter(models.Course.career_name == top_rec.career_name)
            
    courses = query.all()
    # If no courses are configured specifically, return everything as a fallback
    if not courses:
        courses = db.query(models.Course).limit(10).all()
        
    return courses
