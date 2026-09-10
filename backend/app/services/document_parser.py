# This handles .txt, .pdf, and .docx files.

import pdfplumber
from io import BytesIO
from docx import Document

ALLOWED_EXTENSIONS = {
  ".pdf", 
  ".txt", 
  ".docx"
}

def extract_text_from_txt(file_bytes: bytes) -> str:
  """
    Extract text from a plain text document.
  """
  return file_bytes.decode("utf-8", errors="replace")


def extract_text_from_pdf(file_bytes: bytes) -> str:
  """
    Extract text from a pdf file using pdfplumber.
  """
  text_parts = []
  
  with pdfplumber.open(BytesIO(file_bytes)) as pdf:
    for page in pdf.pages:
      page_text = page.extract_text()
      
      if page_text:
        text_parts.append(page_text)
  
  return "\n\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
  """
    Extracts text/paragraph from a docx file.
  """
  document = Document(BytesIO(file_bytes))
  
  text_parts = []
  
  for paragraph in document.paragraphs:
    text = paragraph.text.strip()
    
    if text:
      text_parts.append(text)
  
  for table in document.tables:
    for row in table.rows:
      row_text = [
        cell.text.strip()
        for cell in row.cells
        if cell.text.strip()
      ]
      
      if row_text:
        text_parts.append(" | ".join(row_text))
  
  return "\n".join(text_parts)


def extract_text_from_file(
  filename: str,
  file_bytes: bytes,
) -> str:
  """
    Determine the file type from its extension and extract text.
  """
  extension = "." + filename.lower().split(".")[-1]
  
  if extension not in ALLOWED_EXTENSIONS:
    raise ValueError(
      f"Unsupported file type: {extension}. "
      f"Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
    )
  
  if extension == ".txt":
    text = extract_text_from_file(file_bytes=file_bytes)
  
  elif extension == ".pdf":
    text = extract_text_from_pdf(file_bytes=file_bytes)
  
  elif extension == ".docx":
    text = extract_text_from_docx(file_bytes=file_bytes)
  
  else: 
    raise ValueError("Unsupported file type.")
  
  text = text.strip()
  
  if not text:
    raise ValueError("Could not extract any text from the uploaded file.")
  
  return text
