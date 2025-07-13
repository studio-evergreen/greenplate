"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { memo, useCallback } from "react";

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);
  
  return (
    <button
      className="p-2 rounded hover:bg-[var(--border)] cursor-pointer"
      aria-label="Theme toggle"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
});

export default ThemeToggle; 