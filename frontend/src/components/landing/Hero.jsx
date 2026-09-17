import { ArrowRight, FileText, BriefcaseBusiness, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Resume tailoring, without rewriting your history.</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-6xl">
            Tailor your resume to the job you're applying for.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#62605B] sm:text-lg">
            Match your existing experience to a specific job description, surface relevant keywords, and generate an ATS-friendly LaTeX resume without inventing experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as="link" to="/tailor-resume" variant="accent">
              Tailor my resume <ArrowRight size={17} />
            </Button>
            <Button as="link" to="/#how-it-works" variant="secondary">
              How it works
            </Button>
          </div>
        </div>

        <div className="mt-16 grid border-y border-line sm:grid-cols-3">
          <FlowItem icon={FileText} label="INPUT" title="Resume + Job Description" />
          <FlowItem icon={WandSparkles} label="PROCESS" title="Analyze + Tailor" middle />
          <FlowItem icon={BriefcaseBusiness} label="OUTPUT" title="Resume + LaTeX" />
        </div>
      </div>
    </section>
  );
}

function FlowItem({ icon: Icon, label, title, middle }) {
  return (
    <div className={`relative flex items-start gap-4 py-6 sm:py-7 ${middle ? "sm:border-x sm:border-line sm:px-7" : "sm:px-5"}`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center border border-line bg-[#EFEEE8]">
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.16em] text-[#77746D]">{label}</p>
        <p className="mt-1 text-sm font-semibold">{title}</p>
      </div>
    </div>
  );
}