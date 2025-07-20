'use client';

import Script from 'next/script';
import { env } from '@/lib/config/env';

export default function Analytics() {
  const hasGTM = env.NEXT_PUBLIC_GTM_ID;
  const hasGA = env.NEXT_PUBLIC_GA_ID;

  if (!hasGTM && !hasGA) {
    return null;
  }

  return (
    <>
      {hasGTM && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GTM_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        </>
      )}
      
      {hasGA && !hasGTM && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}