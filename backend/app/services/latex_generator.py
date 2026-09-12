from pathlib import Path
from app.models.resume import (
    EducationItem,
    ExperienceItem,
    ProjectItem,
    TailoredResume,
)

TEMPLATE_PATH = (
    Path(__file__).resolve().parent.parent / "templates" / "resume.tex"
)


LATEX_SPECIAL_CHARS = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def escape_latex(text: str) -> str:
    """
    Escape characters that have special meaning in LaTeX.
    """
    if not text:
        return ""

    return "".join(
        LATEX_SPECIAL_CHARS.get(char, char) for char in text
    )


LATEX_URL_SPECIAL_CHARS = {
    "\\": r"\textbackslash{}",
    "%": r"\%",
    "#": r"\#",
    "{": r"\{",
    "}": r"\}",
    "_": r"\_",
    "~": r"\%7E",
}


def escape_latex_url(url: str) -> str:
    """
    Escape a URL for use inside \\href{}.
    """
    if not url:
        return ""

    return "".join(
        LATEX_URL_SPECIAL_CHARS.get(char, char) for char in url
    )


def build_contact_line(resume: TailoredResume) -> str:
    """
    Build the contact line from available information.
    """
    header = resume.header
    contact_items = []

    if header.email:
        email = escape_latex(header.email)
        email_url = escape_latex_url(header.email)

        contact_items.append(
            rf"\href{{mailto:{email_url}}}{{{email}}}"
        )

    if header.phone:
        contact_items.append(
            escape_latex(header.phone)
        )

    if header.location:
        contact_items.append(
            escape_latex(header.location)
        )

    if header.linkedin:
        url = escape_latex_url(header.linkedin)
        contact_items.append(rf"\href{{{url}}}{{LinkedIn}}")

    if header.github:
        github_url = escape_latex_url(header.github)
        contact_items.append(
            rf"\href{{{github_url}}}{{GitHub}}"
        )

    if header.portfolio:
        portfolio_url = escape_latex_url(header.portfolio)
        contact_items.append(
            rf"\href{{{portfolio_url}}}{{Portfolio}}"
        )

    return " $|$ ".join(contact_items)


def build_summary_section(summary: str) -> str:
    if not summary:
        return ""

    return (
        "\\section{Summary}\n"
        f"{escape_latex(summary)}\n"
    )


def build_skills_section(skills: list[str]) -> str:
    if not skills:
        return ""

    skills_text = ", ".join(
        escape_latex(skill) for skill in skills
    )

    return (
        "\\section{Technical Skills}\n"
        f"{skills_text}\n"
    )


def build_experience_item(item: ExperienceItem) -> str:
    """
    Generate one experience entry.
    """
    company = escape_latex(item.company)
    role = escape_latex(item.role)
    location = escape_latex(item.location)
    start_date = escape_latex(item.start_date)
    end_date = escape_latex(item.end_date)

    date_range = ""

    if start_date and end_date:
        date_range = f"{start_date} -- {end_date}"
    elif start_date:
        date_range = start_date
    elif end_date:
        date_range = end_date

    location_date_parts = []

    if location:
        location_date_parts.append(location)

    if date_range:
        location_date_parts.append(date_range)

    right_side = " $|$ ".join(location_date_parts)

    first_line = "\\textbf{" + company + "}"
    if right_side:
        first_line += " \\hfill " + right_side

    latex = [
        first_line + " \\\\",
        "\\textit{" + role + "}",
        "\\begin{itemize}"
    ]

    for bullet in item.bullets:
        latex.append(
            "\\item " + escape_latex(bullet)
        )

    latex.append("\\end{itemize}")

    return "\n".join(latex)


def build_experience_section(
    experience: list[ExperienceItem],
) -> str:
    if not experience:
        return ""

    entries = [
        build_experience_item(item) for item in experience
    ]

    return (
        "\\section{Experience}\n"
        + "\n\\vspace{3pt}\n".join(entries)
        + "\n"
    )


def build_project_item(item: ProjectItem) -> str:
    """
    Generate one project entry.
    """
    name = escape_latex(item.name)

    technologies = ""

    if item.technologies:
        technologies = (
            " \\textit{("
            + ", ".join(
                escape_latex(tech)
                for tech in item.technologies
            )
            + ")}"
        )

    latex = [
        "\\textbf{" + name + "}" + technologies,
        "\\begin{itemize}",
    ]

    for bullet in item.bullets:
        latex.append(
            "\\item " + escape_latex(bullet)
        )

    latex.append("\\end{itemize}")

    return "\n".join(latex)


def build_projects_section(
    projects: list[ProjectItem],
) -> str:
    if not projects:
        return ""

    entries = [
        build_project_item(project)
        for project in projects
    ]

    return (
        "\\section{Projects}\n"
        + "\n\\vspace{3pt}\n".join(entries)
        + "\n"
    )


def build_education_item(item: EducationItem) -> str:
    institution = escape_latex(item.institution)
    degree = escape_latex(item.degree)
    location = escape_latex(item.location)
    start_date = escape_latex(item.start_date)
    end_date = escape_latex(item.end_date)

    date_range = ""

    if start_date and end_date:
        date_range = f"{start_date} -- {end_date}"
    elif start_date:
        date_range = start_date
    elif end_date:
        date_range = end_date

    right_side_parts = []

    if location:
        right_side_parts.append(location)

    if date_range:
        right_side_parts.append(date_range)

    right_side = " $|$ ".join(right_side_parts)

    first_line = "\\textbf{" + institution + "}"
    if right_side:
        first_line += " \\hfill " + right_side

    latex = [
        first_line + " \\\\",
        "\\textit{" + degree + "}"
    ]

    if item.details:
        latex.append("\\begin{itemize}")
        for detail in item.details:
            latex.append("\\item " + escape_latex(detail))
        latex.append("\\end{itemize}")

    return "\n".join(latex)

def build_education_section(education: list[EducationItem]) -> str:
    if not education:
        return ""

    entries = [
        build_education_item(item)
        for item in education
    ]

    return (
        "\\section{Education}\n"
        + "\n\\vspace{3pt}\n".join(entries)
        + "\n"
    )


def generate_latex(resume: TailoredResume) -> str:
    """
    Convert validated TailoredResume data into a complete .tex document.
    """

    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(
            f"Latex template path not found: {TEMPLATE_PATH}"
        )

    template = TEMPLATE_PATH.read_text(
        encoding="utf-8"
    )

    replacements = {
        "{{NAME}}": escape_latex(resume.header.name),
        "{{CONTACT_LINE}}": build_contact_line(resume),
        "{{SUMMARY_SECTION}}": build_summary_section(resume.summary),
        "{{SKILLS_SECTION}}": build_skills_section(resume.skills),
        "{{EXPERIENCE_SECTION}}": build_experience_section(resume.experience),
        "{{PROJECTS_SECTION}}": build_projects_section(resume.projects),
        "{{EDUCATION_SECTION}}": build_education_section(resume.education),
    }

    latex = template

    for placeholder, value in replacements.items():
        latex = latex.replace(
            placeholder, value
        )

    return latex