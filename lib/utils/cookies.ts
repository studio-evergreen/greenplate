import { Language, Theme, isValidLanguage, isValidTheme } from './validation';

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
  } catch (error) {
    console.warn(`Failed to get cookie '${name}':`, error);
  }
  return undefined;
}

export function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.warn(`Failed to set cookie '${name}':`, error);
  }
}

export function getLanguageCookie(): Language {
  const cookieLang = getCookie('language');
  return isValidLanguage(cookieLang) ? cookieLang : 'en';
}

export function setLanguageCookie(language: Language): void {
  setCookie('language', language);
}

export function getThemeCookie(): Theme {
  const cookieTheme = getCookie('theme');
  return isValidTheme(cookieTheme) ? cookieTheme : 'light';
}

export function setThemeCookie(theme: Theme): void {
  setCookie('theme', theme);
}