import { Check } from "lucide-react";
import { STAGES } from "../../hooks/useResumeTailor";
import SectionLabel from "../ui/SectionLabel";

export default function ProcessingState({ stage }) {
  return (
    <section className="border border-line bg-[#F9F8F4] p-6 sm:p-8" aria-live="polite" aria-label="Resume processing">
      <SectionLabel>Working through your resume</SectionLabel>
      <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Tailoring your application materials.</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#6D6A63]">The steps below reflect the workflow. They are not percentage estimates.</p>

      <div className="mt-8 border-t border-line">
        {STAGES.map((item, index) => {
          const done = index < stage;
          const current = index === stage;
          return (
            <div key={item} className="flex items-center gap-4 border-b border-line py-4">
              <span className={`grid h-7 w-7 shrink-0 place-items-center border text-[11px] font-semibold ${done ? "border-accent bg-accent text-paper" : current ? "border-ink bg-ink text-paper" : "border-line text-[#8A877F]"}`}>
                {done ? <Check size={14} /> : String(index + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm ${current ? "font-semibold" : done ? "text-[#56534D]" : "text-[#8B887F]"}`}>{item}</span>
              {current && <span className="ml-auto h-1.5 w-16 overflow-hidden bg-[#DFDDD5]"><span className="block h-full w-1/2 animate-pulse bg-accent" /></span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}