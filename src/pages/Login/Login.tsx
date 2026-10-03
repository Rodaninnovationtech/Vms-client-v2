import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import logos from "../../components/assests/images/logos.jpg";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginId || !password) {
      setError("Please enter both Login ID and Password");
      return;
    }

    setSubmitting(true);
    const result = await login(loginId, password);
    setSubmitting(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid Login ID or Password");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface-muted">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-600/40" />
        <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-primary-800/50" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
            {/* <ShieldCheck size={22} className="text-white" /> */}
              <img src={logos} alt="VMS logo" className="w-full h-full object-contain p-1" />
          </div>
          <span className="text-white font-bold text-xl">VMS 2.0</span>
        </div>
        <div className="relative">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Visitor Management,
            <br /> simplified for every site.
          </h1>
          <p className="text-primary-100 text-sm max-w-md">
            Manage visitors, contractors, pre-registrations, approvals and property
            access from a single, secure dashboard.
          </p>
        </div>
        <p className="relative text-primary-200 text-xs">
          © {new Date().getFullYear()} VMS 2.0. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center">
              {/* <ShieldCheck size={20} className="text-white" /> */}
              <img src={logos} alt="VMS logo" className="w-10 h-10 rounded-lg object-contain" />
            </div>
            <span className="font-bold text-xl text-slate-900">VMS 2.0</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">
            Sign in to access the visitor management dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Login ID"
              placeholder="Enter your login ID"
              icon={<User size={16} />}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              disabled={submitting}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-primary-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-300" />
                Remember me
              </label>
              <button type="button" className="text-primary-700 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
