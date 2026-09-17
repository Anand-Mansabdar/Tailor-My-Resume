export default function SectionLabel({ children, rotate = false }) {
  return (
    <span
      className={`inline-flex items-center border border-line bg-[#EFEEE8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink ${
        rotate ? "-rotate-2" : ""
      }`}
    >
      {children}
    </span>
  );
}