"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  validateIndianMobile,
  validatePasswordPolicy,
  normalizePhone,
} from "@/lib/passwordPolicy";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Gamepad2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, googleLogin } = useAuth();
  const { settings } = useSettings();

  const [tab, setTab] = useState<"signin" | "signup">(authModalTab || "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleClientConfigured, setGoogleClientConfigured] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // For Sign In (Mobile or Email)
  const [email, setEmail] = useState(""); // For Create Account
  const [phone, setPhone] = useState(""); // For Create Account
  const [password, setPassword] = useState("");

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "778428134705-2gvaupmnrvbhgmatcds1bhtjfspgmd8j.apps.googleusercontent.com";

  // Initialize Google Identity Services (GSI)
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCredentialResponse = async (response: any) => {
      if (response && response.credential) {
        setLoading(true);
        setError(null);
        try {
          const res = await googleLogin(response.credential);
          if (!res.success) {
            setError(res.error || "Google sign-in failed.");
          }
        } catch (err: any) {
          setError(err.message || "An error occurred during Google sign-in.");
        } finally {
          setLoading(false);
        }
      }
    };

    const initGsi = () => {
      if (window.google?.accounts?.id && googleClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnContainer = document.getElementById("google-btn-container");
          if (btnContainer) {
            btnContainer.innerHTML = "";
            window.google.accounts.id.renderButton(btnContainer, {
              theme: "outline",
              size: "large",
              width: "100%",
              shape: "pill",
              text: "continue_with",
            });
          }
        } catch (e) {
          console.error("GSI init error:", e);
        }
      }
    };

    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(initGsi, 50);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initGsi, 50);
    }
  }, [googleClientId, googleLogin, isAuthModalOpen]);

  // Sync tab with context when modal opens
  React.useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
      setError(null);
    }
  }, [authModalTab, isAuthModalOpen]);

  // Real-time mobile validation for signup
  const phoneValidation = useMemo(() => {
    if (!phone) return null;
    return validateIndianMobile(phone);
  }, [phone]);

  // Real-time password policy validation for signup
  const pwdValidation = useMemo(() => {
    if (!password) return null;
    return validatePasswordPolicy(password, {
      name,
      email,
      phone,
    });
  }, [password, name, email, phone]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === "signin") {
      if (!identifier.trim() || !password) {
        setError("Please enter your Mobile or Email and Password.");
        return;
      }
      setLoading(true);
      try {
        const res = await login(identifier, password);
        if (!res.success) {
          setError(res.error || "Login failed.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    } else {
      // Sign Up Validation
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setError("Please fill in all fields.");
        return;
      }

      // 1. Strict Phone Validation (reject 11 digits e.g. 86868686861)
      const pCheck = validateIndianMobile(phone);
      if (!pCheck.valid) {
        setError(pCheck.error || "Please enter a valid 10-digit Indian mobile number.");
        return;
      }

      // 2. Strict Password Policy Validation
      const pValidation = validatePasswordPolicy(password, {
        name,
        email,
        phone: pCheck.normalized,
      });

      if (!pValidation.isValid) {
        setError(pValidation.errors[0] || "Password does not meet required security standards.");
        return;
      }

      setLoading(true);
      try {
        const res = await register(name, email, pCheck.normalized, password);
        if (!res.success) {
          setError(res.error || "Registration failed.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleClick = async () => {
    setError(null);

    if (!googleClientId) {
      setError(
        "Real Google Sign-In requires NEXT_PUBLIC_GOOGLE_CLIENT_ID to be set. Please log in or register with your Mobile Number or Email above."
      );
      return;
    }

    // 1. Try Google Identity Services (GSI) One-Tap / Popup if available
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              setLoading(true);
              const res = await googleLogin(response.credential);
              if (!res.success) {
                setError(res.error || "Google sign-in failed.");
              }
              setLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Prompt was dismissed or blocked by browser -> open standard Google OAuth URL
            const redirectUri = window.location.origin + "/account";
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
              redirectUri
            )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}&prompt=select_account`;
            window.location.href = authUrl;
          }
        });
        return;
      } catch (e) {
        console.warn("GSI prompt failed, falling back to OAuth redirect:", e);
      }
    }

    // 2. Direct fallback to official Google OAuth 2.0 Account Picker dialog
    const redirectUri = window.location.origin + "/account";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}&prompt=select_account`;
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[460px] bg-[#0c101d] border border-slate-800/90 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-purple-950/40 z-10 animate-in zoom-in-95 duration-200 text-white max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2.5 mb-6">
          <img
            src={settings.logoUrl || "/images/jijau-logo.jpg"}
            alt="Jijau Computers"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/90 shadow-xl mx-auto shadow-purple-600/30"
          />
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>Jijau</span>
            <span className="text-amber-400">Computers</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {tab === "signin" ? "Welcome back to your gaming & hardware hub." : "Create your customer account."}
          </p>
        </div>

        {/* Toggle Switch Pill */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#141b2d] border border-slate-800/80 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setError(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === "signin"
                ? "bg-[#1f2942] text-white shadow-md border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === "signup"
                ? "bg-[#1f2942] text-white shadow-md border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "signup" && (
            <>
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#111728] border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all"
                />
              </div>

              {/* Mobile Phone (Strict 10 digits) */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={13} // Allows +91 / 0 input which gets normalized to 10
                    autoComplete="tel"
                    placeholder="10-Digit Mobile (e.g. 9420418389)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 bg-[#111728] border rounded-2xl text-xs text-white placeholder:text-slate-500 outline-none transition-all font-mono ${
                      phoneValidation
                        ? phoneValidation.valid
                          ? "border-emerald-500/60 focus:border-emerald-500"
                          : "border-rose-500/60 focus:border-rose-500"
                        : "border-slate-800 focus:border-purple-500"
                    }`}
                  />
                  {phoneValidation && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      {phoneValidation.valid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  )}
                </div>
                {phoneValidation && !phoneValidation.valid && (
                  <p className="text-[11px] text-rose-400 mt-1 pl-2 font-medium">
                    {phoneValidation.error}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#111728] border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all"
                />
              </div>
            </>
          )}

          {tab === "signin" && (
            /* Unified Email or Mobile Identifier Field */
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="Email Address or 10-Digit Mobile"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#111728] border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete={tab === "signup" ? "new-password" : "current-password"}
                maxLength={128}
                placeholder={tab === "signup" ? "Create Password (Min 8 chars, A-Z, 0-9, special)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#111728] border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Strength Meter & Real-Time Policy Checklist (For Sign Up) */}
            {tab === "signup" && pwdValidation && (
              <div className="mt-3 p-3 rounded-2xl bg-[#141b2d] border border-slate-800/80 space-y-2.5 animate-in fade-in">
                {/* Strength Meter Bar & Label */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Password Strength:</span>
                    <span className={`font-bold ${pwdValidation.color}`}>
                      {pwdValidation.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${pwdValidation.barColor}`}
                      style={{ width: `${Math.max(8, pwdValidation.score)}%` }}
                    />
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-800/60">
                  <div className={`flex items-center gap-1.5 ${pwdValidation.checks.minLength ? "text-emerald-400" : "text-slate-400"}`}>
                    <Check className={`w-3.5 h-3.5 ${pwdValidation.checks.minLength ? "text-emerald-400 font-bold" : "text-slate-600"}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwdValidation.checks.hasUppercase && pwdValidation.checks.hasLowercase ? "text-emerald-400" : "text-slate-400"}`}>
                    <Check className={`w-3.5 h-3.5 ${pwdValidation.checks.hasUppercase && pwdValidation.checks.hasLowercase ? "text-emerald-400 font-bold" : "text-slate-600"}`} />
                    <span>Uppercase & lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwdValidation.checks.hasNumber ? "text-emerald-400" : "text-slate-400"}`}>
                    <Check className={`w-3.5 h-3.5 ${pwdValidation.checks.hasNumber ? "text-emerald-400 font-bold" : "text-slate-600"}`} />
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwdValidation.checks.hasSpecialChar ? "text-emerald-400" : "text-slate-400"}`}>
                    <Check className={`w-3.5 h-3.5 ${pwdValidation.checks.hasSpecialChar ? "text-emerald-400 font-bold" : "text-slate-600"}`} />
                    <span>Special (@, #, $, %, etc.)</span>
                  </div>
                </div>

                {/* Contextual & Passphrase Tip */}
                {pwdValidation.checks.isStrongLength ? (
                  <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Great job! 16+ character passphrases provide maximum security.</span>
                  </div>
                ) : !pwdValidation.checks.noUserData ? (
                  <div className="flex items-center gap-1 text-[10px] text-rose-400 font-medium pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Cannot contain your name, email, or mobile number.</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (tab === "signup" && (phoneValidation ? !phoneValidation.valid : false))}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80"></div>
          </div>
          <span className="relative px-3 bg-[#0c101d] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google Sign In */}
        <div id="google-btn-container" className="w-full flex justify-center min-h-[44px]">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
