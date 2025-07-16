"use client";

import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { useLanguage } from "./LanguageProvider";
import BottomSheet from "./BottomSheet";

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
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    // 모바일 화면 크기 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (open && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside, isMobile]);

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

  const renderLanguageOptions = () => (
    <>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={`flex items-center gap-3 w-full px-4 py-4 text-left transition font-semibold cursor-pointer ${
            lang === l.code 
              ? "bg-[var(--border)] text-[var(--foreground)]" 
              : "text-[var(--muted)] hover:bg-[var(--border)]/50"
          }`}
          onClick={() => handleLanguageSelect(l.code)}
        >
          <span className="text-2xl">{l.flag}</span>
          <span className="text-lg">{l.label}</span>
        </button>
      ))}
    </>
  );

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
      
      {/* 모바일: 바텀 시트 */}
      {isMobile && (
        <BottomSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          title="언어 선택"
        >
          <div className="py-2">
            {renderLanguageOptions()}
          </div>
        </BottomSheet>
      )}
      
      {/* 데스크톱: 드롭다운 */}
      {!isMobile && open && (
        <div className="absolute right-0 mt-2 w-36 bg-[var(--card)] rounded-xl shadow-lg border border-[var(--border)] z-50 py-2 animate-fade-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`flex items-center gap-2 w-full px-4 py-2 text-base rounded-lg transition font-semibold cursor-pointer ${
                lang === l.code 
                  ? "bg-[var(--border)] text-[var(--foreground)]" 
                  : "text-[var(--muted)] hover:bg-[var(--border)]/50"
              }`}
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