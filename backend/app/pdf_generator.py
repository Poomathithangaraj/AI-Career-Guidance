import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from typing import Dict, Any, List

def generate_career_pdf(
    file_path: str,
    user_email: str,
    profile_data: Dict[str, Any],
    assessment_data: Dict[str, Any],
    recommendations: List[Dict[str, Any]],
    resume_analysis: Dict[str, Any] = None
):
    """
    Generates a beautifully structured PDF document at the given file_path
    incorporating the candidate's career guidelines, roadmaps, and profile.
    """
    doc = SimpleDocTemplate(
        file_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom color palette (sleek slate/navy theme)
    PRIMARY_COLOR = colors.HexColor("#1A365D")   # Deep navy
    SECONDARY_COLOR = colors.HexColor("#2B6CB0") # Slate blue
    ACCENT_COLOR = colors.HexColor("#319795")    # Teal accent
    TEXT_DARK = colors.HexColor("#2D3748")       # Dark charcoal
    BG_LIGHT = colors.HexColor("#F7FAFC")        # Off white
    
    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY_COLOR,
        alignment=1, # Center
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY_COLOR,
        alignment=1,
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'H1Header',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY_COLOR,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2Header',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY_COLOR,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_DARK,
        spaceAfter=6
    )
    
    bold_body_style = ParagraphStyle(
        'BoldBodyText',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    story = []
    
    # ------------------ COVER PAGE / HEADER ------------------
    story.append(Spacer(1, 40))
    story.append(Paragraph("AI CAREER GUIDANCE AGENT", title_style))
    story.append(Paragraph("Comprehensive Career Fitment & Professional Growth Report", subtitle_style))
    story.append(Spacer(1, 10))
    
    # Profile information table
    profile_info = [
        [Paragraph("Candidate Email:", bold_body_style), Paragraph(user_email, body_style),
         Paragraph("Full Name:", bold_body_style), Paragraph(profile_data.get("full_name") or "Not Completed", body_style)],
        [Paragraph("College / Univ:", bold_body_style), Paragraph(profile_data.get("college") or "N/A", body_style),
         Paragraph("Department:", bold_body_style), Paragraph(profile_data.get("department") or "N/A", body_style)],
        [Paragraph("Qualification:", bold_body_style), Paragraph(profile_data.get("qualification") or "N/A", body_style),
         Paragraph("CGPA / GPA:", bold_body_style), Paragraph(str(profile_data.get("cgpa") or "N/A"), body_style)]
    ]
    
    t_profile = Table(profile_info, colWidths=[100, 160, 100, 160])
    t_profile.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY_COLOR),
    ]))
    
    story.append(Paragraph("Candidate Profile Summary", h1_style))
    story.append(t_profile)
    story.append(Spacer(1, 20))
    
    # ------------------ ASSESSMENT METRICS ------------------
    story.append(Paragraph("Career Assessment Performance", h1_style))
    total_q_score = assessment_data.get("total_score", 0)
    score_p = f"{total_q_score} / 50 Correct"
    
    category_scores_str = assessment_data.get("category_scores", "{}")
    try:
        cat_scores = json.loads(category_scores_str)
    except Exception:
        cat_scores = {}
        
    assessment_info = [
        [Paragraph("Overall Exam Performance:", bold_body_style), Paragraph(score_p, body_style)],
        [Paragraph("Category Wise Strengths:", bold_body_style), 
         Paragraph(", ".join([f"{k} ({v}/5)" for k, v in list(cat_scores.items())[:6]]), body_style)]
    ]
    t_assess = Table(assessment_info, colWidths=[160, 360])
    t_assess.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.grey),
    ]))
    story.append(t_assess)
    story.append(Spacer(1, 20))
    
    # ------------------ RESUME SCORE ANALYSIS ------------------
    if resume_analysis and resume_analysis.get("resume_score"):
        story.append(Paragraph("Resume Scan & Scoring Details", h1_style))
        resume_info = [
            [Paragraph("Document Evaluated:", bold_body_style), Paragraph(resume_analysis.get("filename") or "resume.pdf", body_style)],
            [Paragraph("AI Score:", bold_body_style), Paragraph(f"{resume_analysis.get('resume_score')}/100", bold_body_style)],
            [Paragraph("Extracted Skills:", bold_body_style), Paragraph(resume_analysis.get("extracted_skills") or "None detected", body_style)],
            [Paragraph("Key Suggestions:", bold_body_style), Paragraph(resume_analysis.get("suggestions") or "None", body_style)]
        ]
        t_resume = Table(resume_info, colWidths=[140, 380])
        t_resume.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('PADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 0.5, ACCENT_COLOR),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_resume)
        story.append(Spacer(1, 20))
        
    story.append(PageBreak())
    
    # ------------------ CAREER RECOMMENDATIONS ------------------
    story.append(Paragraph("Top Recommended Career Pathways", h1_style))
    story.append(Paragraph("Based on multi-criteria analysis of skills, evaluation scores, academic records, and career interests, we recommend these tracks:", body_style))
    story.append(Spacer(1, 10))
    
    for idx, rec in enumerate(recommendations):
        career_header = f"{idx + 1}. {rec['career_name']} (Compatibility: {rec['match_percentage']}%)"
        story.append(Paragraph(career_header, h2_style))
        
        # Details grid
        skills_req = ", ".join(json.loads(rec.get("required_skills", "[]")))
        skills_miss = ", ".join(json.loads(rec.get("missing_skills", "[]")))
        if not skills_miss:
            skills_miss = "No gaps detected! Excellent skill coverage."
            
        rec_details = [
            [Paragraph("Match Reason:", bold_body_style), Paragraph(rec["reason"], body_style)],
            [Paragraph("Required Skills:", bold_body_style), Paragraph(skills_req, body_style)],
            [Paragraph("Your Skill Gaps:", bold_body_style), Paragraph(skills_miss, body_style)],
            [Paragraph("Est. Salary Range:", bold_body_style), Paragraph(rec["salary_range"], body_style),
             Paragraph("Hiring Companies:", bold_body_style), Paragraph(rec["top_hiring_companies"], body_style)],
            [Paragraph("Market Demand:", bold_body_style), Paragraph(rec["job_demand"], body_style),
             Paragraph("Difficulty Index:", bold_body_style), Paragraph(rec["difficulty"], body_style)]
        ]
        t_rec = Table(rec_details, colWidths=[110, 150, 110, 150])
        t_rec.setStyle(TableStyle([
            ('SPAN', (1,0), (3,0)), # Span reason across
            ('SPAN', (1,1), (3,1)), # Span required skills
            ('SPAN', (1,2), (3,2)), # Span gaps
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.lightgrey),
            ('BOX', (0,0), (-1,-1), 1, SECONDARY_COLOR),
        ]))
        story.append(t_rec)
        story.append(Spacer(1, 15))
        
    # Build Document
    doc.build(story)
    print(f"Report generated successfully at: {file_path}")
