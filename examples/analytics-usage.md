# Google Analytics & Tag Manager 사용 가이드

## 환경 설정

`.env.local` 파일에 다음 환경변수를 추가하세요:

```bash
# Google Analytics Measurement ID (GA4)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 기본 사용법

### 이벤트 트래킹

```typescript
import { trackEvent } from '@/lib/utils/analytics';

// 버튼 클릭 이벤트
const handleLoginClick = () => {
  trackEvent('button_click', {
    button_name: 'Login',
    page_path: '/signin'
  });
};

// 페이지 조회 이벤트 (자동으로 처리되지만 수동으로도 가능)
const handlePageView = () => {
  trackEvent('page_view', {
    page_title: 'Home Page',
    page_location: window.location.href
  });
};

// 사용자 정의 이벤트
const handlePurchase = (productId: string, value: number) => {
  trackEvent('purchase', {
    event_category: 'ecommerce',
    event_label: productId,
    value: value
  });
};
```

### 페이지 조회 트래킹

```typescript
import { trackPageView } from '@/lib/utils/analytics';

// Next.js 라우터와 함께 사용
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### 사용자 ID 설정

```typescript
import { setUserId } from '@/lib/utils/analytics';

// 로그인 시 사용자 ID 설정
const handleLogin = async (userId: string) => {
  setUserId(userId);
};
```

### 사용자 속성 설정

```typescript
import { setUserProperties } from '@/lib/utils/analytics';

// 사용자 속성 설정
const setUserSubscription = (subscriptionType: string) => {
  setUserProperties({
    subscription_type: subscriptionType,
    user_role: 'premium'
  });
};
```

## 컴포넌트에서 사용 예시

```typescript
'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/utils/analytics';

export default function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 로그인 시도 이벤트 트래킹
    trackEvent('login_attempt', {
      event_category: 'auth',
      method: 'email'
    });

    // 실제 로그인 로직...
  };

  const handleSignupClick = () => {
    trackEvent('signup_click', {
      event_category: 'conversion',
      event_label: 'login_page'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <button type="submit">로그인</button>
      <button type="button" onClick={handleSignupClick}>
        회원가입
      </button>
    </form>
  );
}
```

## 특징

- ✅ **환경변수 기반**: GTM_ID나 GA_ID가 없으면 자동으로 비활성화
- ✅ **타입 안전**: TypeScript로 완전한 타입 지원
- ✅ **SSR 친화적**: 서버사이드에서 안전하게 동작
- ✅ **테스트 가능**: Jest로 완전한 테스트 커버리지
- ✅ **DX 친화적**: 간단하고 직관적인 API

## 주의사항

1. `NEXT_PUBLIC_GTM_ID`와 `NEXT_PUBLIC_GA_ID` 모두 있으면 GTM이 우선됩니다.
2. 환경변수가 없으면 트래킹 함수들이 아무것도 실행하지 않습니다.
3. 브라우저 환경에서만 동작합니다 (SSR 시 자동으로 스킵).