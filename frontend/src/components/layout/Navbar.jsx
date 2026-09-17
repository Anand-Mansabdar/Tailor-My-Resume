import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Scissors } from "lucide-react";

export default function Navbar({ compact = false }) {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `focus-ring text-sm transition-colors ${isActive ? "font-semibold text-ink" : "text-[#64625D] hover:text-ink"}`;

  return (
    <header className="border-b border-line bg-paper">
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-5 ${compact ? "h-16" : "h-[72px]"} sm:px-8`}>
        <Link to="/" className="focus-ring flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center border border-ink bg-ink text-paper">
            <Scissors size={16} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-[-0.02em]">AI Resume Tailor</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {!compact && <a className="focus-ring text-sm text-[#64625D] hover:text-ink" href="/#how-it-works">How it works</a>}
          <NavLink className={linkClass} to="/tailor-resume">Tailor Resume</NavLink>
        </nav>

        <button
          className="focus-ring grid h-10 w-10 place-items-center md:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-5 py-4 md:hidden" aria-label="Mobile navigation">
          {!compact && <a className="focus-ring block py-3 text-sm" href="/#how-it-works" onClick={() => setOpen(false)}>How it works</a>}
          <Link className="focus-ring block py-3 text-sm font-semibold" to="/tailor-resume" onClick={() => setOpen(false)}>Tailor Resume</Link>
        </nav>
      )}
    </header>
  );
}