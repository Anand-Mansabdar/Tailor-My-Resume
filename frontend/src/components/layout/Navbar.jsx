import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Scissors, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar({ compact = false }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `focus-ring text-sm transition-colors ${isActive ? "font-semibold text-ink" : "text-[#64625D] hover:text-ink"}`;

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setOpen(false);
      navigate("/");
    }
  };

  return (
    <header className="border-b border-line bg-paper">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 ${compact ? "h-16" : "h-[72px]"} sm:px-8`}
      >
        <Link
          to="/"
          className="focus-ring flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-8 w-8 place-items-center border border-ink bg-ink text-paper">
            <Scissors size={16} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-[-0.02em]">
            AI Resume Tailor
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Primary navigation"
        >
          {!compact && (
            <a
              className="focus-ring text-sm text-[#64625D] hover:text-ink"
              href="/#how-it-works"
            >
              How it works
            </a>
          )}
          <NavLink className={linkClass} to="/tailor-resume">
            Tailor Resume
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#64625D]">
                <User size={16} />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="focus-ring flex items-center gap-2 text-sm text-[#64625D] transition-colors hover:text-ink"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink className={linkClass} to="/login">
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="focus-ring inline-flex h-9 items-center justify-center gap-2 border border-ink bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-[#303030]"
              >
                Register
              </NavLink>
            </div>
          )}
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
        <nav
          className="border-t border-line px-5 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {!compact && (
            <a
              className="focus-ring block py-3 text-sm"
              href="/#how-it-works"
              onClick={() => setOpen(false)}
            >
              How it works
            </a>
          )}
          <Link
            className="focus-ring block py-3 text-sm font-semibold"
            to="/tailor-resume"
            onClick={() => setOpen(false)}
          >
            Tailor Resume
          </Link>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 border-t border-line py-3 text-sm text-[#64625D]">
                <User size={16} />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="focus-ring flex w-full items-center gap-2 py-3 text-left text-sm text-[#64625D]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="focus-ring block py-3 text-sm"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="focus-ring block py-3 text-sm font-semibold"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
