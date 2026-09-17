import { useRef, useState } from "react";
import { FileUp, FileText, X } from "lucide-react";
import { validateFile } from "../../utils/validation";
import Alert from "../ui/Alert";

export default function FileUpload({ file, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const choose = (candidate) => {
    const validation = validateFile(candidate);
    setError(validation || "");
    if (!validation) onChange(candidate);
  };

  return (
    <div>
      <div
        className={`relative border border-dashed p-7 transition-colors ${dragging ? "border-accent bg-accent-soft" : "border-[#C9C6BD] bg-[#FAF9F5]"} ${file ? "border-solid border-[#A9BEB3]" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="sr-only"
          onChange={(e) => choose(e.target.files?.[0])}
          aria-label="Upload resume file"
        />
        {!file ? (
          <button type="button" className="focus-ring w-full text-left" onClick={() => inputRef.current?.click()}>
            <span className="grid h-10 w-10 place-items-center border border-line bg-paper"><FileUp size={18} /></span>
            <span className="mt-5 block text-sm font-semibold">Upload your resume</span>
            <span className="mt-1 block text-xs leading-5 text-[#77746D]">PDF, DOCX or TXT · max 5 MB</span>
            <span className="mt-5 inline-flex border border-line px-3 py-2 text-xs font-semibold hover:bg-[#EEECE5]">Choose file</span>
          </button>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-line bg-paper"><FileText size={18} /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="mt-1 text-xs text-[#77746D]">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button type="button" className="focus-ring grid h-9 w-9 shrink-0 place-items-center hover:bg-[#ECEAE3]" onClick={() => { onChange(null); setError(""); }} aria-label="Remove uploaded resume">
              <X size={17} />
            </button>
          </div>
        )}
      </div>
      {error && <div className="mt-3"><Alert>{error}</Alert></div>}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}