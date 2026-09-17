import { ExternalLink } from "lucide-react";
import Button from "../ui/Button";
import { submitToOverleaf } from "../../utils/overleaf";

export default function OverleafButton({ overleaf, latex }) {
  const available = Boolean(overleaf?.action && overleaf?.method && overleaf?.field && latex);
  return (
    <section className="border border-line bg-[#EEEDE7] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
      <div>
        <h2 className="text-base font-semibold">Continue in Overleaf</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#68665F]">Open the generated resume in Overleaf to edit and compile it.</p>
      </div>
      <Button
        variant="primary"
        className="mt-5 shrink-0 sm:mt-0"
        disabled={!available}
        onClick={() => available && submitToOverleaf(overleaf, latex)}
      >
        Continue to Overleaf <ExternalLink size={16} />
      </Button>
    </section>
  );
}