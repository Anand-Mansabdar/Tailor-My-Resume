import { FileText, Tags, Code2, ExternalLink } from "lucide-react";
import SectionLabel from "../ui/SectionLabel";

const items = [
  [FileText, "Tailored Resume", "A structured resume adjusted to the target job."],
  [Tags, "Relevant Keywords", "Keywords supported by the candidate's existing experience."],
  [Tags, "Omitted Keywords", "Important job requirements that aren't supported by the resume."],
  [Code2, "LaTeX Output", "Editable LaTeX source for further customization."],
  [ExternalLink, "Overleaf Handoff", "Continue editing and compile the resume using Overleaf."],
];

export default function WhatYouGet() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionLabel>What you get</SectionLabel>
        <div className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([Icon, title, body]) => (
            <article key={title} className="border-b border-line py-7 sm:px-5 sm:first:pl-0">
              <Icon size={18} strokeWidth={1.8} />
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#6A6862]">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-[#77746D]">Unsupported keywords are not added just to improve a match. The product is designed for truthful tailoring.</p>
      </div>
    </section>
  );
}