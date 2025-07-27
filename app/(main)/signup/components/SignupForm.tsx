"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseClientForBrowser } from "@/lib/utils/supabase/client";
import Input from "../../../components/Input";
import { useLanguage } from "../../../components/LanguageProvider";
import Button from "../../../components/Button";
import { ROUTES } from "@/lib/constants/routes";
import { useToast } from "../../../components/ToastProvider";
import { handleAuthError } from "@/lib/utils/auth-errors";
import GoogleIcon from "../../../components/GoogleIcon";
import { validateSignupForm } from "@/lib/utils/form-validation";
import { trackEvent } from "@/lib/utils/analytics";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || '';
      const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || '';
      const password = (form.elements.namedItem("password") as HTMLInputElement)?.value || '';
      const confirm = (form.elements.namedItem("confirm") as HTMLInputElement)?.value || '';
      const agreed = (form.elements.namedItem("terms") as HTMLInputElement)?.checked || false;

      const validation = validateSignupForm({ name, email, password, confirm, agreed });
      if (!validation.isValid) {
        showError(
          t(validation.translationKey || 'auth.errors.generic') || validation.error || 'Validation failed'
        );
        return;
      }

      const supabase = createSupabaseClientForBrowser();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + ROUTES.SIGNIN
        }
      });
      
      if (signUpError) {
        const errorInfo = handleAuthError(signUpError);
        showError(
          t(errorInfo.translationKey || 'auth.errors.generic') || errorInfo.message
        );
        
        trackEvent('sign_up_failed', {
          event_category: 'auth',
          method: 'email',
          error_code: signUpError.message
        });
      } else {
        showSuccess(
          t("signup.emailSent") || "Check your email to verify your account!"
        );
        
        trackEvent('sign_up', {
          event_category: 'auth',
          method: 'email',
          success: true
        });
        
        form.reset();
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      showError(
        t(errorInfo.translationKey || 'auth.errors.generic') || errorInfo.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[var(--card)] rounded-3xl shadow-2xl p-10 border border-[var(--border)]">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2 text-center font-inter">{t("signup.title")}</h1>
      <p className="text-[var(--muted)] text-center mb-8">{t("signup.subtitle")}</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
        <Input name="name" type="text" placeholder={t("auth.name")}
          fullWidth autoComplete="name" />
        <Input name="email" type="email" placeholder={t("auth.email")}
          fullWidth autoComplete="email" />
        <div className="relative">
          <Input name="password" type={showPassword ? "text" : "password"} placeholder={t("auth.password")}
            fullWidth autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="inline-flex items-center justify-center h-8 px-3 rounded-xl text-xs text-[var(--muted)] hover:text-[var(--foreground)] bg-transparent focus:outline-none"
                style={{ boxShadow: "none", border: "none" }}
              >
                {showPassword ? t("signup.hide") : t("signup.show")}
              </button>
            }
          />
        </div>
        <div className="relative">
          <Input name="confirm" type={showConfirm ? "text" : "password"} placeholder={t("signup.confirmPassword")}
            fullWidth autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                className="inline-flex items-center justify-center h-8 px-3 rounded-xl text-xs text-[var(--muted)] hover:text-[var(--foreground)] bg-transparent focus:outline-none"
                style={{ boxShadow: "none", border: "none" }}
              >
                {showConfirm ? t("signup.hide") : t("signup.show")}
              </button>
            }
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="marketing" className="accent-emerald-600" />
          <label htmlFor="marketing" className="text-[var(--muted)] text-sm">{t("signup.marketing")}</label>
        </div>
        <div className="flex items-center gap-2">
          <input name="terms" type="checkbox" id="terms" required className="accent-emerald-600" />
          <label htmlFor="terms" className="text-[var(--muted)] text-sm">
            {t("signup.agree1")}<Link href={ROUTES.TERMS} className="underline ml-1">{t("signup.terms")}</Link>{t("signup.agree2")}<Link href={ROUTES.PRIVACY} className="underline ml-1">{t("signup.privacy")}</Link>
          </label>
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? t("signup.creating") : t("signup.create")}
        </Button>
      </form>
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="mx-4 text-[var(--muted)] text-sm">{t("signup.or")}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <Button
        variant="secondary"
        fullWidth
        className="mb-2 flex items-center justify-center gap-2"
        onClick={async () => {
          trackEvent('sign_up_attempt', {
            event_category: 'auth',
            method: 'google'
          });
          
          const supabase = createSupabaseClientForBrowser();
          await supabase.auth.signInWithOAuth({ provider: "google" });
        }}
      >
        <GoogleIcon />
        {t("auth.google")}
      </Button>
      <p className="text-center text-[var(--muted)] text-sm mt-4">
        {t("signup.already")}<Link href={ROUTES.SIGNIN} className="underline">{t("topbar.signIn")}</Link>
      </p>
    </div>
  );
}