#!/usr/bin/env python3
"""
Convenience startup script for the AI Career Guidance Agent backend.
Run from the project root: python start_backend.py
"""
import os
import sys
import subprocess

# Change to backend directory for proper module resolution
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
os.chdir(backend_dir)

# Add backend to path
sys.path.insert(0, backend_dir)

# First: ensure database tables exist and are seeded
print("Initializing database and seeding default data...")
try:
    # Import and run seed
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from database.seed_data import seed_db
    seed_db()
    print("Database ready.")
except Exception as e:
    print(f"Seed step note: {e} (May already be seeded — continuing)")

# Start the FastAPI server
print("\nStarting FastAPI server at http://localhost:8000 ...")
print("API docs available at: http://localhost:8000/docs\n")

subprocess.run([
    sys.executable, "-m", "uvicorn",
    "app.main:app",
    "--host", "0.0.0.0",
    "--port", "8000",
    "--reload"
])
