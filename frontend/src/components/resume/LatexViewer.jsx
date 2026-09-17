import { useState } from "react";
import { Check, Clipboard, Code2 } from "lucide-react";

export default function LatexViewer({ latex }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(latex || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="border-t border-line pt-10" aria-labelledby="latex-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <Code2 size={18} />
            <h2 id="latex-heading" className="text-xl font-semibold tracking-[-0.02em]">Generated LaTeX</h2>
          </div>
          <p className="mt-2 text-sm text-[#6D6A63]">Review or copy the generated LaTeX source.</p>
        </div>
        <button type="button" onClick={copy} className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 border border-line bg-paper px-4 text-xs font-semibold hover:bg-[#ECEAE3]">
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? "Copied" : "Copy LaTeX"}
        </button>
      </div>

      <div className="mt-6 overflow-hidden border border-[#2B2B2B] bg-[#202020]">
        <pre className="max-h-[460px] overflow-auto p-5 font-mono text-[11px] leading-5 text-[#E6E4DD] sm:text-xs">
          <code>{latex || "No LaTeX was returned."}</code>
        </pre>
      </div>
    </section>
  );
}