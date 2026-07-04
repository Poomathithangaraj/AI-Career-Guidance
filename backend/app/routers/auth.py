from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
    
    # Check if we should make the first user an admin (convenience for local sandbox testing)
    is_admin = False
    user_count = db.query(models.User).count()
    if user_count == 0:
        is_admin = True # Make the first registered user admin for ease of setup!

    hashed_pw = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        is_admin=is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize empty profile linked to the user
    new_profile = models.Profile(
        user_id=new_user.id,
        full_name=user_in.email.split("@")[0].capitalize(),
        phone="",
        age=None,
        gender="",
        college="",
        department="",
        qualification="",
        cgpa=0.0,
        current_skills="",
        interests="",
        strengths="",
        weaknesses="",
        preferred_career="",
        preferred_location="",
        profile_photo_url=""
    )
    db.add(new_profile)
    db.commit()

    return new_user

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token payload
    token_data = {
        "sub": user.email,
        "user_id": user.id,
        "is_admin": user.is_admin
    }
    
    access_token = auth.create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out. Please clear your token storage."}

@router.post("/forgot-password")
def forgot_password(email_payload: dict):
    email = email_payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    # Simulation: return recovery link
    return {"message": f"Password reset link has been dispatched to {email}. (Note: SMTP mail simulation)"}

@router.post("/reset-password")
def reset_password(reset_payload: dict, db: Session = Depends(get_db)):
    email = reset_payload.get("email")
    new_pw = reset_payload.get("password")
    if not email or not new_pw:
        raise HTTPException(status_code=400, detail="Email and new password are required")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = auth.get_password_hash(new_pw)
    db.commit()
    return {"message": "Password updated successfully. You can now login with your new credentials."}
