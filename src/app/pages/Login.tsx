import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Language = "EN" | "FR";

interface LoginProps {
  lang: Language;
  onLangChange: (l: Language) => void;
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function Login({ lang, onLangChange, onLogin, loading = false, error = null }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const t = {
    welcome: lang === "EN" ? "Welcome Back" : "Bienvenue",
    subtitle: lang === "EN" ? "Sign in to access your admin dashboard" : "Connectez-vous pour accéder à votre tableau de bord",
    email: lang === "EN" ? "Email" : "E-mail",
    emailPlaceholder: lang === "EN" ? "Enter your email" : "Entrez votre e-mail",
    password: lang === "EN" ? "Password" : "Mot de passe",
    passwordPlaceholder: lang === "EN" ? "Enter your password" : "Entrez votre mot de passe",
    rememberMe: lang === "EN" ? "Remember me" : "Se souvenir de moi",
    login: lang === "EN" ? "Login" : "Connexion",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password, rememberMe);
    } catch {
      // Error is handled by App state, no additional action needed here.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6] flex items-center justify-center p-4">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#d1d5dc] hover:bg-gray-50 transition-colors text-sm font-medium text-[#646464] shadow-sm"
          >
            <span className="text-base leading-none">{lang === "EN" ? "🇬🇧" : "🇫🇷"}</span>
            <span>{lang === "EN" ? "English" : "Français"}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-[#d1d5dc] shadow-xl overflow-hidden z-50">
              {(["EN", "FR"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    onLangChange(l);
                    setLangOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    lang === l ? "text-[#1b457c] font-semibold" : "text-[#111827]"
                  }`}
                >
                  <span>{l === "EN" ? "🇬🇧" : "🇫🇷"}</span>
                  <span>{l === "EN" ? "English" : "Français"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: "linear-gradient(145deg, #1b457c, #5286ca)" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "Poppins, sans-serif", color: "#1b457c" }}
            >
              FIXGO
            </h1>
            <p className="text-xs text-[#6b7280]">Admin Dashboard</p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold text-[#111827] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {t.welcome}
            </h2>
            <p className="text-sm text-[#6b7280]">{t.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#374151] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3 bg-white border border-[#d1d5dc] rounded-xl outline-none focus:ring-2 focus:ring-[#1b457c]/20 focus:border-[#1b457c] transition-all text-sm text-[#111827]"
                style={{ fontFamily: "Inter, sans-serif" }}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#374151] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 bg-white border border-[#d1d5dc] rounded-xl outline-none focus:ring-2 focus:ring-[#1b457c]/20 focus:border-[#1b457c] transition-all text-sm text-[#111827] pr-12"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#6b7280] hover:text-[#111827] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#d1d5dc] text-[#1b457c] focus:ring-2 focus:ring-[#1b457c]/20"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-[#374151] cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t.rememberMe}
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {loading ? (lang === "EN" ? "Signing in..." : "Connexion...") : t.login}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#6b7280] mt-6">
          © 2026 FIXGO - On-Demand Artisan Service Platform. {lang === "EN" ? "All rights reserved." : "Tous droits réservés."}
        </p>
      </div>
    </div>
  );
}
