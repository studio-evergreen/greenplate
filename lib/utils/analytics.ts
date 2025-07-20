import { env } from '@/lib/config/env';

declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      properties?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export interface AnalyticsEventProperties {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

export function trackEvent<T extends string>(
  eventName: T,
  properties?: AnalyticsEventProperties,
): void {
  if (typeof window === 'undefined') return;
  
  // GTM과 GA가 모두 설정된 경우 (권장)
  if (env.NEXT_PUBLIC_GTM_ID && env.NEXT_PUBLIC_GA_ID) {
    // GTM dataLayer에 이벤트 전송
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...properties,
      });
    }
    // gtag을 통해서도 GA에 직접 전송 (백업)
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }
  // GTM만 있는 경우
  else if (env.NEXT_PUBLIC_GTM_ID && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...properties,
    });
  }
  // GA만 있는 경우
  else if (env.NEXT_PUBLIC_GA_ID && window.gtag) {
    window.gtag('event', eventName, properties);
  }
}

export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  
  if (window.gtag && env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}

export function setUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  
  if (window.gtag && env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', env.NEXT_PUBLIC_GA_ID, {
      user_id: userId,
    });
  }
}

export function setUserProperties(properties: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  
  if (window.gtag && env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', env.NEXT_PUBLIC_GA_ID, {
      custom_map: properties,
    });
  }
}

export const analytics = {
  trackEvent,
  trackPageView,
  setUserId,
  setUserProperties,
};