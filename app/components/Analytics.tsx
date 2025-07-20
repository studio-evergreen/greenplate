'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import { env } from '@/lib/config/env';
import { isAnalyticsAllowed } from '@/lib/utils/consent-manager';

export default function Analytics() {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);
  const hasGTM = env.NEXT_PUBLIC_GTM_ID;
  const hasGA = env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    checkAnalyticsConsent();
  }, []);

  const checkAnalyticsConsent = async () => {
    try {
      const allowed = await isAnalyticsAllowed();
      setAnalyticsConsent(allowed);
    } catch (error) {
      console.error('Failed to check analytics consent:', error);
      setAnalyticsConsent(false);
    }
  };

  // 동의 확인 중이거나, 동의하지 않았거나, GTM/GA가 없으면 로드하지 않음
  if (analyticsConsent === null || !analyticsConsent || (!hasGTM && !hasGA)) {
    return null;
  }

  return (
    <>
      {hasGTM && (
        <>
          {/* GTM Head Script */}
          <Script id="gtm-head" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
          
          {/* GA4 초기화 (GTM을 통해) */}
          {hasGA && (
            <Script id="ga-gtm-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          )}
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