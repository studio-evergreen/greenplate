"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClientForBrowser } from "@/lib/utils/supabase/client";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useLanguage } from "../../components/LanguageProvider";
import { ROUTES } from "@/lib/constants/routes";
import { useToast } from "../../components/ToastProvider";
import { handleAuthError } from "@/lib/utils/auth-errors";
import GoogleIcon from "../../components/GoogleIcon";
import { validateSigninForm } from "@/lib/utils/form-validation";

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || '';
      const password = (form.elements.namedItem("password") as HTMLInputElement)?.value || '';

      const validation = validateSigninForm({ email, password });
      if (!validation.isValid) {
        showError(
          t(validation.translationKey || 'auth.errors.generic') || validation.error || 'Validation failed'
        );
        return;
      }

      const supabase = createSupabaseClientForBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        const errorInfo = handleAuthError(signInError);
        showError(
          t(errorInfo.translationKey || 'auth.errors.generic') || errorInfo.message
        );
      } else {
        showSuccess(t("signin.success") || "Successfully signed in!");
        router.push(ROUTES.HOME);
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
    <main className="flex-1 flex flex-col items-center justify-center w-full min-h-screen bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-md bg-[var(--card)] rounded-3xl shadow-2xl p-10 border border-[var(--border)]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2 text-center font-inter">{t("signin.title")}</h1>
        <p className="text-[var(--muted)] text-center mb-8">{t("signin.subtitle")}</p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          <Input name="email" type="email" placeholder={t("auth.email")} fullWidth autoComplete="email" />
          <div className="relative">
            <Input name="password" type={showPassword ? "text" : "password"} placeholder={t("auth.password")} fullWidth autoComplete="current-password" />
            <Button type="button" variant="ghost" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 h-auto min-w-0">
              {showPassword ? t("signin.hide") : t("signin.show")}
            </Button>
          </div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? t("signin.loading") : t("topbar.signIn")}
          </Button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="mx-4 text-[var(--muted)] text-sm">{t("signin.or")}</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <Button
          variant="secondary"
          fullWidth
          className="mb-2 flex items-center justify-center gap-2"
          onClick={async () => {
            const supabase = createSupabaseClientForBrowser();
            await supabase.auth.signInWithOAuth({ provider: "google" });
          }}
        >
          <GoogleIcon />
          {t("auth.google")}
        </Button>
        <p className="text-center text-[var(--muted)] text-sm mt-4">
          {t("signin.noAccount")}<Link href={ROUTES.SIGNUP} className="underline">{t("topbar.signUp")}</Link>
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Link href={ROUTES.TERMS} className="underline text-xs text-[var(--foreground)] opacity-70 hover:opacity-100">{t("signup.terms")}</Link>
          <span className="text-[var(--muted)] text-xs">|</span>
          <Link href={ROUTES.PRIVACY} className="underline text-xs text-[var(--foreground)] opacity-70 hover:opacity-100">{t("signup.privacy")}</Link>
        </div>
      </div>
    </main>
  );
} 