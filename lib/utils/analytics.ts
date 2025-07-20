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
  
  if (window.gtag && (env.NEXT_PUBLIC_GA_ID || env.NEXT_PUBLIC_GTM_ID)) {
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