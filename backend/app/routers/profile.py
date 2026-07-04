from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/profile", tags=["User Profile"])

@router.get("", response_model=schemas.ProfileResponse)
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile details not found")
    return profile

@router.put("", response_model=schemas.ProfileResponse)
def update_profile(
    profile_in: schemas.ProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile details not found")

    # Update profile fields if supplied
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
