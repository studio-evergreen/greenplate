"use client";

import Link from "next/link";
import { Settings, Languages, Menu, X } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { siteConfig } from "../config";
import { createSupabaseClientForBrowser } from "@/lib/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Button from "./Button";
import { useLanguage } from "./LanguageProvider";
import LanguageDropdown from "./LanguageDropdown";
import ThemeToggle from "./ThemeToggle";
import UserProfileDropdown from "./UserProfileDropdown";
import { ROUTES } from "@/lib/constants/routes";
import { useToast } from "./ToastProvider";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();

  const supabase = useMemo(() => createSupabaseClientForBrowser(), []);
  
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showError(t("auth.errors.signoutFailed") || "Failed to sign out");
      } else {
        showSuccess(t("auth.signoutSuccess") || "Successfully signed out");
      }
    } catch {
      showError(t("auth.errors.generic") || "An unexpected error occurred");
    }
  }, [supabase, showError, showSuccess, t]);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (error) {
          console.warn('Failed to get user:', error);
        } else {
          setUser(data.user);
        }
      })
      .catch((error) => {
        console.error('Error getting user:', error);
      });
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 min-h-[56px]">
        {/* 로고 */}
        <div className="font-extrabold text-2xl tracking-tight text-[var(--foreground)] font-inter">
          <Link href={ROUTES.HOME}>{siteConfig.name}</Link>
        </div>
        {/* 네비게이션 메뉴 (데스크탑) */}
        <nav className="hidden md:flex gap-8 text-[var(--foreground)] text-[15px] font-medium font-inter">
          <Link href="/components">{t("common.components")}</Link>
          <Link href="/blog">{t("topbar.blog")}</Link>
          <Link href="#">{t("topbar.contact")}</Link>
          <Link href="#">{t("topbar.payments")}</Link>
        </nav>
        {/* 우측 아이콘 및 버튼 */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* 모바일 햄버거 메뉴 */}
          <button
            className="md:hidden p-2 rounded hover:bg-[var(--border)] cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          {/* 데스크탑: 설정/테마/언어/인증 */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded hover:bg-[var(--border)] cursor-pointer" aria-label="Settings">
              <Settings size={20} />
            </button>
            <ThemeToggle />
            <LanguageDropdown />
            <div className="w-px h-6 bg-[var(--border)] mx-2" />
            {user ? (
              <UserProfileDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              <>
                <Link href={ROUTES.SIGNIN}>
                  <Button variant="ghost" className="px-3 py-1 text-[15px] font-semibold font-inter h-auto min-w-0">{t("topbar.signIn")}</Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button variant="primary" className="ml-2 px-4 py-1.5 text-[15px] font-semibold font-inter h-auto min-w-0">{t("topbar.signUp")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 모바일 메뉴 오버레이 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* 오버레이 배경 */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
            tabIndex={-1}
          />
          {/* 메뉴 패널 */}
          <nav className="relative bg-[var(--background)] w-64 max-w-[80vw] h-full shadow-xl p-6 flex flex-col gap-6 animate-slide-in-left">
            <button
              className="absolute top-4 right-4 p-2 rounded hover:bg-[var(--border)] cursor-pointer"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={28} />
            </button>
            {/* 상단 아이콘 버튼들 */}
            <div className="flex gap-3 mb-2 mt-2">
              <button className="p-2 rounded hover:bg-[var(--border)] cursor-pointer" aria-label="Settings">
                <Settings size={22} />
              </button>
              <ThemeToggle />
              <button className="p-2 rounded hover:bg-white/10" aria-label="Language">
                <Languages size={22} />
              </button>
            </div>
            <Link href="/components" className="text-[var(--foreground)] text-lg font-semibold font-inter" onClick={() => setMenuOpen(false)}>
              {t("common.components")}
            </Link>
            <Link href="/blog" className="text-[var(--foreground)] text-lg font-semibold font-inter" onClick={() => setMenuOpen(false)}>
              {t("topbar.blog")}
            </Link>
            <Link href="#" className="text-[var(--foreground)] text-lg font-semibold font-inter" onClick={() => setMenuOpen(false)}>
              {t("topbar.contact")}
            </Link>
            <Link href="#" className="text-[var(--foreground)] text-lg font-semibold font-inter" onClick={() => setMenuOpen(false)}>
              {t("topbar.payments")}
            </Link>
            <div className="border-t border-[var(--border)] my-2" />
            <Link href={ROUTES.SIGNIN} className="text-[var(--foreground)] text-base font-medium font-inter" onClick={() => setMenuOpen(false)}>
              {t("topbar.signIn")}
            </Link>
            <Link href={ROUTES.SIGNUP} className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded font-semibold text-base font-inter hover:bg-gray-200 transition text-center" onClick={() => setMenuOpen(false)}>
              {t("topbar.signUp")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 