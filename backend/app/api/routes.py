import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.services.document_parser import extract_text_from_file
from app.services.resume_tailor import ResumeTailor
from app.services.latex_generator import generate_latex
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
async def health_check():
  return {
    "status": "ok",
    "message": "AI Resume Tailor backend is running",
    "app": settings.app_name,
    "version": settings.app_version
  }
  

@router.post("/parse-resume")
async def parse_resume(
  resume_text: str | None = Form(default=None),
  resume_file: UploadFile | None = File(default=None), 
):
  """
    Accept either pasted resume text or a resume file.

    Supported files:
    - PDF
    - DOCX
    - TXT
  """
  if not resume_text and not resume_file:
    raise HTTPException(
      status_code=400,
      detail="Provide either resume text or a resume file."
    )
  
  if resume_text and resume_text.strip():
    extracted_text = resume_text.strip()
    source = "text"
  else:
    if not resume_file:
      raise HTTPException(
        status_code=400,
        detail="Resume input is empty."
      )
    
    try:
      file_bytes = await resume_file.read()
      if not file_bytes:
        raise HTTPException(
          status_code=400,
          detail="Uploaded resume file is empty.",
        )
      
      extracted_text = extract_text_from_file(
        resume_file.filename or "",
        file_bytes=file_bytes,
      )
      
      source = "file"
    except HTTPException:
      raise
    
    except ValueError as exc:
      raise HTTPException(
        status_code=400,
        detail=str(exc),
      ) from exc
    
    except Exception as exc:
      raise HTTPException(
        status_code=400,
        detail="Failed to extract text from the resume file."
      ) from exc
  
  return {
    "success": True,
    "source": source,
    "filename": resume_file.filename if resume_file else None,
    "text": extracted_text,
    "character_count": len(extracted_text),
  }
  

@router.post("/parse-input")
async def parse_input(
  job_description: str = Form(...),
  resume_text: str | None = Form(default=None),
  resume_file: UploadFile | None = File(default=None),
):
  """
    Accept the complete resume + job description input.
    This endpoint does NOT call the LLM yet.
  """
  if not job_description.strip():
    raise HTTPException(
      status_code=400,
      detail="Job description cannotbe empty."
    )
    
  if not resume_text and not resume_file:
    raise HTTPException(
      status_code=400,
      detail="Provide either resume text or a resume file."
    )
  
  if resume_text and resume_text.strip():
    extracted_resume = resume_text.strip()
    resume_source = "text"
  else:
    try:
      file_bytes = await resume_file.read()
      
      if not file_bytes:
        raise HTTPException(
          status_code=400,
          detail="Upload resume file is empty."
        )
      
      extracted_resume = extract_text_from_file(
        resume_file.filename or "",
        file_bytes=file_bytes
      )
      
      resume_source = "file"
    except HTTPException:
      raise
    except ValueError as exc:
      raise HTTPException(
        status_code=400,
        detail=str(exc),
      ) from exc
    
    except Exception as exc:
      raise HTTPException(
        status_code=400,
        detail="Failed to extract text from the resume file."
      ) from exc
  
  return {
    "success": True,
    "resume": {
      "source": resume_source,
      "file_name": (
        resume_file.filename
        if resume_file
        else None
      ),
      "text": extracted_resume,
      "character_count": len(extracted_resume),
    },
    "job_description": {
      "text": job_description.strip(),
      "character_count": len(job_description.strip()),
    }
  }
  

@router.post("/tailor-resume")
async def tailor_resume(
  job_description: str | None = Form(...),
  resume_text: str | None = Form(default=None),
  resume_file: UploadFile | None = File(default=None)
):
  """
    Extract the resume and use LangChain + Groq to tailor it
    against the supplied job description.
  """
  try:
    if not job_description.strip():
      raise HTTPException(
        status_code=400,
        detail="Job description cannot be empty.",
      )
      
    if len(job_description) > settings.max_job_description_characters:
      raise HTTPException(
        status_code=400,
        detail=(f"Job desciption is too large.\nMaximum allowed length is {settings.max_job_description_characters}")
      )
      
    if not resume_file and not resume_text:
      raise HTTPException(
        status_code=400,
        detail="Resume file or text cannot be empty."
      )
      
      
    # ---------------------------------------
    # Extract resume
    # ---------------------------------------
    
    if resume_file:
      file_bytes = await resume_file.read()
      
      max_file_size = settings.max_mb_file_limit*1024*1024
      
      if len(file_bytes) > max_file_size:
        raise HTTPException(
          status_code=400,
          detail=f"File is too large.\nMaximum allowed file size is {settings.max_mb_file_limit}"
        )
        
      resume_content = extract_text_from_file(
        filename=resume_file.filename or "",
        file_bytes=file_bytes
      )
    elif resume_text:
      resume_content = resume_text
    else:
      raise HTTPException(
        status_code=400,
        detail="Provide either resume_text or resume_file."
      )
    
    resume_content = resume_content.strip()
    
    if not resume_content:
      raise HTTPException(
        status_code=400,
        detail="Resume content is required."
      )
    
    if len(resume_content) > settings.max_resume_characters:
      raise HTTPException(
        status_code=400,
        detail=f"Resume is too large. Maximum allowed length is {settings.max_resume_characters}"
      )
    
    tailor_service = ResumeTailor()
    
    tailored_resume = await tailor_service.tailor_resume(
      resume_text=resume_content,
      job_description=job_description,
    )
    
    latex = generate_latex(tailored_resume)
    
    return {
      "success": True,
      "resume": tailored_resume.model_dump(),
      "latex": latex,
      "overleaf": {
        "action": "https://www.overleaf.com/docs",
        "method": "POST",
        "field": "encoded_snip",
      },
    }
  except HTTPException:
    raise
  except ValueError as exc:
    raise HTTPException(
      status_code=400,
      detail=str(exc)
    )
  except Exception:
    raise HTTPException(
      status_code=500,
      detail="Resume tailoring failed. Please try again."
    )
  