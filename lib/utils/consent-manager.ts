// 동의 관리 추상화 - 쿠키에서 서버로 쉽게 변경 가능

import { CookieConsent, getCookieConsent, saveCookieConsent, hasValidConsent as hasValidCookieConsent } from './cookies';

export interface ConsentManager {
  getConsent(): Promise<CookieConsent | null>;
  saveConsent(consent: Partial<CookieConsent>): Promise<void>;
  hasValidConsent(): Promise<boolean>;
  isAnalyticsAllowed(): Promise<boolean>;
  isMarketingAllowed(): Promise<boolean>;
  revokeConsent(): Promise<void>;
  acceptAll(): Promise<void>;
  acceptNecessaryOnly(): Promise<void>;
}

// 쿠키 기반 구현 (현재)
class CookieConsentManager implements ConsentManager {
  async getConsent(): Promise<CookieConsent | null> {
    return getCookieConsent();
  }

  async saveConsent(consent: Partial<CookieConsent>): Promise<void> {
    saveCookieConsent(consent);
  }

  async hasValidConsent(): Promise<boolean> {
    return hasValidCookieConsent();
  }

  async isAnalyticsAllowed(): Promise<boolean> {
    const consent = getCookieConsent();
    return consent?.analytics === true;
  }

  async isMarketingAllowed(): Promise<boolean> {
    const consent = getCookieConsent();
    return consent?.marketing === true;
  }

  async revokeConsent(): Promise<void> {
    document.cookie = `cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  async acceptAll(): Promise<void> {
    saveCookieConsent({
      analytics: true,
      marketing: true
    });
  }

  async acceptNecessaryOnly(): Promise<void> {
    saveCookieConsent({
      analytics: false,
      marketing: false
    });
  }
}

// 서버 기반 구현 (미래 - 예시)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ServerConsentManager implements ConsentManager {
  async getConsent(): Promise<CookieConsent | null> {
    // TODO: 서버 API 호출
    // const response = await fetch('/api/consent');
    // return response.json();
    throw new Error('Server consent manager not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async saveConsent(_consent: Partial<CookieConsent>): Promise<void> {
    // TODO: 서버 API 호출
    // await fetch('/api/consent', {
    //   method: 'POST',
    //   body: JSON.stringify(_consent)
    // });
    throw new Error('Server consent manager not implemented yet');
  }

  async hasValidConsent(): Promise<boolean> {
    const consent = await this.getConsent();
    return consent !== null;
  }

  async isAnalyticsAllowed(): Promise<boolean> {
    const consent = await this.getConsent();
    return consent?.analytics === true;
  }

  async isMarketingAllowed(): Promise<boolean> {
    const consent = await this.getConsent();
    return consent?.marketing === true;
  }

  async revokeConsent(): Promise<void> {
    // TODO: 서버 API 호출
    // await fetch('/api/consent', { method: 'DELETE' });
    throw new Error('Server consent manager not implemented yet');
  }

  async acceptAll(): Promise<void> {
    await this.saveConsent({
      analytics: true,
      marketing: true
    });
  }

  async acceptNecessaryOnly(): Promise<void> {
    await this.saveConsent({
      analytics: false,
      marketing: false
    });
  }
}

// 현재는 쿠키 사용, 나중에 쉽게 변경 가능
export const consentManager: ConsentManager = new CookieConsentManager();

// 서버로 변경하려면 이렇게만 바꾸면 됨:
// export const consentManager: ConsentManager = new ServerConsentManager();

// 편의 함수들 (기존 API 호환성 유지)
export async function getConsentStatus() {
  return await consentManager.getConsent();
}

export async function isAnalyticsAllowed() {
  return await consentManager.isAnalyticsAllowed();
}

export async function isMarketingAllowed() {
  return await consentManager.isMarketingAllowed();
}

export async function hasValidConsent() {
  return await consentManager.hasValidConsent();
}

export async function acceptAllCookies() {
  await consentManager.acceptAll();
}

export async function acceptNecessaryOnly() {
  await consentManager.acceptNecessaryOnly();
}

export async function revokeAllConsent() {
  await consentManager.revokeConsent();
}