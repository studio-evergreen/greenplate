"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/lib/utils/validation";
import { getThemeCookie, setThemeCookie } from "@/lib/utils/cookies";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    try {
      // 1. 쿠키에서 theme 읽기
      const cookieTheme = getThemeCookie();
      setThemeState(cookieTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(cookieTheme);
      return;
    } catch (error) {
      console.warn('Failed to load theme from cookie:', error);
    }
    
    try {
      // 2. 시스템 다크모드 감지
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme: Theme = prefersDark ? "dark" : "light";
      setThemeState(initialTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(initialTheme);
    } catch (error) {
      console.error('Failed to detect system theme:', error);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      setThemeCookie(newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
} 