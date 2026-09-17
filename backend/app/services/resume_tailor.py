from langchain_groq import ChatGroq
from langchain_core.exceptions import OutputParserException

from app.config import settings
from app.models.resume import TailoredResume
from app.prompts.resume_prompt import SYSTEM_PROMPT

import logging

logger = logging.getLogger(__name__)


class ResumeTailor:
  def __init__(self):
    if not settings.groq_api_key:
      raise ValueError("GROQ_API_KEY is not configured")
    
    self.llm = ChatGroq(
      model="openai/gpt-oss-120b",
      api_key=settings.groq_api_key,
      temperature=0
    )
    
    self.sturctured_llm = self.llm.with_structured_output(
      TailoredResume
    )
    
  async def tailor_resume(
    self,
    resume_text: str,
    job_description: str,
  ) -> TailoredResume:
    user_prompt = f"""
      JOB DESCRIPTION: {job_description}
      
      ORIGINAL RESUME: {resume_text}
      
      TASK:

      Analyze the job description and tailor the original resume to the job.

      Extract the important JD keywords.

      Match the candidate's existing skills and experience to those keywords.

      Rewrite and reorder the resume where useful.

      Do NOT fabricate anything.

      Return the complete tailored resume using the required structured schema.
    """
    
    try:
      result = await self.sturctured_llm.ainvoke([
        ("system", SYSTEM_PROMPT),
        ("human", user_prompt)
      ])
      
      return result
    except OutputParserException as exc:
      raise RuntimeError("The AI returned an invalid resume structure.") from exc
    
    except Exception as exc:
      logger.exception("LLM resume tailoring failed: %s", exc)
      
      raise RuntimeError("The AI service could not process the resume.") from exc
    
    
    