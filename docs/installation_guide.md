# Detailed Installation Guide

This document describes how to configure the AI Career Guidance Agent locally on your system.

## Prerequisites
- Python 3.10 or higher
- Node.js v18 or higher (with npm)
- SQLite (pre-installed with Python standard library) or MySQL instance

---

## 1. Backend Service Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install requirements dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure your environmental settings:
   Copy `.env.example` to `.env` and fill the variables. By default, SQLite works out of the box.

6. Seed default datasets (questions, courses, jobs):
   Run the seed script:
   ```bash
   python ../database/seed_data.py
   ```

7. Fire up Uvicorn service:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Inspect API documentation at `http://localhost:8000/docs`.

---

## 2. Frontend Client Setup

1. Open a new terminal page and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. The client will boot at `http://localhost:5173`. Open it to explore the application interface.
