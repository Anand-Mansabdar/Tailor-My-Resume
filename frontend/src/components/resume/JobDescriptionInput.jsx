import { LIMITS, validateJobDescription } from "../../utils/validation";
import Alert from "../ui/Alert";

export default function JobDescriptionInput({ value, onChange }) {
  const error = value.length > LIMITS.jobDescription ? "Your job description exceeds the 15,000 character limit." : "";
  return (
    <section aria-labelledby="jd-heading">
      <div className="mb-4">
        <h2 id="jd-heading" className="text-base font-semibold">Job description</h2>
        <p className="mt-1 text-xs text-[#77746D]">Paste the role requirements you're targeting.</p>
      </div>
      <label htmlFor="job-description" className="sr-only">Job description</label>
      <textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={19}
        maxLength={LIMITS.jobDescription}
        placeholder="Paste the job description here..."
        className="focus-ring w-full resize-y border border-line bg-[#FAF9F5] p-4 text-sm leading-6 outline-none transition-colors placeholder:text-[#99968D] focus:border-accent"
      />
      <div className="mt-2 flex justify-between text-[11px] text-[#817E76]">
        <span>{error || "15,000 character maximum"}</span>
        <span>{value.length.toLocaleString()} / {LIMITS.jobDescription.toLocaleString()}</span>
      </div>
      {error && <div className="mt-3"><Alert>{error}</Alert></div>}
    </section>
  );
}