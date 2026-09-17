import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export default function FinalCTA() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Ready to tailor your resume?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#69665F]">Start with the resume you already have and the role you actually want.</p>
        <Button as="link" to="/tailor-resume" variant="accent" className="mt-7">
          Start tailoring <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}