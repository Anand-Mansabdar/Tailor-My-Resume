import SectionLabel from "../ui/SectionLabel";

const steps = [
  ["01", "Add your resume", "Upload PDF, DOCX, TXT or paste your resume."],
  ["02", "Add the job description", "Paste the job description for the position you're targeting."],
  ["03", "Tailor and export", "Review the tailored result, inspect the generated LaTeX, and continue to Overleaf."],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionLabel rotate>How it works</SectionLabel>
        <div className="mt-8 grid md:grid-cols-3">
          {steps.map(([num, title, body], i) => (
            <article key={num} className={`py-7 md:pr-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0 md:pl-8" : ""}`}>
              <span className="font-mono text-xs text-accent">{num}</span>
              <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{title}</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#68665F]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}