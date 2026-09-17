import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import ResumeInput from "../components/resume/ResumeInput";
import JobDescriptionInput from "../components/resume/JobDescriptionInput";
import ProcessingState from "../components/resume/ProcessingState";
import ResumeResult from "../components/resume/ResumeResult";
import { useResumeTailor } from "../hooks/useResumeTailor";
import { LIMITS, validateJobDescription, validateResumeText, validateFile } from "../utils/validation";

export default function TailorResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [mode, setMode] = useState("upload");
  const { isSubmitting, processingStage, result, error, submit, reset } = useResumeTailor();

  const validation = useMemo(() => {
    const resumeError = mode === "upload" ? validateFile(resumeFile) : validateResumeText(resumeText);
    const jdError = validateJobDescription(jobDescription);
    return { resumeError, jdError };
  }, [mode, resumeFile, resumeText, jobDescription]);

  const canSubmit = !validation.resumeError && !validation.jdError && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await submit({
        resumeFile: mode === "upload" ? resumeFile : null,
        resumeText: mode === "paste" ? resumeText : "",
        jobDescription,
      });
    } catch {}
  };

  const startOver = () => {
    reset();
    setResumeFile(null);
    setResumeText("");
    setJobDescription("");
    setMode("upload");
  };

  return (
    <PageTransition>
      <Navbar compact />
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {!result && !isSubmitting && (
          <>
            <div className="max-w-3xl">
              <SectionLabel rotate>Resume tailoring</SectionLabel>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Tailor your resume to the role.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#68665F] sm:text-base">
                Add your resume and the job description. We'll restructure your existing experience around the requirements of the role.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12">
              <div className="grid gap-10 border-y border-line py-10 lg:grid-cols-2 lg:gap-0">
                <div className="lg:pr-10"><ResumeInput {...{file: resumeFile, setFile: setResumeFile, resumeText, setResumeText, mode, setMode}} /></div>
                <div className="border-line lg:border-l lg:pl-10"><JobDescriptionInput value={jobDescription} onChange={setJobDescription} /></div>
              </div>

              {(validation.resumeError || validation.jdError) && (
                <div className="mt-6 space-y-3">
                  {validation.resumeError && <Alert>{validation.resumeError}</Alert>}
                  {validation.jdError && <Alert>{validation.jdError}</Alert>}
                </div>
              )}

              <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-xs leading-5 text-[#77746D]">Your resume is used to tailor this request. No backend secrets are exposed in the browser.</p>
                <Button type="submit" variant="accent" disabled={!canSubmit} className="sm:min-w-40">Tailor Resume</Button>
              </div>
            </form>
          </>
        )}

        {isSubmitting && <ProcessingState stage={processingStage} />}

        {result && !isSubmitting && <ResumeResult result={result} onStartOver={startOver} />}

        {error && !isSubmitting && !result && (
          <div className="mt-8 max-w-2xl">
            <Alert>
              {error.status === 400
                ? "The request could not be processed. Please check your resume and job description."
                : error.status === 502 || error.status === 500
                ? "The AI service couldn't process your resume right now. Please try again."
                : error.message === "NETWORK_ERROR"
                ? "We couldn't connect to the server. Check your connection and try again."
                : error.message || "Something went wrong. Please try again."}
            </Alert>
            <button type="button" onClick={() => reset()} className="focus-ring mt-4 text-xs font-semibold underline underline-offset-4">Try again</button>
          </div>
        )}
      </main>
    </PageTransition>
  );
}