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

// 쿠키 동의 관리
export interface CookieConsent {
  necessary: boolean;      // 필수 쿠키 (항상 true)
  analytics: boolean;      // 분석 쿠키 (GA, GTM)
  marketing: boolean;      // 마케팅 쿠키
  timestamp: number;       // 동의 시간
  version: string;         // 정책 버전
}

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_VERSION = '1.0';

// 기본 동의 설정
export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
  version: CONSENT_VERSION
};

// 쿠키 동의 저장
export function saveCookieConsent(consent: Partial<CookieConsent>): void {
  const fullConsent: CookieConsent = {
    ...defaultConsent,
    ...consent,
    necessary: true, // 필수 쿠키는 항상 true
    timestamp: Date.now(),
    version: CONSENT_VERSION
  };

  // 1년 만료
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  
  document.cookie = `${CONSENT_COOKIE_NAME}=${JSON.stringify(fullConsent)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

// 쿠키 동의 불러오기
export function getCookieConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const consentCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${CONSENT_COOKIE_NAME}=`)
  );
  
  if (!consentCookie) return null;
  
  try {
    const consentData = JSON.parse(
      consentCookie.split('=')[1]
    ) as CookieConsent;
    
    // 버전이 다르면 null 반환 (재동의 필요)
    if (consentData.version !== CONSENT_VERSION) {
      return null;
    }
    
    return consentData;
  } catch {
    return null;
  }
}

// 동의 여부 확인
export function hasValidConsent(): boolean {
  return getCookieConsent() !== null;
}

// 분석 쿠키 동의 여부
export function isAnalyticsAllowed(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics === true;
}

// 마케팅 쿠키 동의 여부  
export function isMarketingAllowed(): boolean {
  const consent = getCookieConsent();
  return consent?.marketing === true;
}

// 동의 철회 (쿠키 삭제)
export function revokeCookieConsent(): void {
  document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// 모든 쿠키 허용
export function acceptAllCookies(): void {
  saveCookieConsent({
    analytics: true,
    marketing: true
  });
}

// 필수 쿠키만 허용
export function acceptNecessaryOnly(): void {
  saveCookieConsent({
    analytics: false,
    marketing: false
  });
}