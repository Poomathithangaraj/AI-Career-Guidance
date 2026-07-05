import os
import mimetypes
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Force correct Windows MIME types for React static assets
mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
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
    allow_origins=["*"],
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

# Mount the static assets folder from frontend/dist
frontend_dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

# Mount assets folder if it exists
assets_dir = os.path.join(frontend_dist_dir, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# Fallback route for React Router (Single Page Application serving)
@app.get("/{catchall:path}")
def serve_react_app(catchall: str):
    # If a specific static file is requested and exists, serve it
    file_path = os.path.join(frontend_dist_dir, catchall)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Otherwise, return the main index.html for client-side routing
    index_path = os.path.join(frontend_dist_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "Frontend build files (dist/) not found. Please build the frontend."}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

