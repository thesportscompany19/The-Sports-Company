"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { login } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/common/PrimaryButton";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    // Simulate a small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const result = login(email.trim(), password);
    if (result.success) {
      router.replace("/admin/dashboard");
    } else {
      setErrors({ api: result.error });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      
      <div className="hidden lg:flex w-[45%] bg-[#0B1C2D] flex-col items-center justify-center p-12 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="relative size-28 mb-6 mx-auto">
            <Image
              src="/images/logo.png"
              alt="The Sports Company"
              fill
              sizes="120px"
              className="object-cover drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            The Sports Company
          </h1>
          <p className="text-[#C62828] font-semibold text-lg mb-8">Admin Control Panel</p>

          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Manage events, matches, coaches, players and all website content from one unified dashboard.
          </p>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Events", value: "6+" },
              { label: "Coaches", value: "6+" },
              { label: "Players", value: "8+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="relative size-11 shrink-0">
              <Image
                src="/images/logo.png"
                alt="The Sports Company"
                fill
                sizes="44px"
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <p className="font-extrabold text-[#0B1C2D] text-lg leading-none">The Sports Company</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="size-9 bg-[#0B1C2D]/10 rounded-lg flex items-center justify-center">
                <Shield className="size-4 text-[#0B1C2D]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B1C2D]">Welcome back</h2>
                <p className="text-xs text-gray-400">Sign in to your admin account</p>
              </div>
            </div>

            {/* API error */}
            {errors.api && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#0B1C2D] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tidasports.com"
                  autoComplete="email"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all",
                    "placeholder:text-gray-300",
                    errors.email
                      ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 focus:border-[#0B1C2D] focus:bg-white focus:ring-2 focus:ring-[#0B1C2D]/10"
                  )}
                />
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#0B1C2D] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={cn(
                      "w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none transition-all",
                      "placeholder:text-gray-300",
                      errors.password
                        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50 focus:border-[#0B1C2D] focus:bg-white focus:ring-2 focus:ring-[#0B1C2D]/10"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
              </div>

              {/* Submit */}
              <PrimaryButton
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 rounded-lg text-sm font-semibold transition-all mt-2 h-auto",
                  loading && "opacity-60 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </PrimaryButton>
            </form>

            {/* Hint */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-2">Demo credentials</p>
              <div className="bg-gray-50 rounded-lg px-4 py-3 font-mono text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">admin@tidasports.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Password</span>
                  <span className="font-medium">Admin@2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
