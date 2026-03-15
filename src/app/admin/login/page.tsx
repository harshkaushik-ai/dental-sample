"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        // Store token in localStorage as backup
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_name", data.admin.name);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-teal-900 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center shadow-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9 2 6 4.5 6 8c0 2 .8 3.8 2 5 .6.6 1 1.4 1 2.2V17a1 1 0 001 1h4a1 1 0 001-1v-1.8c0-.8.4-1.6 1-2.2 1.2-1.2 2-3 2-5 0-3.5-3-6-6-6z"
                  fill="white"
                  fillOpacity=".9"
                />
              </svg>
            </div>
            <span className="font-display text-2xl font-semibold text-white tracking-wide">
              Lumina<span className="text-brand-300">.</span>
            </span>
          </div>
          <h1 className="text-white text-xl font-semibold">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage appointments</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <User size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <Lock size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-brand-200/50 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-amber-700 text-xs font-medium mb-1">First time setup?</p>
            <p className="text-amber-600 text-xs">
              Run the setup script to create your admin account:{" "}
              <code className="bg-amber-100 px-1 rounded">npm run setup-admin</code>
            </p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Lumina Dental. Admin access only.
        </p>
      </div>
    </div>
  );
}
