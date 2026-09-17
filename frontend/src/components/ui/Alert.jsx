import { AlertCircle } from "lucide-react";

export default function Alert({ children }) {
  return (
    <div role="alert" className="flex items-start gap-3 border border-[#E2CFC7] bg-[#F8EEEA] px-4 py-3 text-sm text-[#743E32]">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}