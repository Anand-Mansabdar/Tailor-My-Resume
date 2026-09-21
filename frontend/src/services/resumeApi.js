const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

export async function tailorResume({
  resumeFile,
  resumeText,
  jobDescription,
  signal,
}) {
  const formData = new FormData();
  formData.append("job_description", jobDescription);

  if (resumeFile) {
    formData.append("resume_file", resumeFile);
  } else {
    formData.append("resume_text", resumeText);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/tailor-resume`, {
      method: "POST",
      body: formData,
      credentials: "include", // Important: Include cookies for authentication
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("NETWORK_ERROR");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(
      payload?.detail || payload?.message || "REQUEST_FAILED",
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}
