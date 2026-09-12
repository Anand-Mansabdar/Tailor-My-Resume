from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
  company: str = Field(
    description="Company or organization name exactly as supported by the original resume."
  )
  role: str = Field(
    description="Job title or role exactly as supported by the original resume."
  )
  location: str = Field(
    default="",
    description="Location if present in the original resume."
  )
  start_date: str = Field(
    default="",
    description="Start date if present in the original resume."
  )
  end_date: str = Field(
    default="",
    description="End date if present in the original resume."
  )
  bullets: list[str] = Field(
    description="Truthful, tailored achievement/responsibility bullets."
  )


class EducationItem(BaseModel):
  institution: str = Field(
    description="Educational institution name."
  )
  degree: str = Field(
    description="Degree, course, or qualification."
  )
  location: str = Field(
    default="",
    description="Location if present."
  )
  start_date: str = Field(
    default="",
    description="Start date if present."
  )
  end_date: str = Field(
    default="",
    description="End date if present."
  )
  details: list[str] = Field(
    default_factory=list,
    description="Relevant truthful education details."
  )


class ProjectItem(BaseModel):
  name: str = Field(
    description="Project name."
  )
  technologies: list[str] = Field(
    default_factory=list,
    description="Technologies explicitly supported by the original resume."
  )
  bullets: list[str] = Field(
    description="Truthful, tailored project bullets."
  )


class ResumeHeader(BaseModel):
  name: str
  email: str = ""
  phone: str = ""
  location: str = ""
  linkedin: str = ""
  github: str = ""
  portfolio: str = ""


class TailoredResume(BaseModel):
  header: ResumeHeader

  summary: str = Field(
    description="A concise professional summary tailored to the job description."
  )

  skills: list[str] = Field(
    description="Relevant skills supported by the original resume."
  )

  experience: list[ExperienceItem] = Field(
    default_factory=list
  )

  projects: list[ProjectItem] = Field(
    default_factory=list
  )

  education: list[EducationItem] = Field(
    default_factory=list
  )

  relevant_keywords: list[str] = Field(
    description="Important JD keywords that are genuinely supported by the resume."
  )

  omitted_keywords: list[str] = Field(
    description="Important JD keywords that are not supported by the original resume."
  )