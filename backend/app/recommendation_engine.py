import json
import re
from typing import List, Dict, Any
from . import models

# Comprehensive definitions for the 20 requested career roles
CAREER_DATABASE = {
    "Software Engineer": {
        "required_skills": ["Data Structures", "Algorithms", "Git", "Problem Solving", "Software Design", "Testing"],
        "categories": ["Programming", "Problem Solving", "Logical Reasoning", "Mathematics"],
        "interests": ["software development", "coding", "problem solving", "algorithms"],
        "salary_range": "$80,000 - $140,000",
        "future_scope": "Growing demand with the continuous digital transformation of all business sectors.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "AWS Certified Developer, Scrum Alliance Certified ScrumMaster (CSM)",
        "top_hiring_companies": "Microsoft, Google, Amazon, Meta, Netflix",
        "base_reason": "Based on your strong foundations in core computer science, programming capabilities, and algorithmic problem-solving."
    },
    "Python Developer": {
        "required_skills": ["Python", "Django", "FastAPI", "Git", "SQL", "APIs"],
        "categories": ["Python", "Programming", "SQL", "Problem Solving"],
        "interests": ["python", "scripting", "backend development", "automation"],
        "salary_range": "$85,000 - $135,000",
        "future_scope": "Highly promising due to Python's dominance in web development, AI, automation, and scripting.",
        "job_demand": "High",
        "difficulty": "Easy",
        "recommended_certifications": "PCEP Certified Entry-Level Python Programmer, PCAP Certified Associate in Python Programming",
        "top_hiring_companies": "Instagram, Spotify, Dropbox, Netflix, Google",
        "base_reason": "Your high score in Python fundamentals combined with coding interest points strongly to a dedicated Python Developer track."
    },
    "Java Developer": {
        "required_skills": ["Java", "Spring Boot", "Hibernate", "Maven", "SQL", "Microservices"],
        "categories": ["Java", "Programming", "SQL", "Logical Reasoning"],
        "interests": ["enterprise applications", "backend development", "object-oriented programming", "java"],
        "salary_range": "$90,000 - $145,000",
        "future_scope": "Stable, long-term careers since Java is the backbone of banking and large corporate enterprise architectures.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "Oracle Certified Professional: Java SE Developer",
        "top_hiring_companies": "JPMorgan Chase, Oracle, Infosys, IBM, Accenture",
        "base_reason": "Your solid scoring in Java programming concepts and OOP architectures marks you as an ideal fit for enterprise Java systems."
    },
    "Frontend Developer": {
        "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git", "UI/UX Concepts"],
        "categories": ["Web Development", "Creativity", "Communication"],
        "interests": ["web apps", "design", "ui/ux", "visual arts", "frontend"],
        "salary_range": "$75,000 - $130,000",
        "future_scope": "Strong, since beautiful, fast user experiences are vital for every business's digital interface.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "Meta Front-End Developer Professional Certificate, W3Schools Front-End Creator",
        "top_hiring_companies": "Vercel, Shopify, Airbnb, Stripe, Figma",
        "base_reason": "Your high interest in design paired with strong scores in web development and creativity makes frontend development highly suitable."
    },
    "Backend Developer": {
        "required_skills": ["Node.js", "Python", "SQL", "FastAPI", "Docker", "Database Design", "APIs"],
        "categories": ["Programming", "SQL", "Networking", "Problem Solving"],
        "interests": ["backend development", "databases", "system architecture", "servers"],
        "salary_range": "$85,000 - $140,000",
        "future_scope": "Excellent. As microservices and database complexities scale, backend engineering remains highly critical.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "AWS Certified Solutions Architect, MongoDB Certified Developer",
        "top_hiring_companies": "Uber, Twitter, PayPal, Salesforce, Reddit",
        "base_reason": "Based on your proficiency in server-side technologies, database knowledge, and structured back-end architecture skills."
    },
    "Full Stack Developer": {
        "required_skills": ["React", "Node.js", "Express", "SQL", "Docker", "Git", "HTML/CSS"],
        "categories": ["Web Development", "Programming", "SQL", "Problem Solving", "Creativity"],
        "interests": ["full stack", "web development", "building apps", "databases"],
        "salary_range": "$95,000 - $155,000",
        "future_scope": "Extremely high. Versatile engineers who can build a feature from database to UI are highly sought after by startups and enterprises alike.",
        "job_demand": "Very High",
        "difficulty": "Hard",
        "recommended_certifications": "AWS Certified Developer, Full Stack Developer Nanodegree",
        "top_hiring_companies": "Stripe, Netflix, Meta, Microsoft, Amazon",
        "base_reason": "Your combined aptitude in both client-side and server-side components points to a high compatibility with Full Stack Engineering."
    },
    "AI Engineer": {
        "required_skills": ["Python", "TensorFlow", "PyTorch", "NLP", "Machine Learning", "Mathematics"],
        "categories": ["AI", "Machine Learning", "Python", "Mathematics", "Logical Reasoning"],
        "interests": ["artificial intelligence", "neural networks", "nlp", "automation"],
        "salary_range": "$110,000 - $185,000",
        "future_scope": "Exponential. AI is driving the current technological revolution worldwide.",
        "job_demand": "Very High",
        "difficulty": "Hard",
        "recommended_certifications": "Google Cloud Professional Machine Learning Engineer, DeepLearning.AI Specialization",
        "top_hiring_companies": "OpenAI, Google DeepMind, Anthropic, NVIDIA, Microsoft",
        "base_reason": "Based on your outstanding performance in Artificial Intelligence, Python programming, and advanced mathematics assessments."
    },
    "Machine Learning Engineer": {
        "required_skills": ["Python", "Machine Learning", "Scikit-Learn", "Data Pipelines", "SQL", "Mathematics"],
        "categories": ["Machine Learning", "Python", "Mathematics", "Logical Reasoning"],
        "interests": ["data science", "machine learning", "deep learning", "predictive modeling"],
        "salary_range": "$105,000 - $175,000",
        "future_scope": "Growing rapidly as companies implement ML algorithms in forecasting, recommendation engines, and automation.",
        "job_demand": "High",
        "difficulty": "Hard",
        "recommended_certifications": "AWS Certified Machine Learning - Specialty, TensorFlow Developer Certificate",
        "top_hiring_companies": "NVIDIA, Apple, Tesla, Amazon, Meta",
        "base_reason": "Your solid core in Machine Learning algorithms, combined with statistical skills and Python, aligns with ML Engineering."
    },
    "Data Scientist": {
        "required_skills": ["Python", "R", "SQL", "Statistics", "Data Visualization", "Pandas", "Machine Learning"],
        "categories": ["Mathematics", "Logical Reasoning", "SQL", "Machine Learning", "Business"],
        "interests": ["data analysis", "statistics", "business intelligence", "math"],
        "salary_range": "$100,000 - $160,000",
        "future_scope": "Consistently strong as companies seek data-driven insights to make strategic decisions.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "IBM Data Science Professional Certificate, Google Data Analytics Professional Certificate",
        "top_hiring_companies": "Airbnb, Uber, McKinsey, Deloitte, Google",
        "base_reason": "Your analytical mindset, solid math/stats score, database skills, and business comprehension suggest high compatibility with Data Science."
    },
    "Cloud Engineer": {
        "required_skills": ["AWS", "Azure", "Linux", "Networking", "Kubernetes", "Terraform", "Cloud Security"],
        "categories": ["Cloud Computing", "Networking", "Cyber Security"],
        "interests": ["cloud architecture", "virtualization", "networking", "system administration"],
        "salary_range": "$95,000 - $150,000",
        "future_scope": "Excellent as cloud migrations continue and multi-cloud architectures become standard.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "AWS Certified Solutions Architect - Associate, Google Certified Professional Cloud Engineer",
        "top_hiring_companies": "Amazon Web Services, Microsoft Azure, Google Cloud, Salesforce, IBM",
        "base_reason": "Strong performance in Cloud Computing, computer networking, and infrastructure layout tests."
    },
    "DevOps Engineer": {
        "required_skills": ["Docker", "Kubernetes", "CI/CD", "Bash Scripting", "Git", "AWS", "Python"],
        "categories": ["Cloud Computing", "Networking", "Programming", "Problem Solving"],
        "interests": ["automation", "ci/cd", "containers", "server infrastructure", "linux"],
        "salary_range": "$100,000 - $160,000",
        "future_scope": "Critical. Fast and automated deployment cycles are a key competitive advantage for all modern product teams.",
        "job_demand": "Very High",
        "difficulty": "Hard",
        "recommended_certifications": "Certified Kubernetes Administrator (CKA), AWS Certified DevOps Engineer - Professional",
        "top_hiring_companies": "HashiCorp, GitLab, Red Hat, Amazon, Meta",
        "base_reason": "Your aptitude for system scripting, automation concepts, and cloud networking makes you highly eligible for DevOps roles."
    },
    "Cyber Security Analyst": {
        "required_skills": ["Networking", "Firewalls", "Linux", "Penetration Testing", "Security Operations", "Cryptography"],
        "categories": ["Cyber Security", "Networking", "Logical Reasoning", "Problem Solving"],
        "interests": ["cybersecurity", "ethical hacking", "networking", "risk assessment"],
        "salary_range": "$90,000 - $145,000",
        "future_scope": "Crucial. Rising cyber threats worldwide guarantee long-term demand and high job security.",
        "job_demand": "Very High",
        "difficulty": "Hard",
        "recommended_certifications": "CompTIA Security+, Certified Information Systems Security Professional (CISSP), CEH",
        "top_hiring_companies": "Palo Alto Networks, CrowdStrike, FireEye, CIA, PwC",
        "base_reason": "Your high assessment marks in Cybersecurity principles, network routing security, and logical systems testing match this role."
    },
    "Business Analyst": {
        "required_skills": ["SQL", "Excel", "Data Visualization", "Requirements Analysis", "Agile", "Tableau"],
        "categories": ["Business", "Logical Reasoning", "Communication", "SQL"],
        "interests": ["business consulting", "data analysis", "finance", "strategy"],
        "salary_range": "$75,000 - $115,000",
        "future_scope": "Strong. Bridges the gap between tech developers and business units using data metrics.",
        "job_demand": "Medium",
        "difficulty": "Easy",
        "recommended_certifications": "IIBA Certified Business Analysis Professional (CBAP), PMI-PBA",
        "top_hiring_companies": "McKinsey, Deloitte, Accenture, Ernst & Young, Goldman Sachs",
        "base_reason": "Excellent communication, logical analysis, SQL familiarity, and strong business comprehension scores."
    },
    "Database Administrator": {
        "required_skills": ["SQL", "MySQL", "PostgreSQL", "Database Design", "Backup & Recovery", "Performance Tuning"],
        "categories": ["SQL", "Logical Reasoning", "Embedded Systems"],
        "interests": ["databases", "data modeling", "storage systems", "sql tuning"],
        "salary_range": "$80,000 - $125,000",
        "future_scope": "Moderate/Stable. Shifts to cloud-native database management but core optimization remains crucial.",
        "job_demand": "Medium",
        "difficulty": "Medium",
        "recommended_certifications": "Oracle Database Administration Certified Professional, Microsoft Certified: Azure Database Administrator",
        "top_hiring_companies": "Oracle, IBM, SQL Server consultancies, banks, hospital networks",
        "base_reason": "Your top performance in SQL databases, schema normalization, and logical data organization models."
    },
    "QA Engineer": {
        "required_skills": ["Manual Testing", "Selenium", "Python", "Postman", "CI/CD", "Bug Tracking"],
        "categories": ["Programming", "Logical Reasoning", "Communication", "Problem Solving"],
        "interests": ["quality assurance", "software testing", "automation", "debugging"],
        "salary_range": "$65,000 - $110,000",
        "future_scope": "Stable. Shift from manual testing to automation QA engineers has increased industry salaries and demand.",
        "job_demand": "Medium",
        "difficulty": "Easy",
        "recommended_certifications": "ISTQB Certified Tester, Selenium Certified Professional",
        "top_hiring_companies": "Cognizant, TCS, Infosys, Capgemini, EPAM",
        "base_reason": "Your precise logical checking, programming basics, and strong communication skills match software quality testing demands."
    },
    "Embedded Engineer": {
        "required_skills": ["C/C++", "Embedded C", "Microcontrollers", "RTOS", "Hardware Debugging", "Firmware development"],
        "categories": ["Embedded Systems", "IoT", "Mathematics", "Problem Solving"],
        "interests": ["hardware", "microchips", "robotics", "c programming", "electronics"],
        "salary_range": "$85,000 - $140,000",
        "future_scope": "Excellent. Key to the automotive transition (EVs), medical devices, and smart consumer electronics.",
        "job_demand": "High",
        "difficulty": "Hard",
        "recommended_certifications": "ARM Accredited Engineer, Embedded Systems Certification",
        "top_hiring_companies": "Intel, Qualcomm, Texas Instruments, Tesla, Bosch",
        "base_reason": "Outstanding score in embedded systems architecture, microchip electronics, and C/C++ programming foundations."
    },
    "IoT Engineer": {
        "required_skills": ["IoT Protocols (MQTT, CoAP)", "Arduino/Raspberry Pi", "Python", "Networking", "Sensors", "Embedded Systems"],
        "categories": ["IoT", "Embedded Systems", "Networking", "Cloud Computing"],
        "interests": ["smart home", "robotics", "sensors", "microcontrollers", "connected devices"],
        "salary_range": "$90,000 - $145,000",
        "future_scope": "Excellent. Scalability of smart factories, smart cities, and agriculture drives high demand.",
        "job_demand": "High",
        "difficulty": "Hard",
        "recommended_certifications": "AWS Certified IoT - Specialty, Cisco Certified DevNet Specialist - IoT",
        "top_hiring_companies": "Siemens, GE Digital, Cisco, Honeywell, Bosch",
        "base_reason": "High marks in IoT architecture, hardware systems, networking protocols, and cloud communication."
    },
    "Electronics Engineer": {
        "required_skills": ["Circuit Design", "PCB Layout", "Oscilloscopes", "MATLAB", "Analog Electronics", "VHDL/Verilog"],
        "categories": ["Embedded Systems", "Mathematics", "IoT", "Logical Reasoning"],
        "interests": ["electronics", "circuit design", "hardware", "signal processing"],
        "salary_range": "$80,000 - $130,000",
        "future_scope": "Stable. Vital for semiconductor manufacturing, telecom infrastructure, and consumer electronics.",
        "job_demand": "Medium",
        "difficulty": "Hard",
        "recommended_certifications": "IEEE Certifications, FE Electrical and Computer exam",
        "top_hiring_companies": "Intel, Apple, NVIDIA, AMD, Samsung",
        "base_reason": "Strong performance in mathematical modeling, electrical hardware design principles, and logical circuits."
    },
    "Project Manager": {
        "required_skills": ["Agile", "Scrum", "Risk Management", "Project Scheduling", "Budgets", "Leadership"],
        "categories": ["Leadership", "Teamwork", "Business", "Communication"],
        "interests": ["leadership", "management", "organizing", "business strategy"],
        "salary_range": "$85,000 - $135,000",
        "future_scope": "Consistently strong. Every tech development cycle requires leadership to organize teams and milestones.",
        "job_demand": "High",
        "difficulty": "Medium",
        "recommended_certifications": "Project Management Professional (PMP), Certified ScrumMaster (CSM)",
        "top_hiring_companies": "IBM, Google, Microsoft, Accenture, Lockheed Martin",
        "base_reason": "High rating in leadership traits, team coordination, effective business principles, and stellar communication."
    },
    "Product Manager": {
        "required_skills": ["Product Strategy", "User Research", "Roadmapping", "A/B Testing", "Agile", "Data Analytics"],
        "categories": ["Business", "Creativity", "Communication", "Leadership", "Teamwork"],
        "interests": ["product strategy", "ui/ux", "entrepreneurship", "business growth"],
        "salary_range": "$95,000 - $160,000",
        "future_scope": "Extremely high. Product management is recognized as a key business driver in all tech organizations.",
        "job_demand": "High",
        "difficulty": "Hard",
        "recommended_certifications": "Pragmatic Institute Certified, Product Manager Certificate (PMC)",
        "top_hiring_companies": "Google, Meta, Uber, Airbnb, Stripe",
        "base_reason": "A perfect combination of creativity, business acumen, leadership skills, and clear communication scores."
    }
}

def generate_roadmap(career_name: str) -> Dict[str, Any]:
    """Generates standard month-wise and week-wise study plans for the career path."""
    skills = CAREER_DATABASE.get(career_name, {}).get("required_skills", ["Skill A", "Skill B", "Skill C"])
    
    months = [
        {"month": 1, "topic": f"Foundations: {skills[0]} & Basics", "details": f"Focus on understanding core principles of {skills[0]}. Build small, static scripts or layouts to practice."},
        {"month": 2, "topic": f"Intermediate: {skills[1] if len(skills) > 1 else skills[0]} & Databases", "details": f"Learn database connection methods, simple ORMs, and implement version control systems."},
        {"month": 3, "topic": f"Advanced Concepts: {skills[2] if len(skills) > 2 else skills[0]} Integration", "details": "Work with asynchronous operations, advanced design patterns, and package managers."},
        {"month": 4, "topic": "Project Development & Deployment", "details": "Build a comprehensive capstone project utilizing all three primary skills. Deploy on free hosting platforms."}
    ]
    
    weeks = [
        {"week": 1, "topic": "Setup & Basic Syntax", "practice": "Configure development environment and complete 10 fundamental syntax exercises."},
        {"week": 2, "topic": "Control Structures & Data Flow", "practice": "Build loops, logical pathways, and conditional code fragments."},
        {"week": 3, "topic": "Functions & Modular Design", "practice": "Refactor previous exercises into reusable modular components."},
        {"week": 4, "topic": "First Minor Project", "practice": "Create a fully functional script or simple UI page implementing core logic."}
    ]
    
    projects = [
        {"title": f"Complete {career_name} Dashboard", "description": f"A full-featured management tool leveraging {', '.join(skills[:3])} to solve real-world problems.", "difficulty": "Intermediate"},
        {"title": "Open Source Contribution", "description": "Identify a minor bug or documentation update in a public library related to your stack and submit a pull request.", "difficulty": "Hard"}
    ]
    
    assignments = [
        {"title": "Unit Testing Suite", "task": "Write comprehensive unit tests achieving at least 80% coverage on your first project."},
        {"title": "Database Schema Design", "task": "Design a relational schema with at least 5 tables, showing primary and foreign key mapping."}
    ]
    
    practice_problems = [
        {"problem": "Reverse a Linked List", "platform": "LeetCode / HackerRank", "category": "Algorithms"},
        {"problem": "Implement an API Rate Limiter", "platform": "System Design", "category": "Backend Operations"}
    ]
    
    interview_prep = [
        {"topic": "Behavioral Questions (STAR Method)", "tip": "Prepare 3 scenarios where you handled team conflicts or technical blockers."},
        {"topic": "System Design & Scalability", "tip": f"Be ready to explain how you would scale a {career_name} application under heavy load."}
    ]
    
    return {
        "month_wise_plan": json.dumps(months),
        "week_wise_plan": json.dumps(weeks),
        "projects": json.dumps(projects),
        "assignments": json.dumps(assignments),
        "practice_problems": json.dumps(practice_problems),
        "interview_prep": json.dumps(interview_prep)
    }

def calculate_recommendations(profile: models.Profile, assessment: models.Assessment) -> List[Dict[str, Any]]:
    """
    Computes matches based on Profile details and Assessment category scores.
    Returns the top 5 careers.
    """
    category_scores = {}
    if assessment and assessment.category_scores:
        try:
            category_scores = json.loads(assessment.category_scores)
        except Exception:
            category_scores = {}

    user_skills = [s.strip().lower() for s in (profile.current_skills or "").split(",") if s.strip()]
    user_interests = [i.strip().lower() for i in (profile.interests or "").split(",") if i.strip()]
    
    recommendations_list = []
    
    for career_name, details in CAREER_DATABASE.items():
        score = 0.0
        
        # 1. Assessment score alignment (Weight: 50%)
        category_matches = 0
        total_category_score = 0.0
        for category in details["categories"]:
            # Max score per category is usually 5 questions (e.g. 5 points)
            cat_score = category_scores.get(category, 0)
            # Normalize to 0-1 (assuming max is 5, but handle safety)
            normalized_score = min(float(cat_score) / 5.0, 1.0)
            total_category_score += normalized_score
            category_matches += 1
            
        assessment_match = (total_category_score / category_matches) if category_matches > 0 else 0.5
        score += assessment_match * 50.0
        
        # 2. Profile skills match (Weight: 25%)
        req_skills_lower = [s.lower() for s in details["required_skills"]]
        matching_skills = [s for s in user_skills if s in req_skills_lower]
        skills_match = (len(matching_skills) / len(req_skills_lower)) if req_skills_lower else 0.0
        score += skills_match * 25.0
        
        # 3. Profile interests match (Weight: 15%)
        career_interests = details["interests"]
        matching_interests = [i for i in user_interests if any(ci in i or i in ci for ci in career_interests)]
        interests_match = (len(matching_interests) / len(career_interests)) if career_interests else 0.0
        score += interests_match * 15.0
        
        # 4. Academic score / CGPA / General preference (Weight: 10%)
        cgpa_val = profile.cgpa or 7.0
        cgpa_match = min(cgpa_val / 10.0, 1.0)
        score += cgpa_match * 10.0
        
        # Ensure minimum score of 40% to make it encouraging, and cap at 98%
        match_percentage = round(max(40.0, min(score, 98.0)), 1)
        
        # Compute missing skills
        missing_skills_list = [s for s in details["required_skills"] if s.lower() not in user_skills]
        
        # Personalized reason
        reasons_list = [details["base_reason"]]
        if matching_skills:
            reasons_list.append(f"You already possess key skills like {', '.join(matching_skills[:2])}.")
        if matching_interests:
            reasons_list.append(f"Your interest in {', '.join(matching_interests[:2])} perfectly aligns here.")
        if assessment_match > 0.7:
            reasons_list.append("Your performance in relevant technical and logical sections of the assessment was exceptionally strong.")
            
        full_reason = " ".join(reasons_list)
        
        recommendations_list.append({
            "career_name": career_name,
            "match_percentage": match_percentage,
            "reason": full_reason,
            "required_skills": json.dumps(details["required_skills"]),
            "missing_skills": json.dumps(missing_skills_list),
            "salary_range": details["salary_range"],
            "future_scope": details["future_scope"],
            "job_demand": details["job_demand"],
            "difficulty": details["difficulty"],
            "recommended_certifications": details["recommended_certifications"],
            "top_hiring_companies": details["top_hiring_companies"]
        })
        
    # Sort recommendations by match percentage descending
    recommendations_list.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    # Return top 5 recommendations with generated roadmaps attached
    top_5 = recommendations_list[:5]
    for rec in top_5:
        roadmap_data = generate_roadmap(rec["career_name"])
        rec["roadmap"] = json.dumps(roadmap_data)
        
    return top_5
