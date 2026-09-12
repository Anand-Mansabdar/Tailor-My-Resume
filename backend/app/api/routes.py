from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.services.document_parser import extract_text_from_file
from app.services.resume_tailor import ResumeTailor
from app.services.latex_generator import generate_latex

router = APIRouter()

@router.get("/health")
async def health_check():
  return {
    "status": "ok",
    "message": "AI Resume Tailor backend is running",
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
  job_description: str = Form(...),
  resume_text: str | None = Form(default=None),
  resume_file: UploadFile | None = File(default=None)
):
  """
    Extract the resume and use LangChain + Groq to tailor it
    against the supplied job description.
  """
  
  if not job_description.strip():
    raise HTTPException(
      status_code=400,
      detail="Job description cannot be empty.",
    )
  
  if not resume_text and not resume_file:
    raise HTTPException(
      status_code=400,
      detail="Provide either resume text or a resume file."
    )
  
  # ---------------------------------------
  # Extract resume
  # ---------------------------------------
    
  if resume_text and resume_text.strip():
    extracted_resume = resume_text.strip()
    
  else:
    try:
      file_bytes = await resume_file.read()
      
      if not file_bytes:
        raise HTTPException(
          status_code=400,
          detail="Uploaded resume file is empty."
        )
      
      extracted_resume = extract_text_from_file(
        resume_file.filename or "",
        file_bytes,
      )
    except HTTPException:
      raise
    
    except ValueError as exc:
      raise HTTPException(
        status_code=400,
        detail=str(exc)
      ) from exc
    
    except Exception as exc:
      raise HTTPException(
        status_code=400,
        detail="Failed to extract resume text."
      ) from exc
    
  # -----------------------------------------
  # Call LLM
  # -----------------------------------------
  try:
    tailor = ResumeTailor()
    
    tailored_resume = await tailor.tailor_resume(
      resume_text=extracted_resume,
      job_description=job_description.strip()
    )
    
  except ValueError as exc:
    raise HTTPException(
      status_code=500,
      detail=str(exc),
    ) from exc
  
  except Exception as exc:
    raise HTTPException(
      status_code=500,
      detail=f"Resume tailoring failed: {str(exc)}"
    ) from exc
    
  try:
    latex_code= generate_latex(tailored_resume)
    
  except Exception as exc:
    raise HTTPException(
      status_code=500,
      detail=f"Latex code generation failed: {str(exc)}"
    ) from exc
  
  return {
    "success": True,
    "resume": tailored_resume.model_dump(),
    "latex": latex_code
  }