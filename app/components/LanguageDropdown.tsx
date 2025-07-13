"use client";

import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { useLanguage } from "./LanguageProvider";

const LANGUAGES = [
  {
    code: "ko",
    label: "한국어",
    flag: "🇰🇷",
  },
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
  },
];

const LanguageDropdown = memo(function LanguageDropdown() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const currentLanguage = useMemo(() => {
    return LANGUAGES.find((l) => l.code === lang);
  }, [lang]);

  const toggleOpen = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleLanguageSelect = useCallback(async (languageCode: string) => {
    await setLang(languageCode as "en" | "ko");
    setOpen(false);
  }, [setLang]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--border)] focus:outline-none cursor-pointer"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-xl">
          {currentLanguage?.flag}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-[var(--card)] rounded-xl shadow-lg border border-[var(--border)] z-50 py-2 animate-fade-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`flex items-center gap-2 w-full px-4 py-2 text-base rounded-lg transition font-semibold cursor-pointer ${lang === l.code ? "bg-[var(--border)] text-[var(--foreground)]" : "text-[var(--muted)] hover:bg-[var(--border)]/50"}`}
              onClick={() => handleLanguageSelect(l.code)}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default LanguageDropdown; 