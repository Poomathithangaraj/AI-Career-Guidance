import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, profile, assessment, dashboard, recommendation, courses, jobs, resume, report, admin

# Automatic table creation (for SQLite / developmental ease)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Career Guidance Agent Backend",
    description="REST APIs supporting career assessments, resume parsing, and learning roadmap generation",
    version="1.0.0"
)

# CORS configurations to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API sub-routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(assessment.router)
app.include_router(dashboard.router)
app.include_router(recommendation.router)
app.include_router(courses.router)
app.include_router(jobs.router)
app.include_router(resume.router)
app.include_router(report.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "service": "AI Career Guidance Agent Engine",
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
