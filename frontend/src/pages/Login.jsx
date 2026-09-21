import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/tailor-resume";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Navbar compact />
      <main className="min-h-[calc(100vh-72px-200px)] bg-paper">
        <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center border border-ink bg-ink text-paper">
              <LogIn size={20} strokeWidth={1.8} />
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.03em]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#64625D]">
              Log in to continue tailoring your resume
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert>{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail size={16} className="text-[#64625D]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="focus-ring w-full border border-line bg-paper px-4 py-3 pl-10 text-sm transition-colors hover:border-[#B8B5AB] focus:border-accent"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock size={16} className="text-[#64625D]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="focus-ring w-full border border-line bg-paper px-4 py-3 pl-10 text-sm transition-colors hover:border-[#B8B5AB] focus:border-accent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#64625D]">Don't have an account? </span>
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="focus-ring font-semibold text-accent hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
