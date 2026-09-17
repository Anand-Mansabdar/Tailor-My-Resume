import { FileText, RotateCcw } from "lucide-react";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import KeywordAnalysis from "./KeywordAnalysis";
import LatexViewer from "./LatexViewer";
import OverleafButton from "./OverleafButton";

export default function ResumeResult({ result, onStartOver }) {
  const resume = result?.resume || {};
  const latex = result?.latex || "";
  const overleaf = result?.overleaf || {};

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div>
          <SectionLabel>Your result</SectionLabel>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em]">Your resume is ready.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68665F]">Review the tailored content below before continuing to Overleaf.</p>
        </div>
        <Button variant="secondary" onClick={onStartOver}><RotateCcw size={15} /> Start over</Button>
      </div>

      <ResumeDocument resume={resume} />
      <KeywordAnalysis resume={result} />
      <LatexViewer latex={latex} />
      <OverleafButton overleaf={overleaf} latex={latex} />
    </div>
  );
}

function ResumeDocument({ resume }) {
  const header = resume.header || resume.contact || {};
  const summary = resume.summary;
  const skills = resume.skills;
  const experience = resume.experience || resume.work_experience || [];
  const projects = resume.projects || [];
  const education = resume.education || [];

  return (
    <section className="border border-line bg-[#FBFAF7] shadow-soft" aria-labelledby="resume-result-heading">
      <div className="border-b border-line p-6 sm:p-9">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-line bg-paper"><FileText size={18} /></span>
          <div className="min-w-0">
            <h2 id="resume-result-heading" className="text-xl font-semibold">{header.name || resume.name || "Tailored Resume"}</h2>
            <p className="mt-1 text-xs text-[#74716A]">{joinHeader(header)}</p>
          </div>
        </div>
      </div>
      <div className="space-y-8 p-6 sm:p-9">
        <ResumeSection title="Summary">{renderText(summary)}</ResumeSection>
        <ResumeSection title="Skills">{renderSkills(skills)}</ResumeSection>
        <ResumeSection title="Experience">{renderEntries(experience)}</ResumeSection>
        <ResumeSection title="Projects">{renderEntries(projects)}</ResumeSection>
        <ResumeSection title="Education">{renderEntries(education)}</ResumeSection>
      </div>
    </section>
  );
}

function ResumeSection({ title, children }) {
  if (!children) return null;
  return <section><h3 className="border-b border-line pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#77746D]">{title}</h3><div className="pt-4 text-sm leading-6">{children}</div></section>;
}

function renderText(value) {
  if (!value) return null;
  if (typeof value === "string") return <p>{value}</p>;
  return <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(value, null, 2)}</pre>;
}

function renderSkills(value) {
  if (!value) return null;
  if (Array.isArray(value)) return <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">{value.map((x, i) => <span key={i}>{typeof x === "object" ? x.name ?? x.skill ?? JSON.stringify(x) : x}</span>)}</div>;
  if (typeof value === "object") return <div className="space-y-2">{Object.entries(value).map(([k,v]) => <p key={k}><strong className="font-semibold">{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}</p>)}</div>;
  return <p>{String(value)}</p>;
}

function renderEntries(value) {
  if (!Array.isArray(value)) return renderText(value);
  if (!value.length) return null;
  return <div className="space-y-6">{value.map((entry, i) => {
    if (typeof entry === "string") return <p key={i}>{entry}</p>;
    const title = entry.title || entry.role || entry.position || entry.degree || entry.name || "";
    const org = entry.company || entry.organization || entry.institution || "";
    const dates = entry.dates || entry.date || entry.duration || "";
    const bullets = entry.bullets || entry.responsibilities || entry.description;
    return (
      <article key={i}>
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <div><p className="font-semibold">{title}</p>{org && <p className="text-xs text-[#6D6A63]">{org}</p>}</div>
          {dates && <span className="text-xs text-[#7D7A72]">{String(dates)}</span>}
        </div>
        {Array.isArray(bullets) ? <ul className="mt-2 list-disc space-y-1 pl-5 text-[#4F4D48]">{bullets.map((b,j)=><li key={j}>{typeof b === "object" ? JSON.stringify(b) : b}</li>)}</ul> : bullets && <p className="mt-2 text-[#4F4D48]">{String(bullets)}</p>}
      </article>
    );
  })}</div>;
}

function joinHeader(header) {
  if (!header || typeof header !== "object") return "";
  return Object.entries(header).filter(([k,v]) => k !== "name" && v).map(([,v]) => String(v)).join(" · ");
}