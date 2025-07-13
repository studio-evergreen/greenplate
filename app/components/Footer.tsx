"use client";

import Link from "next/link";
import { siteConfig } from "../config";
import {useLanguage} from "@/app/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] py-6">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6">
        <div className="text-sm text-[var(--foreground)] font-inter text-center sm:text-left">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm text-[var(--foreground)] font-inter">
          <Link href="/privacy" className="hover:underline">{t("home.footer-privacy")}</Link>
          <Link href="/terms" className="hover:underline">{t("home.footer-terms")}</Link>
          <a href="https://github.com/greenplate" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
