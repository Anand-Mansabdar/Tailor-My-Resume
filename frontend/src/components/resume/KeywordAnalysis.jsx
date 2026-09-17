import { Tags } from "lucide-react";

function normalize(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

export default function KeywordAnalysis({ resume }) {
  const relevant = normalize(resume?.relevant_keywords ?? resume?.relevantKeywords);
  const omitted = normalize(resume?.omitted_keywords ?? resume?.omittedKeywords);

  return (
    <section className="border-t border-line pt-10" aria-labelledby="keyword-analysis">
      <div className="flex items-center gap-3">
        <Tags size={18} />
        <h2 id="keyword-analysis" className="text-xl font-semibold tracking-[-0.02em]">Keyword analysis</h2>
      </div>
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        <KeywordGroup title="Relevant keywords" items={relevant} />
        <KeywordGroup title="Omitted keywords" items={omitted} muted />
      </div>
      <p className="mt-6 text-xs leading-5 text-[#77746D]">
        Omitted keywords are shown because they were not supported by the provided resume. They are not presented as failures and are not added without evidence.
      </p>
    </section>
  );
}

function KeywordGroup({ title, items, muted }) {
  return (
    <div className="border border-line bg-[#FAF9F5] p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className={`border px-2.5 py-1.5 text-xs ${muted ? "border-line text-[#6D6A63]" : "border-[#B8C8C0] bg-[#EEF3F0] text-[#315746]"}`}>
              {typeof item === "object" ? item.keyword ?? item.name ?? JSON.stringify(item) : item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-[#85827A]">No keywords were returned.</p>
      )}
    </div>
  );
}