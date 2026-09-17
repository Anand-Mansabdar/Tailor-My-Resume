import SectionLabel from "../ui/SectionLabel";

export default function TrustSection() {
  return (
    <section className="border-y border-line bg-[#EEEDE7]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionLabel rotate>Built for truthful tailoring</SectionLabel>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_.85fr]">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
            Tailoring should improve relevance — not rewrite your history.
          </h2>
          <div>
            <p className="text-sm leading-7 text-[#64625C]">
              Your resume remains the source of truth. Unsupported details should stay unsupported rather than being invented for a job description.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#4F4D48]">
              {["Companies", "Roles", "Skills", "Achievements", "Metrics", "Dates", "Certifications"].map(x => <span key={x}>• {x}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}