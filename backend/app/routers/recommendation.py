from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/recommendations", tags=["Career Recommendations"])

@router.get("", response_model=List[schemas.RecommendationResponse])
def get_user_career_recommendations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    recommendations = db.query(models.Recommendation).filter(
        models.Recommendation.user_id == current_user.id
    ).order_by(models.Recommendation.match_percentage.desc()).all()
    
    return recommendations

@router.get("/roadmap/{career_name}", response_model=schemas.RoadmapResponse)
def get_career_roadmap(
    career_name: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == current_user.id,
        models.Roadmap.career_name == career_name
    ).first()
    
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap details for '{career_name}' not generated yet. Complete your career assessment exam first."
        )
    return roadmap
