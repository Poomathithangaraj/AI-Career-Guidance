import re
from typing import Dict, Any, List
from pypdf import PdfReader
import io

# Master list of tech and business skills for keyword matching
KNOWN_SKILLS = [
    "python", "java", "javascript", "html", "css", "react", "vue", "angular", "node.js", "express", 
    "fastapi", "django", "flask", "spring boot", "hibernate", "sql", "mysql", "postgresql", "mongodb", 
    "sqlite", "docker", "kubernetes", "aws", "azure", "google cloud", "git", "github", "linux", "unix", 
    "bash", "c", "c++", "c#", "machine learning", "deep learning", "nlp", "computer vision", 
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "tableau", "excel", "jira", "agile", 
    "scrum", "project management", "product management", "cybersecurity", "networking", "wireshark", 
    "cryptography", "embedded systems", "iot", "arduino", "raspberry pi", "quality assurance", "selenium", 
    "postman", "testing", "rest api", "graphql", "microservices", "ci/cd", "jenkins", "terraform"
]

EDUCATION_KEYWORDS = [
    "bachelor", "master", "phd", "b.tech", "m.tech", "b.e", "m.e", "bca", "mca", "b.sc", "m.sc",
    "university", "college", "institute", "school", "cgpa", "gpa"
]

CERTIFICATION_KEYWORDS = [
    "certified", "certification", "aws", "google cloud", "azure", "coursera", "udemy", "oracle",
    "comptia", "scrummaster", "pmp", "cisco", "ccna"
]

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Reads PDF binary content and returns raw text string."""
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def analyze_resume_text(text: str, preferred_career_skills: List[str] = None) -> Dict[str, Any]:
    """
    Parses resume text using heuristics and returns standard details:
    score, extracted skills, education, projects, certifications, missing skills, suggestions.
    """
    text_lower = text.lower()
    
    # 1. Extract Skills
    extracted_skills = []
    for skill in KNOWN_SKILLS:
        # Use word boundaries to avoid matching substrings (e.g. 'c' matching in every word)
        if len(skill) <= 3:
            pattern = rf"\b{re.escape(skill)}\b"
        else:
            pattern = re.escape(skill)
            
        if re.search(pattern, text_lower):
            # Capitalize properly
            extracted_skills.append(skill.title() if len(skill) > 3 else skill.upper())

    # 2. Extract Education
    education_lines = []
    lines = text.split("\n")
    for line in lines:
        if any(keyword in line.lower() for keyword in EDUCATION_KEYWORDS):
            cleaned = line.strip()
            if len(cleaned) > 10 and len(cleaned) < 150:
                education_lines.append(cleaned)
    
    # Clean education matches
    extracted_education = " | ".join(education_lines[:3]) if education_lines else "No formal education entries detected."

    # 3. Extract Projects
    # We look for sections titled Projects, Work Experience, etc. and count bullet points or headers
    project_keywords = ["project", "capstone", "portfolio", "application developed"]
    project_matches = []
    for line in lines:
        if any(keyword in line.lower() for keyword in project_keywords):
            cleaned = line.strip()
            if len(cleaned) > 15 and len(cleaned) < 150:
                project_matches.append(cleaned)
                
    extracted_projects = " | ".join(project_matches[:4]) if project_matches else "No structured projects section found."

    # 4. Extract Certifications
    cert_matches = []
    for line in lines:
        if any(keyword in line.lower() for keyword in CERTIFICATION_KEYWORDS):
            cleaned = line.strip()
            if len(cleaned) > 10 and len(cleaned) < 150 and not any(k in line.lower() for k in EDUCATION_KEYWORDS):
                cert_matches.append(cleaned)
                
    extracted_certifications = " | ".join(cert_matches[:4]) if cert_matches else "No certifications listed."

    # 5. Compute missing skills against selected path
    missing_skills = []
    if preferred_career_skills:
        for skill in preferred_career_skills:
            if skill.lower() not in [s.lower() for s in extracted_skills]:
                missing_skills.append(skill)
                
    # 6. Scoring Algorithm (Out of 100)
    score = 0
    # Skills: Up to 35 points (5 points per skill, max 7 skills)
    score += min(len(extracted_skills) * 5, 35)
    
    # Education completeness: 15 points
    if len(education_lines) > 0:
        score += 15
        
    # Projects detail: Up to 25 points (8 points per project, max 3)
    score += min(len(project_matches) * 8, 25)
    
    # Certifications: Up to 15 points (5 points per cert, max 3)
    score += min(len(cert_matches) * 5, 15)
    
    # Format layout quality (mocked check based on lengths): 10 points
    if len(text) > 500:
        score += 10

    # 7. Generate actionable suggestions
    suggestions = []
    if score < 50:
        suggestions.append("Your resume content appears very brief. Expand on your project details and core skills.")
    if len(extracted_skills) < 5:
        suggestions.append("Include a dedicated 'Technical Skills' section detailing programming languages, databases, and frameworks.")
    if not project_matches:
        suggestions.append("Add at least 2-3 detailed project summaries with technologies used, your role, and quantitative outcomes.")
    if not cert_matches:
        suggestions.append("Earn and display relevant industry credentials (e.g. AWS, Oracle, Google Cloud) to validate your skills.")
    if missing_skills:
        suggestions.append(f"To align with your target career, add matching skills: {', '.join(missing_skills[:4])}.")
        
    if not suggestions:
        suggestions.append("Excellent work! Your resume covers all core competencies. Consider tailing metrics to make it stand out.")

    return {
        "resume_score": score,
        "extracted_skills": ", ".join(extracted_skills),
        "extracted_education": extracted_education,
        "extracted_projects": extracted_projects,
        "extracted_certifications": extracted_certifications,
        "missing_skills": ", ".join(missing_skills),
        "suggestions": " \n".join(suggestions)
    }
