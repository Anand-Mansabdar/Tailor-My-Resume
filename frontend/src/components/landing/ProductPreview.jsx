import { FileText, BriefcaseBusiness, ArrowRight } from "lucide-react";

export default function ProductPreview() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="border border-line bg-[#F9F8F4] shadow-soft">
          <div className="flex h-11 items-center gap-2 border-b border-line px-4">
            <span className="h-2 w-2 rounded-full bg-[#B8B5AD]" />
            <span className="h-2 w-2 rounded-full bg-[#B8B5AD]" />
            <span className="h-2 w-2 rounded-full bg-[#B8B5AD]" />
            <span className="ml-3 text-[11px] font-medium text-[#85827A]">AI Resume Tailor / workspace</span>
          </div>
          <div className="grid md:grid-cols-2">
            <PreviewPanel icon={FileText} title="Resume">
              <div className="space-y-3">
                <div className="h-2 w-2/5 bg-[#D8D6CF]" />
                <div className="h-2 w-4/5 bg-[#E2E0D9]" />
                <div className="h-2 w-3/5 bg-[#E2E0D9]" />
                <div className="pt-3 text-[10px] uppercase tracking-wider text-[#8A877F]">Experience</div>
                <div className="h-2 w-full bg-[#E2E0D9]" />
                <div className="h-2 w-11/12 bg-[#E2E0D9]" />
                <div className="h-2 w-3/4 bg-[#E2E0D9]" />
              </div>
            </PreviewPanel>
            <PreviewPanel icon={BriefcaseBusiness} title="Job Description" right>
              <div className="space-y-3">
                <div className="h-2 w-3/5 bg-[#D8D6CF]" />
                <div className="h-2 w-full bg-[#E2E0D9]" />
                <div className="h-2 w-5/6 bg-[#E2E0D9]" />
                <div className="h-2 w-4/5 bg-[#E2E0D9]" />
                <div className="pt-3 text-[10px] uppercase tracking-wider text-[#8A877F]">Requirements</div>
                <div className="h-2 w-4/5 bg-[#E2E0D9]" />
                <div className="h-2 w-2/3 bg-[#E2E0D9]" />
              </div>
            </PreviewPanel>
          </div>
          <div className="flex items-center justify-center border-t border-line px-5 py-5">
            <span className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-xs font-semibold text-paper">
              Tailor Resume <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewPanel({ icon: Icon, title, children, right }) {
  return (
    <div className={`${right ? "md:border-l" : ""} border-line p-6 sm:p-8`}>
      <div className="mb-7 flex items-center gap-2">
        <Icon size={16} />
        <span className="text-xs font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}