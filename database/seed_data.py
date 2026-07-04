import os
import sys
import json

# Adjust sys path so we can import from backend
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database import SessionLocal, engine, Base
from app import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

QUESTIONS = [
    # 1. Programming
    {
        "category": "Programming",
        "question_text": "Which of the following describes the 'Object-Oriented Programming' concept where code is hidden inside a class and accessed only via methods?",
        "option_a": "Inheritance", "option_b": "Polymorphism", "option_c": "Encapsulation", "option_d": "Abstraction",
        "correct_option": "C"
    },
    {
        "category": "Programming",
        "question_text": "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        "option_a": "O(1)", "option_b": "O(log n)", "option_c": "O(n)", "option_d": "O(n log n)",
        "correct_option": "B"
    },
    {
        "category": "Programming",
        "question_text": "In memory management, what is a memory leak?",
        "option_a": "An error when a program accesses restricted memory.",
        "option_b": "When a computer runs out of physical RAM.",
        "option_c": "Failure to release allocated memory that is no longer needed.",
        "option_d": "When data is corrupted in cache registries.",
        "correct_option": "C"
    },
    # 2. Python
    {
        "category": "Python",
        "question_text": "What is the primary difference between a list and a tuple in Python?",
        "option_a": "Lists are immutable while tuples are mutable.",
        "option_b": "Tuples are immutable while lists are mutable.",
        "option_c": "Lists can store mixed types but tuples cannot.",
        "option_d": "Tuples are faster and consume more memory than lists.",
        "correct_option": "B"
    },
    {
        "category": "Python",
        "question_text": "What does the '__init__' method do in a Python class?",
        "option_a": "Initializes the module at runtime.",
        "option_b": "Constructs and initializes a newly created class object instance.",
        "option_c": "Destroys instance variables from database caches.",
        "option_d": "Registers class properties into global namespace.",
        "correct_option": "B"
    },
    {
        "category": "Python",
        "question_text": "In Python, which keyword is used to handle exceptions inside a try block?",
        "option_a": "catch", "option_b": "except", "option_c": "error", "option_d": "finally",
        "correct_option": "B"
    },
    # 3. Java
    {
        "category": "Java",
        "question_text": "Which memory area in Java is responsible for storing objects and instances created at runtime?",
        "option_a": "Stack Memory", "option_b": "Heap Memory", "option_c": "Method Area", "option_d": "Register Storage",
        "correct_option": "B"
    },
    {
        "category": "Java",
        "question_text": "What is the keyword 'final' used to declare in Java?",
        "option_a": "An entity that cannot be modified, inherited, or overridden.",
        "option_b": "The end of a program's class definitions.",
        "option_c": "A block that runs only at compilation completion.",
        "option_d": "Garbage collection trigger signals.",
        "correct_option": "A"
    },
    {
        "category": "Java",
        "question_text": "What is the purpose of the Java Virtual Machine (JVM)?",
        "option_a": "Compile Java source files directly into native machine architecture.",
        "option_b": "Run Java bytecode on any device by translating it to native instructions.",
        "option_c": "Analyze syntax bugs before running code.",
        "option_d": "Build user interfaces dynamically.",
        "correct_option": "B"
    },
    # 4. SQL
    {
        "category": "SQL",
        "question_text": "Which SQL statement is used to remove all records from a table without logging individual row deletions?",
        "option_a": "DELETE", "option_b": "DROP", "option_c": "TRUNCATE", "option_d": "REMOVE",
        "correct_option": "C"
    },
    {
        "category": "SQL",
        "question_text": "What is a Foreign Key in database design?",
        "option_a": "A key that is encrypted for database security.",
        "option_b": "A field in one table that uniquely identifies a row in another table.",
        "option_c": "The primary column holding large binary blob structures.",
        "option_d": "A key imported from a foreign software system.",
        "correct_option": "B"
    },
    {
        "category": "SQL",
        "question_text": "Which SQL clause is used to filter group results after grouping rows using GROUP BY?",
        "option_a": "WHERE", "option_b": "HAVING", "option_c": "SELECT", "option_d": "ORDER BY",
        "correct_option": "B"
    },
    # 5. Web Development
    {
        "category": "Web Development",
        "question_text": "Which HTTP status code represents a successful resource creation on a REST server?",
        "option_a": "200 OK", "option_b": "201 Created", "option_c": "204 No Content", "option_d": "301 Moved Permanently",
        "correct_option": "B"
    },
    {
        "category": "Web Development",
        "question_text": "What does the DOM stand for in frontend engineering?",
        "option_a": "Database Object Mapping",
        "option_b": "Data Oriented Methodologies",
        "option_c": "Document Object Model",
        "option_d": "Desktop Online Management",
        "correct_option": "C"
    },
    {
        "category": "Web Development",
        "question_text": "What is the purpose of CSS media queries?",
        "option_a": "To include audio and video playbacks on a webpage.",
        "option_b": "To apply styling rules conditionally based on device width or screen aspects.",
        "option_c": "To fetch styling sheets asynchronously from Google Servers.",
        "option_d": "To validate HTML document syntax trees.",
        "correct_option": "B"
    },
    # 6. AI
    {
        "category": "AI",
        "question_text": "Which AI concept deals with a system search path finding the shortest distance using heuristic estimates?",
        "option_a": "Breadth-First Search", "option_b": "A* Search", "option_c": "Depth-First Search", "option_d": "Minimax Algorithm",
        "correct_option": "B"
    },
    {
        "category": "AI",
        "question_text": "What does Natural Language Processing (NLP) focus on?",
        "option_a": "Coding program languages naturally.",
        "option_b": "Enabling computers to read, decipher, and understand human languages.",
        "option_c": "Improving execution speeds of speech synthesizers.",
        "option_d": "Compiling compiler tokens into binary trees.",
        "correct_option": "B"
    },
    {
        "category": "AI",
        "question_text": "In artificial neural networks, what does backpropagation accomplish?",
        "option_a": "Directing output signals backwards through microchips.",
        "option_b": "Calculating gradients and updating weights to minimize prediction errors.",
        "option_c": "Pruning inactive neurons to save processing power.",
        "option_d": "Retrieving data from secondary database storage.",
        "correct_option": "B"
    },
    # 7. Machine Learning
    {
        "category": "Machine Learning",
        "question_text": "Which of the following is a classic example of Unsupervised Machine Learning?",
        "option_a": "Linear Regression", "option_b": "K-Means Clustering", "option_c": "Support Vector Machines", "option_d": "Logistic Regression",
        "correct_option": "B"
    },
    {
        "category": "Machine Learning",
        "question_text": "What is overfitting in Machine Learning?",
        "option_a": "When a model is too simple to capture patterns in training data.",
        "option_b": "When a model learns training data noise and performs poorly on unseen test data.",
        "option_c": "When training dataset contains too many records.",
        "option_d": "When validation datasets are larger than training structures.",
        "correct_option": "B"
    },
    {
        "category": "Machine Learning",
        "question_text": "In binary classification evaluation, what does the 'Precision' metric measure?",
        "option_a": "Proportion of actual positive cases correctly identified.",
        "option_b": "Proportion of positive predictions that were actually correct.",
        "option_c": "Total correctness of both positive and negative assessments.",
        "option_d": "Speed of calculating validation metrics.",
        "correct_option": "B"
    },
    # 8. Cloud Computing
    {
        "category": "Cloud Computing",
        "question_text": "What does SaaS stand for in cloud architecture models?",
        "option_a": "System as a Service",
        "option_b": "Software as a Service",
        "option_c": "Storage and Application Services",
        "option_d": "Secure Authentication and Access Server",
        "correct_option": "B"
    },
    {
        "category": "Cloud Computing",
        "question_text": "What is the primary function of a Load Balancer in cloud infrastructure?",
        "option_a": "Distributing incoming traffic evenly across multiple server nodes.",
        "option_b": "Encrypting network tunnels to shield databases.",
        "option_c": "Balancing electrical grid loads in data centers.",
        "option_d": "Backing up VM snapshots automatically.",
        "correct_option": "A"
    },
    {
        "category": "Cloud Computing",
        "question_text": "Which cloud computing deployment model allows sharing resource control between public cloud providers and local on-premise networks?",
        "option_a": "Private Cloud", "option_b": "Community Cloud", "option_c": "Hybrid Cloud", "option_d": "Distributed Mesh",
        "correct_option": "C"
    },
    # 9. Cyber Security
    {
        "category": "Cyber Security",
        "question_text": "What is the difference between Symmetric and Asymmetric Cryptography?",
        "option_a": "Symmetric uses two keys; Asymmetric uses one.",
        "option_b": "Symmetric uses the same key for encryption/decryption; Asymmetric uses public-private keypairs.",
        "option_c": "Asymmetric is faster and less secure than Symmetric.",
        "option_d": "Symmetric is purely local while Asymmetric works over the internet.",
        "correct_option": "B"
    },
    {
        "category": "Cyber Security",
        "question_text": "Which type of security attack involves intercepting communication between two systems without their knowledge?",
        "option_a": "Distributed Denial of Service (DDoS)",
        "option_b": "SQL Injection",
        "option_c": "Man-in-the-Middle (MitM) Attack",
        "option_d": "Phishing",
        "correct_option": "C"
    },
    {
        "category": "Cyber Security",
        "question_text": "What is a firewall in network security configurations?",
        "option_a": "A physical wall that blocks thermal hazards in servers.",
        "option_b": "A software or hardware barrier that filters incoming/outgoing traffic based on security rules.",
        "option_c": "An encrypted password storage database.",
        "option_d": "A utility that cleans malware from compromised files.",
        "correct_option": "B"
    },
    # 10. Networking
    {
        "category": "Networking",
        "question_text": "Which layer of the OSI model is responsible for routing data packets across different networks?",
        "option_a": "Data Link Layer", "option_b": "Network Layer", "option_c": "Transport Layer", "option_d": "Physical Layer",
        "correct_option": "B"
    },
    {
        "category": "Networking",
        "question_text": "What does DHCP do on a local computer network?",
        "option_a": "Translates domain names to IP addresses.",
        "option_b": "Automatically assigns IP addresses to devices connecting to the network.",
        "option_c": "Controls file sharing permissions among workstations.",
        "option_d": "Translates private IP ranges to public network routers.",
        "correct_option": "B"
    },
    # 11. Embedded Systems
    {
        "category": "Embedded Systems",
        "question_text": "What is a Real-Time Operating System (RTOS)?",
        "option_a": "An OS that updates its graphics UI instantly.",
        "option_b": "An OS designed to serve application requests precisely within strict timing constraints.",
        "option_c": "An OS that runs only in virtual simulators.",
        "option_d": "A light OS used for general smartphone devices.",
        "correct_option": "B"
    },
    {
        "category": "Embedded Systems",
        "question_text": "In microcontrollers, what does GPIO stand for?",
        "option_a": "General Purpose Input/Output",
        "option_b": "Global Protocol Interface Option",
        "option_c": "Gateway Port for Integrated Operations",
        "option_d": "Graphical Program Input Output",
        "correct_option": "A"
    },
    # 12. IoT
    {
        "category": "IoT",
        "question_text": "Which lightweight messaging protocol is most commonly used in IoT networks due to its low bandwidth requirement?",
        "option_a": "HTTP", "option_b": "MQTT", "option_c": "FTP", "option_d": "SMTP",
        "correct_option": "B"
    },
    {
        "category": "IoT",
        "question_text": "In IoT, what is the role of an 'Actuator'?",
        "option_a": "To collect and measure environmental metrics like temperature.",
        "option_b": "To convert electrical signals from controllers into physical movement or action.",
        "option_c": "To back up sensor data on cloud repositories.",
        "option_d": "To route IP packets between smart devices.",
        "correct_option": "B"
    },
    # 13. Problem Solving
    {
        "category": "Problem Solving",
        "question_text": "When resolving a complex bug in a large system, what is the best first step?",
        "option_a": "Rewrite the entire codebase using a different framework.",
        "option_b": "Isolate the issue by identifying reproducible steps and logs.",
        "option_c": "Reboot the production server continuously.",
        "option_d": "Submit a help ticket to infrastructure consultants immediately.",
        "correct_option": "B"
    },
    {
        "category": "Problem Solving",
        "question_text": "What is the primary benefit of dividing a massive system block into smaller modules (decomposition)?",
        "option_a": "It increases the line count of files.",
        "option_b": "It simplifies understanding, debugging, testing, and team task allocation.",
        "option_c": "It eliminates the need for compilation testing.",
        "option_d": "It allows programs to run without data inputs.",
        "correct_option": "B"
    },
    {
        "category": "Problem Solving",
        "question_text": "What does a 'Root Cause Analysis' aim to achieve?",
        "option_a": "Find who made the coding mistake so they can be assigned other tasks.",
        "option_b": "Identify the underlying core issue that caused a failure, rather than just treating symptoms.",
        "option_c": "Erase error traces from database logs.",
        "option_d": "Upgrade all system frameworks to the latest beta versions.",
        "correct_option": "B"
    },
    # 14. Logical Reasoning
    {
        "category": "Logical Reasoning",
        "question_text": "Complete the series: 3, 5, 9, 17, 33, ...",
        "option_a": "45", "option_b": "55", "option_c": "65", "option_d": "75",
        "correct_option": "C" # n * 2 - 1 rule: 3*2-1=5, 5*2-1=9... 33*2-1=65
    },
    {
        "category": "Logical Reasoning",
        "question_text": "If all A are B, and some B are C, which of the following statements must be true?",
        "option_a": "All A are C.", "option_b": "Some A are C.", "option_c": "No A are C.", "option_d": "None of the above.",
        "correct_option": "D"
    },
    {
        "category": "Logical Reasoning",
        "question_text": "Look at this sequence: U32, V29, W26, X23, ... What should be next?",
        "option_a": "Y20", "option_b": "Z19", "option_c": "Y17", "option_d": "Z20",
        "correct_option": "A"
    },
    # 15. Communication
    {
        "category": "Communication",
        "question_text": "When presenting technical project updates to non-technical stakeholders, what is the best approach?",
        "option_a": "Use detailed code snippets and server terminal prints.",
        "option_b": "Focus on business value, key milestones, and high-level architecture diagrams.",
        "option_c": "Use complex terminology to show technical mastery.",
        "option_d": "Avoid details and simply assure them everything is fine.",
        "correct_option": "B"
    },
    {
        "category": "Communication",
        "question_text": "What does 'Active Listening' involve?",
        "option_a": "Preparing your response while the other person is still speaking.",
        "option_b": "Paying complete attention, summarizing points, and clarifying to ensure mutual understanding.",
        "option_c": "Nodding continuously without actually focusing on verbal details.",
        "option_d": "Recording the conversation to listen to later while working on other tasks.",
        "correct_option": "B"
    },
    # 16. Leadership
    {
        "category": "Leadership",
        "question_text": "Which leadership style focuses on encouraging team members to participate in decision-making processes?",
        "option_a": "Autocratic Leadership", "option_b": "Democratic / Participative Leadership", "option_c": "Laissez-Faire Leadership", "option_d": "Transactional Leadership",
        "correct_option": "B"
    },
    {
        "category": "Leadership",
        "question_text": "How should a team leader handle a situation where a project milestone is missed due to a developer's error?",
        "option_a": "Blame the developer publicly to enforce accountability.",
        "option_b": "Take responsibility, analyze what failed with the team, and create a recovery roadmap.",
        "option_c": "Extend the deadline silently without informing stakeholders.",
        "option_d": "Assign the developer's work to someone else immediately without discussion.",
        "correct_option": "B"
    },
    # 17. Teamwork
    {
        "category": "Teamwork",
        "question_text": "If two team members disagree on a design implementation pattern, how should it be resolved?",
        "option_a": "Let them debate endlessly until one yields.",
        "option_b": "Facilitate a structured discussion comparing pros, cons, and project requirements to decide objectively.",
        "option_c": "Make a decision based on who has been at the company longer.",
        "option_d": "Discard the feature entirely to avoid internal arguments.",
        "correct_option": "B"
    },
    {
        "category": "Teamwork",
        "question_text": "What is the primary indicator of a high-performing collaborative team?",
        "option_a": "Individual members working strictly in isolation.",
        "option_b": "Open communication, mutual trust, aligned goals, and shared responsibility.",
        "option_c": "Zero disagreements or discussions during planning phases.",
        "option_d": "Strict hierarchies where only leaders speak.",
        "correct_option": "B"
    },
    # 18. Business
    {
        "category": "Business",
        "question_text": "What does a SWOT analysis evaluate?",
        "option_a": "Sales, Wages, Overheads, Taxes",
        "option_b": "Strengths, Weaknesses, Opportunities, Threats",
        "option_c": "Systems, Workflows, Operations, Tech",
        "option_d": "Strategies, Wealth, Objectives, Timeline",
        "correct_option": "B"
    },
    {
        "category": "Business",
        "question_text": "What is ROI in business management?",
        "option_a": "Retention on Investment",
        "option_b": "Return on Investment",
        "option_c": "Revenue of Industry Operations",
        "option_d": "Risk assessment Index",
        "correct_option": "B"
    },
    # 19. Creativity
    {
        "category": "Creativity",
        "question_text": "What is 'Brainstorming' designed to accomplish in initial design phases?",
        "option_a": "Critically analyze and reject design ideas immediately.",
        "option_b": "Generate a large volume of creative ideas without early criticism or restrictions.",
        "option_c": "Finalize budget projections.",
        "option_d": "Formulate precise coding schemas.",
        "correct_option": "B"
    },
    {
        "category": "Creativity",
        "question_text": "Which methodology encourages rapid iteration, user interviews, and prototyping to find innovative solutions?",
        "option_a": "Waterfall development",
        "option_b": "Design Thinking",
        "option_c": "Linear programming",
        "option_d": "Structured parsing",
        "correct_option": "B"
    },
    # 20. Mathematics
    {
        "category": "Mathematics",
        "question_text": "What is the probability of flipping a fair coin twice and getting 'Heads' both times?",
        "option_a": "0.50", "option_b": "0.25", "option_c": "0.75", "option_d": "0.125",
        "correct_option": "B"
    },
    {
        "category": "Mathematics",
        "question_text": "If a matrix has dimensions 3x2, and another has dimensions 2x4, what are the dimensions of the multiplied product matrix?",
        "option_a": "2x2", "option_b": "3x4", "option_c": "2x3", "option_d": "They cannot be multiplied",
        "correct_option": "B"
    },
    {
        "category": "Mathematics",
        "question_text": "What is the derivative of f(x) = 3x^2 + 5x with respect to x?",
        "option_a": "3x + 5", "option_b": "6x + 5", "option_c": "6x^2 + 5", "option_d": "3x^2",
        "correct_option": "B"
    }
]

COURSES = [
    {"title": "Machine Learning by Andrew Ng", "provider": "Coursera", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "duration": "12 weeks", "rating": 4.9, "difficulty": "Medium", "career_name": "Machine Learning Engineer", "required_skills": "Python, Mathematics"},
    {"title": "Meta Frontend Developer Professional Certificate", "provider": "Coursera", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer", "duration": "16 weeks", "rating": 4.8, "difficulty": "Easy", "career_name": "Frontend Developer", "required_skills": "React, HTML, CSS"},
    {"title": "Spring Boot Microservices", "provider": "Udemy", "url": "https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/", "duration": "8 weeks", "rating": 4.7, "difficulty": "Hard", "career_name": "Java Developer", "required_skills": "Java, Spring Boot"},
    {"title": "AWS Solutions Architect Certification Prep", "provider": "Udemy", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "duration": "10 weeks", "rating": 4.8, "difficulty": "Medium", "career_name": "Cloud Engineer", "required_skills": "AWS, Networking"},
    {"title": "Python for Data Science and Machine Learning Boot Camp", "provider": "Udemy", "url": "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/", "duration": "8 weeks", "rating": 4.7, "difficulty": "Medium", "career_name": "Data Scientist", "required_skills": "Python, Pandas"},
    {"title": "Docker and Kubernetes: The Complete Guide", "provider": "Udemy", "url": "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/", "duration": "6 weeks", "rating": 4.8, "difficulty": "Medium", "career_name": "DevOps Engineer", "required_skills": "Docker, Kubernetes"},
    {"title": "Modern React with Redux", "provider": "Udemy", "url": "https://www.udemy.com/course/react-redux/", "duration": "10 weeks", "rating": 4.7, "difficulty": "Medium", "career_name": "Frontend Developer", "required_skills": "React, JavaScript"},
    {"title": "CS50: Introduction to Computer Science", "provider": "freeCodeCamp", "url": "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x", "duration": "12 weeks", "rating": 4.9, "difficulty": "Easy", "career_name": "Software Engineer", "required_skills": "C, Python, Algorithms"},
    {"title": "Embedded Systems Object-Oriented Programming", "provider": "YouTube", "url": "https://www.youtube.com/playlist?list=PLPW88IdZz1Ly41z_r4t5h5nrf1_1K19tK", "duration": "4 weeks", "rating": 4.6, "difficulty": "Hard", "career_name": "Embedded Engineer", "required_skills": "C/C++, Microcontrollers"},
    {"title": "CompTIA Security+ Full Certification Course", "provider": "freeCodeCamp", "url": "https://www.youtube.com/watch?v=9neITKvrgI4", "duration": "6 weeks", "rating": 4.8, "difficulty": "Medium", "career_name": "Cyber Security Analyst", "required_skills": "Networking, Cryptography"}
]

JOBS = [
    {"company": "Google", "role": "Associate AI Resident", "location": "Mountain View, CA", "salary": "$130,000 - $170,000", "required_skills": "Python, Machine Learning, TensorFlow", "apply_link": "https://careers.google.com", "career_name": "AI Engineer"},
    {"company": "Microsoft", "role": "Software Engineer II", "location": "Redmond, WA", "salary": "$120,000 - $160,000", "required_skills": "Java, Algorithms, Git", "apply_link": "https://careers.microsoft.com", "career_name": "Software Engineer"},
    {"company": "Netflix", "role": "Senior Python Backend Engineer", "location": "Los Gatos, CA", "salary": "$150,000 - $210,000", "required_skills": "Python, FastAPI, SQL, Docker", "apply_link": "https://jobs.netflix.com", "career_name": "Python Developer"},
    {"company": "Vercel", "role": "Frontend Architect", "location": "Remote, USA", "salary": "$140,000 - $180,000", "required_skills": "React, HTML, CSS, JavaScript", "apply_link": "https://vercel.com/careers", "career_name": "Frontend Developer"},
    {"company": "Amazon Web Services", "role": "Cloud Solutions Architect", "location": "Seattle, WA", "salary": "$135,000 - $175,000", "required_skills": "AWS, Docker, Kubernetes, Linux", "apply_link": "https://amazon.jobs", "career_name": "Cloud Engineer"},
    {"company": "Stripe", "role": "Full Stack Engineer - Billing Team", "location": "San Francisco, CA", "salary": "$140,000 - $190,000", "required_skills": "React, Node.js, Express, Docker", "apply_link": "https://stripe.com/jobs", "career_name": "Full Stack Developer"},
    {"company": "CrowdStrike", "role": "Associate Security Analyst", "location": "Austin, TX", "salary": "$95,000 - $130,000", "required_skills": "Networking, Wireshark, Linux", "apply_link": "https://crowdstrike.jobs", "career_name": "Cyber Security Analyst"},
    {"company": "Deloitte", "role": "Junior Business Analyst", "location": "New York, NY", "salary": "$80,000 - $110,000", "required_skills": "SQL, Excel, Agile", "apply_link": "https://deloitte.com/careers", "career_name": "Business Analyst"},
    {"company": "Tesla", "role": "Embedded Firmware Developer", "location": "Palo Alto, CA", "salary": "$110,000 - $155,000", "required_skills": "C/C++, Embedded C, Microcontrollers", "apply_link": "https://tesla.com/careers", "career_name": "Embedded Engineer"},
    {"company": "GE Digital", "role": "Industrial IoT Solution Developer", "location": "Chicago, IL", "salary": "$105,000 - $145,000", "required_skills": "MQTT, Python, Embedded Systems", "apply_link": "https://ge.com/careers", "career_name": "IoT Engineer"}
]
def seed_db():
    db = SessionLocal()
    try:
        # 0. Seed Default User
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("Seeding default user account...")
            from app.auth import get_password_hash
            hashed_pw = get_password_hash("pooma2006")
            user = models.User(
                email="duraisanthosh833@gmail.com",
                hashed_password=hashed_pw,
                is_admin=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Initialize profile
            profile = models.Profile(
                user_id=user.id,
                full_name="Durai Santhosh",
                phone="1234567890",
                age=20,
                gender="Male",
                college="Engineering College",
                department="Computer Science",
                qualification="Bachelor of Engineering",
                cgpa=8.5,
                current_skills="Python, SQL, HTML, CSS",
                interests="AI development, Cloud architecture",
                strengths="Problem-solving, communication",
                weaknesses="Perfectionism",
                preferred_career="AI Engineer",
                preferred_location="Remote",
                profile_photo_url=""
            )
            db.add(profile)
            db.commit()
            print("Default user seeded.")
        else:
            print(f"Users table already has {user_count} entries. Skipping seeding default user.")

        # 1. Seed Questions
        questions_count = db.query(models.Question).count()
        if questions_count == 0:
            print("Seeding 50 multiple-choice assessment questions...")
            for q_data in QUESTIONS:
                q = models.Question(
                    category=q_data["category"],
                    question_text=q_data["question_text"],
                    option_a=q_data["option_a"],
                    option_b=q_data["option_b"],
                    option_c=q_data["option_c"],
                    option_d=q_data["option_d"],
                    correct_option=q_data["correct_option"]
                )
                db.add(q)
            db.commit()
            print("Seeding questions finished.")
        else:
            print(f"Questions table already has {questions_count} entries. Skipping seeding questions.")

        # 2. Seed Courses
        courses_count = db.query(models.Course).count()
        if courses_count == 0:
            print("Seeding recommended courses database...")
            for c_data in COURSES:
                c = models.Course(
                    title=c_data["title"],
                    provider=c_data["provider"],
                    url=c_data["url"],
                    duration=c_data["duration"],
                    rating=c_data["rating"],
                    difficulty=c_data["difficulty"],
                    career_name=c_data["career_name"],
                    required_skills=c_data["required_skills"]
                )
                db.add(c)
            db.commit()
            print("Seeding courses finished.")
        else:
            print(f"Courses table already has {courses_count} entries. Skipping seeding courses.")

        # 3. Seed Jobs
        jobs_count = db.query(models.Job).count()
        if jobs_count == 0:
            print("Seeding recommended jobs database...")
            for j_data in JOBS:
                j = models.Job(
                    company=j_data["company"],
                    role=j_data["role"],
                    location=j_data["location"],
                    salary=j_data["salary"],
                    required_skills=j_data["required_skills"],
                    apply_link=j_data["apply_link"],
                    career_name=j_data["career_name"]
                )
                db.add(j)
            db.commit()
            print("Seeding jobs finished.")
        else:
            print(f"Jobs table already has {jobs_count} entries. Skipping seeding jobs.")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
