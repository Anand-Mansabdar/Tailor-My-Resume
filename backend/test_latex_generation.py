from app.models.resume import EducationItem, ExperienceItem, ProjectItem, ResumeHeader, TailoredResume

from app.services.latex_generator import generate_latex

resume = TailoredResume(
  header=ResumeHeader(
    name="Anand Mansabdar",
    email="anand@example.com",
    phone="+91 9876543210",
    location="Hyderabad, India",
    linkedin="https://linkedin.com/in/example",
    github="https://github.com/example",
  ),
  summary=(
    "Software Developer with experience in Python, "
    "FastAPI, React, REST APIs, SQL and Git."
  ),
  skills=[
    "Python",
    "FastAPI",
    "React",
    "SQL",
    "Git",
  ],
  experience=[
    ExperienceItem(
      company="Example Company",
        role="Software Developer",
        location="Hyderabad",
        start_date="Jan 2025",
        end_date="Present",
        bullets=[
          "Built REST APIs using FastAPI & Python.",
          "Worked with 100% automated testing.",
          "Improved API reliability by 20%.",
          "Worked with user_data and handled $500K worth of records."
        ],
      )
    ],
  projects=[
    ProjectItem(
      name="AI Resume Tailor",
      technologies=[
        "Python",
        "FastAPI",
        "React",
      ],
      bullets=[
        "Built a full-stack resume tailoring application.",
        "Integrated LangChain with a large language model.",
      ],
    )
  ],
  education=[
    EducationItem(
      institution="Example University",
      degree="Bachelor of Technology",
      location="India",
      start_date="2021",
      end_date="2025",
    )
  ],
  relevant_keywords=[
    "Python",
    "FastAPI",
    "React",
  ],
  omitted_keywords=[
    "AWS",
    "Docker",
  ],
)


latex = generate_latex(resume)

with open(
  "test_resume.tex",
  "w",
  encoding="utf-8",
) as file:
  file.write(latex)

print("LaTeX generated successfully.")
print("Output: test_resume.tex")