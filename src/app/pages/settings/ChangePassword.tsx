import { useState, FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { changePassword, loadStoredAuth } from "../../../services/auth";
import { ApiError } from "../../../services/api";

type Language = "EN" | "FR";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

interface ChangePasswordErrors {
  old_password?: string[];
  new_password?: string[];
  confirm_new_password?: string[];
  non_field_errors?: string[];
}

export default function ChangePassword({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ChangePasswordErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const t = {
    title: lang === "EN" ? "Change Password" : "Changer le mot de passe",
    subtitle: lang === "EN" ? "Ensure your account is using a strong, secure password." : "Assurez-vous que votre compte utilise un mot de passe fort et sécurisé.",
    currentPassword: lang === "EN" ? "Current Password" : "Mot de passe actuel",
    newPassword: lang === "EN" ? "New Password" : "Nouveau mot de passe",
    confirmPassword: lang === "EN" ? "Confirm Password" : "Confirmer le mot de passe",
    enterCurrent: lang === "EN" ? "Enter current password" : "Entrez le mot de passe actuel",
    enterNew: lang === "EN" ? "Enter new password" : "Entrez le nouveau mot de passe",
    enterConfirm: lang === "EN" ? "Confirm new password" : "Confirmez le nouveau mot de passe",
    strong: lang === "EN" ? "STRONG" : "FORT",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    update: lang === "EN" ? "Update Password" : "Mettre à jour",
    atLeast8: lang === "EN" ? "At least 8 characters long" : "Au moins 8 caractères",
    uppercase: lang === "EN" ? "Contains an uppercase letter" : "Contient une majuscule",
    number: lang === "EN" ? "Contains a number" : "Contient un chiffre",
    special: lang === "EN" ? "Contains a special character" : "Contient un caractère spécial",
    currentPasswordError: lang === "EN" ? "Current password is incorrect." : "Le mot de passe actuel est incorrect.",
    passwordMismatch: lang === "EN" ? "Passwords do not match." : "Les mots de passe ne correspondent pas.",
    success: lang === "EN" ? "Your password has been updated successfully." : "Votre mot de passe a été mis à jour avec succès.",
    serverError: lang === "EN" ? "Unable to update password. Please try again." : "Impossible de mettre à jour le mot de passe. Veuillez réessayer.",
  };

  const validation: PasswordValidation = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const passwordStrength = Object.values(validation).filter(Boolean).length;
  const strengthPercent = (passwordStrength / 4) * 100;
  const canSubmit = Object.values(validation).every(Boolean) && newPassword === confirmPassword && !submitting;

  const extractApiMessage = (data: any) => {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join(" ");
    if (typeof data === "object") {
      return Object.values(data)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .join(" ");
    }
    return String(data);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { accessToken } = loadStoredAuth();

    setFieldErrors({});
    setMessage(null);
    setSuccessMessage(null);

    if (!accessToken) {
      setMessage(t.serverError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t.passwordMismatch);
      return;
    }

    setSubmitting(true);

    try {
      await changePassword(accessToken, {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      setSuccessMessage(t.success);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const errData = error.data;
        setFieldErrors({
          old_password: Array.isArray(errData?.old_password) ? errData.old_password : errData?.old_password ? [String(errData.old_password)] : undefined,
          new_password: Array.isArray(errData?.new_password) ? errData.new_password : errData?.new_password ? [String(errData.new_password)] : undefined,
          confirm_new_password: Array.isArray(errData?.confirm_new_password) ? errData.confirm_new_password : errData?.confirm_new_password ? [String(errData.confirm_new_password)] : undefined,
        });
        setMessage(extractApiMessage(errData) || error.message || t.serverError);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(t.serverError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-3xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4 text-white flex items-center gap-3" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          {message && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.currentPassword}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder={t.enterCurrent}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.old_password?.length ? (
              <p className="mt-2 text-xs text-red-600">{fieldErrors.old_password[0]}</p>
            ) : null}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.newPassword}
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder={t.enterNew}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.new_password?.length ? (
              <p className="mt-2 text-xs text-red-600">{fieldErrors.new_password[0]}</p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.confirmPassword}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t.enterConfirm}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword ? (
              <p className="mt-2 text-xs text-red-600">{t.passwordMismatch}</p>
            ) : fieldErrors.confirm_new_password?.length ? (
              <p className="mt-2 text-xs text-red-600">{fieldErrors.confirm_new_password[0]}</p>
            ) : null}
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${strengthPercent}%`,
                      background: strengthPercent < 50 ? "#ef4444" : strengthPercent < 75 ? "#f59e0b" : "#3b82f6",
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">{t.strong}</span>
              </div>

              <div className="space-y-2">
                <ValidationItem valid={validation.length} text={t.atLeast8} />
                <ValidationItem valid={validation.uppercase} text={t.uppercase} />
                <ValidationItem valid={validation.number} text={t.number} />
                <ValidationItem valid={validation.special} text={t.special} />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-8 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full sm:w-auto px-8 py-2.5 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
            >
              {submitting ? `${t.update}...` : `🔒 ${t.update}`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          valid ? "bg-blue-500" : "bg-red-50 border border-red-200"
        }`}
      >
        {valid ? (
          <Check size={12} className="text-white" />
        ) : (
          <X size={12} className="text-red-500" />
        )}
      </div>
      <span className={`text-xs ${valid ? "text-foreground" : "text-red-500"}`}>
        {text}
      </span>
    </div>
  );
}
