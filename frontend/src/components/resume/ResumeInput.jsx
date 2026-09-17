import { useState } from "react";
import { FileText, ClipboardPaste } from "lucide-react";
import FileUpload from "./FileUpload";
import { LIMITS, validateResumeText } from "../../utils/validation";
import Alert from "../ui/Alert";

export default function ResumeInput({ file, setFile, resumeText, setResumeText, mode, setMode }) {
  const [error, setError] = useState("");

  const changeText = (value) => {
    setResumeText(value);
    setError(value.length > LIMITS.resumeText ? "Your resume exceeds the 30,000 character limit." : "");
  };

  return (
    <section aria-labelledby="resume-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 id="resume-heading" className="text-base font-semibold">Your resume</h2>
          <p className="mt-1 text-xs text-[#77746D]">Use your existing resume as the source of truth.</p>
        </div>
      </div>

      <div className="mb-5 inline-flex border border-line bg-[#EFEEE8] p-1">
        <button type="button" className={`focus-ring inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${mode === "upload" ? "bg-paper shadow-sm" : "text-[#6F6C65]"}`} onClick={() => setMode("upload")}>
          <FileText size={14} /> Upload
        </button>
        <button type="button" className={`focus-ring inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${mode === "paste" ? "bg-paper shadow-sm" : "text-[#6F6C65]"}`} onClick={() => setMode("paste")}>
          <ClipboardPaste size={14} /> Paste text
        </button>
      </div>

      {mode === "upload" ? (
        <FileUpload file={file} onChange={setFile} />
      ) : (
        <div>
          <label htmlFor="resume-text" className="sr-only">Resume text</label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(e) => changeText(e.target.value)}
            onBlur={() => setError(validateResumeText(resumeText) || "")}
            maxLength={LIMITS.resumeText}
            rows={14}
            placeholder="Paste your resume text here..."
            className="focus-ring w-full resize-y border border-line bg-[#FAF9F5] p-4 text-sm leading-6 outline-none transition-colors placeholder:text-[#99968D] focus:border-accent"
          />
          <div className="mt-2 flex justify-between text-[11px] text-[#817E76]">
            <span>{error || "30,000 character maximum"}</span>
            <span>{resumeText.length.toLocaleString()} / {LIMITS.resumeText.toLocaleString()}</span>
          </div>
          {error && <div className="mt-3"><Alert>{error}</Alert></div>}
        </div>
      )}
    </section>
  );
}