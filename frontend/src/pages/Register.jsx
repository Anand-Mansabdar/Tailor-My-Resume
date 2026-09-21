import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Registration failed. Please try again.");
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
              <UserPlus size={20} strokeWidth={1.8} />
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.03em]">Create your account</h1>
            <p className="mt-2 text-sm text-[#64625D]">
              Start tailoring your resume with AI
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
              <label htmlFor="username" className="mb-2 block text-sm font-semibold">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User size={16} className="text-[#64625D]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="focus-ring w-full border border-line bg-paper px-4 py-3 pl-10 text-sm transition-colors hover:border-[#B8B5AB] focus:border-accent"
                  placeholder="johndoe"
                  disabled={loading}
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <p className="mt-1 text-xs text-[#64625D]">
                3-50 characters, alphanumeric (underscores and hyphens allowed)
              </p>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="focus-ring w-full border border-line bg-paper px-4 py-3 pl-10 text-sm transition-colors hover:border-[#B8B5AB] focus:border-accent"
                  placeholder="••••••••"
                  disabled={loading}
                  minLength={8}
                />
              </div>
              <p className="mt-1 text-xs text-[#64625D]">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock size={16} className="text-[#64625D]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="focus-ring w-full border border-line bg-paper px-4 py-3 pl-10 text-sm transition-colors hover:border-[#B8B5AB] focus:border-accent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#64625D]">Already have an account? </span>
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="focus-ring font-semibold text-accent hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
