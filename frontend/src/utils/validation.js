export const LIMITS = {
  resumeText: 30000,
  jobDescription: 15000,
  fileSize: 5 * 1024 * 1024,
};

export const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export function validateFile(file) {
  if (!file) return null;
  const validExt = /\.(pdf|docx|txt)$/i.test(file.name);
  if (!validExt) return "Please upload a PDF, DOCX, or TXT file.";
  if (file.size > LIMITS.fileSize) return "Your file exceeds the 5 MB limit.";
  return null;
}

export function validateResumeText(text) {
  if (!text.trim()) return "Please upload your resume or paste your resume text.";
  if (text.length > LIMITS.resumeText) return "Your resume exceeds the 30,000 character limit.";
  return null;
}

export function validateJobDescription(text) {
  if (!text.trim()) return "Please add the job description.";
  if (text.length > LIMITS.jobDescription) return "Your job description exceeds the 15,000 character limit.";
  return null;
}