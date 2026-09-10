from langchain_groq import ChatGroq
from config import settings

def main():
  if not settings.groq_api_key:
    raise ValueError("GROQ_API_KEY is missing from .env file.")
  
  llm = ChatGroq(
    api_key=settings.groq_api_key,
    model="openai/gpt-oss-120b",
    temperature=0
  )
  
  response = llm.invoke(
    "Reply with exactly: Groq Langchain connection successful."
  )
  
  print(response.content)


if __name__ == "__main__":
  main()