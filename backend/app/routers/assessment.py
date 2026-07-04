import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, auth, recommendation_engine

router = APIRouter(prefix="/api/assessment", tags=["Career Assessment"])

@router.get("/questions", response_model=List[schemas.QuestionResponse])
def get_assessment_questions(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    questions = db.query(models.Question).all()
    # If no questions found, raise an error or return empty. We seed the database below anyway!
    return questions

@router.post("/submit", response_model=schemas.AssessmentResponse)
def submit_assessment_answers(
    answers_in: List[schemas.AnswerSubmit],
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Fetch profile to ensure recommendation compatibility
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your profile configuration first")

    # 2. Map answers
    submitted_answers_dict = {ans.question_id: ans.selected_option for ans in answers_in}
    
    questions = db.query(models.Question).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No assessment questions populated in database")

    # Clear prior answers and recommendations to allow re-assessment
    db.query(models.Answer).filter(models.Answer.user_id == current_user.id).delete()
    db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id).delete()
    db.query(models.Recommendation).filter(models.Recommendation.user_id == current_user.id).delete()
    db.query(models.Roadmap).filter(models.Roadmap.user_id == current_user.id).delete()
    db.commit()

    total_correct = 0
    category_scores = {}

    for question in questions:
        # Category tracking init
        if question.category not in category_scores:
            category_scores[question.category] = 0

        selected = submitted_answers_dict.get(question.id)
        if not selected:
            # Skip or treat as incorrect if not submitted
            continue
            
        is_correct = (selected == question.correct_option)
        
        if is_correct:
            total_correct += 1
            category_scores[question.category] += 1
            
        # Store individual answer records
        new_answer = models.Answer(
            user_id=current_user.id,
            question_id=question.id,
            selected_option=selected,
            is_correct=is_correct
        )
        db.add(new_answer)

    # Convert category scores to JSON string
    category_scores_json = json.dumps(category_scores)

    # 3. Save assessment
    new_assessment = models.Assessment(
        user_id=current_user.id,
        total_score=total_correct,
        category_scores=category_scores_json
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    # 4. Trigger the AI recommendation engine
    recommendations = recommendation_engine.calculate_recommendations(profile, new_assessment)
    
    for rec in recommendations:
        db_rec = models.Recommendation(
            user_id=current_user.id,
            career_name=rec["career_name"],
            match_percentage=rec["match_percentage"],
            reason=rec["reason"],
            required_skills=rec["required_skills"],
            missing_skills=rec["missing_skills"],
            salary_range=rec["salary_range"],
            future_scope=rec["future_scope"],
            job_demand=rec["job_demand"],
            difficulty=rec["difficulty"],
            roadmap=rec["roadmap"],
            recommended_certifications=rec["recommended_certifications"],
            top_hiring_companies=rec["top_hiring_companies"]
        )
        db.add(db_rec)
        
        # Also store the roadmap separately for easy access
        roadmap_json = json.loads(rec["roadmap"])
        db_roadmap = models.Roadmap(
            user_id=current_user.id,
            career_name=rec["career_name"],
            month_wise_plan=roadmap_json["month_wise_plan"],
            week_wise_plan=roadmap_json["week_wise_plan"],
            projects=roadmap_json["projects"],
            assignments=roadmap_json["assignments"],
            practice_problems=roadmap_json["practice_problems"],
            interview_prep=roadmap_json["interview_prep"]
        )
        db.add(db_roadmap)

    db.commit()
    return new_assessment
