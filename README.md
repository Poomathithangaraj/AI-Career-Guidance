# AI Career Guidance Agent

An advanced, production-ready full-stack AI Career Guidance platform from scratch. It cross-analyzes core student parameters, qualifications, and exam performance to recommend technology tracks, map monthly study roadmaps, rank PDF resumes, and offer interview mock preps.

---

## Technical Stack Overview

### Backend Service
- **FastAPI**: Asynchronous high-performance API routing.
- **SQLAlchemy (ORM)**: Seamless mapping database layers.
- **JWT (HS256)**: Safe JSON Web Token authentication.
- **ReportLab**: Dynamic generation of corporate evaluation PDF portfolios.
- **PyPDF**: Heuristic keyword parsing algorithms inside resumes.

### Frontend Client
- **React (Vite)**: High performance SPA framework.
- **Tailwind CSS**: Custom premium styling dark/light visuals.
- **Framer Motion**: Micro-interactions and grid entrance animations.
- **Recharts**: Responsive category strength radar graphs and bars charts.
- **React Hook Form**: Form inputs bindings and validations controls.

### Database Layer
- **SQLite**: Local developmental ease.
- **MySQL**: Production-ready configurations.

---

## Project Directory Layout

```
career-guidance-agent/
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── recommendation_engine.py
│   │   ├── resume_analyzer.py
│   │   ├── pdf_generator.py
│   │   └── routers/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed_data.py
├── docs/
│   ├── api_docs.md
│   ├── installation_guide.md
│   └── deployment_guide.md
└── requirements.txt
```

---

## Quick Start Development Guide

1. Clone or open the project folder in your terminal workspace.
2. Setup and activate a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run the database seed script to populate MCQs, courses, and job listings:
   ```bash
   python ../database/seed_data.py
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
5. Install and launch the React frontend application:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`.
