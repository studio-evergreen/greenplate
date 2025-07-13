"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/lib/utils/validation";
import { getLanguageCookie, setLanguageCookie } from "@/lib/utils/cookies";

type Messages = Record<string, string | Record<string, string | string[] | Record<string, string | string[]>>>;

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

async function loadMessages(lang: Language): Promise<Messages> {
  try {
    if (lang === "ko") {
      const moduleImport = await import("../../locales/ko.json");
      return moduleImport.default;
    } else {
      const moduleImport = await import("../../locales/en.json");
      return moduleImport.default;
    }
  } catch (error) {
    console.error(`Failed to load messages for language: ${lang}`, error);
    // Fallback to English
    const moduleImport = await import("../../locales/en.json");
    return moduleImport.default;
  }
}


export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en");
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeLanguage() {
      try {
        const cookieLang = getLanguageCookie();
        setLangState(cookieLang);
        const loadedMessages = await loadMessages(cookieLang);
        setMessages(loadedMessages);
      } catch (error) {
        console.warn('Failed to load language from cookie:', error);
        // Fallback to English
        const fallbackMessages = await loadMessages('en');
        setMessages(fallbackMessages);
      } finally {
        setIsLoading(false);
      }
    }

    initializeLanguage();
  }, []);

  const setLang = async (newLang: Language) => {
    try {
      setIsLoading(true);
      setLangState(newLang);
      const loadedMessages = await loadMessages(newLang);
      setMessages(loadedMessages);
      setLanguageCookie(newLang);
    } catch (error) {
      console.error('Failed to set language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    if (typeof value === "string" && vars) {
      let str = value;
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
      return str;
    }
    return typeof value === "string" ? value : key;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--foreground)]"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
