# 정보 구조 문서 (IA): 웹 서비스 보일러플레이트

## 🧩 모듈식 구조와 컴포넌트화 가이드라인

- **모듈식 구조**를 지향하며, 각 도메인(인증, 대시보드, 블로그 등)별로 폴더와 컴포넌트를 분리합니다.
- **비즈니스 로직**은 UI 컴포넌트와 분리하여, hooks, service, store 등 별도 모듈에 작성합니다.
- **컴포넌트 분할**은 Atomic Design(Atoms, Molecules, Organisms, Templates, Pages) 원칙을 참고하여, 재사용성과 유지보수성을 극대화합니다.
- **폴더 구조** 예시:
  - `/components/common` : 공통 UI 컴포넌트
  - `/components/auth` : 인증 관련 컴포넌트
  - `/components/dashboard` : 대시보드 관련 컴포넌트
  - `/hooks`, `/services`, `/stores` : 비즈니스 로직, 상태 관리, API 연동 등
- **상태 관리**는 최대한 상위에서 주입받고, 컴포넌트 내부 상태는 최소화합니다.
- **컴포넌트 문서화**를 위해 Storybook 등 도구를 활용하고, 각 컴포넌트의 props, 예시, 사용법을 문서에 포함합니다.
- **테스트**와 **접근성**을 고려한 설계(유닛 테스트, a11y 등)를 권장합니다.

---

## 📍 Site Map (사이트 맵)

```
- 홈 (/)
- 블로그 (/blog)
  - 블로그 글 상세 (/blog/[slug])
- 대시보드 (/dashboard)
  - 프로필 (/dashboard/profile)
  - 결제 (/dashboard/payment)
  - 이메일 설정 (/dashboard/email)
  - 고객지원 (/dashboard/support)
- 로그인 (/login)
- 회원가입 (/register)
- 비밀번호 재설정 (/reset-password)
- 이메일 확인 (/verify-email)
- 404 페이지 (/not-found)
```

---

## 🔄 User Flow (사용자 흐름)

### 🧑‍💻 신규 사용자 흐름
1. `/register` → 인증 메일 발송 → `/verify-email`
2. 로그인 `/login` → `/dashboard`

### 🔐 인증 후 사용자 흐름
1. `/dashboard` 진입
2. 프로필 정보 설정 (`/dashboard/profile`)
3. 결제 진행 (`/dashboard/payment`)
4. 고객 지원 (`/dashboard/support`)

---

## 🧭 Navigation Structure (탑바 네비게이션 구조)

| 메뉴명 | 링크 | 인증 필요 여부 | 반응형 표시 |
|--------|------|----------------|-------------|
| 블로그 | /blog | ❌ | ✅ |
| 대시보드 | /dashboard | ✅ | ✅ |
| 프로필 | /dashboard/profile | ✅ | ✅ |
| 결제 | /dashboard/payment | ✅ | ✅ |
| 고객지원 | /dashboard/support | ✅ | ✅ |
| 로그인 | /login | ❌ | ✅ |
| 테마 전환 | (버튼) | ❌ | ✅ |
| 언어 선택 | (드롭다운) | ❌ | ✅ |

---

## 🗂 Page Hierarchy (페이지 계층 구조)

- 최상위: 홈, 로그인, 회원가입
- 중간 계층: 블로그, 대시보드
- 하위 계층: 블로그 글 상세, 프로필/결제/지원 등 대시보드 내 기능들

---

## 📦 Content Organization (콘텐츠 조직)

| 구분 | 콘텐츠 구성 요소 |
|------|------------------|
| 블로그 | 마크다운 기반 포스트, OG 이미지, 작성자 정보, 작성일 |
| 프로필 | 이메일, 닉네임, 아바타 이미지 업로드 |
| 결제 | 결제 내역, 결제 진행 버튼, Toss 연동 정보 |
| 고객지원 | 채팅 인터페이스, 문의 양식 (Channel Talk 연동) |
| 이메일 설정 | 이메일 변경, 수신 설정, 인증 재발송 |

---

## 🔁 Interaction Patterns (인터랙션 패턴)

- 테마 전환: 라이트/다크 모드 전환 (쿠키 저장)
- 언어 변경: i18n 쿠키 기반 전환
- 로그인 시 리디렉션: `/login → /dashboard`
- 보호된 페이지 접근 시 미인증 사용자 `/login`으로 리디렉션
- 고객지원 채널은 Channel Talk 위젯으로 제공

---

## 🔗 URL Structure (URL 구조)

| 기능 | URL | 설명 |
|------|-----|------|
| 홈 | / | 메인 랜딩 페이지 |
| 블로그 리스트 | /blog | 마크다운 블로그 리스트 |
| 블로그 상세 | /blog/[slug] | 개별 글 상세 페이지 |
| 로그인 | /login | 이메일/소셜 로그인 |
| 회원가입 | /register | 신규 가입 페이지 |
| 대시보드 | /dashboard | 메인 사용자 허브 |
| 프로필 편집 | /dashboard/profile | 프로필 관리 |
| 결제 | /dashboard/payment | 결제 수행 및 내역 확인 |
| 고객지원 | /dashboard/support | 채팅 및 문의 |
| 이메일 설정 | /dashboard/email | 이메일 관리 |

---

## 🧱 Component Hierarchy (컴포넌트 계층 구조)

```
- Layout
  - Topbar (로고, 메뉴, 테마/언어 전환)
  - Footer (저작권, 링크)
- Auth
  - LoginForm
  - RegisterForm
  - OTP/MagicLink
- Dashboard
  - SidebarNav
  - ProfileForm
  - PaymentWidget
  - EmailSettings
  - SupportForm
- Blog
  - PostList
  - PostItem
  - PostDetail
- Common
  - ThemeToggle
  - LanguageDropdown
  - Notification (Toast)
```

---

## 📱 반응형 고려 사항

- 모바일 기준 320px 이상 대응
- 탑바 메뉴는 햄버거 메뉴로 축소 제공
- 블로그 및 대시보드 레이아웃은 1열로 재구성
- 모든 폼은 모바일 터치 최적화

---

## 🔍 SEO 및 접근성 고려

- 각 페이지에 `title`, `description`, `og:image` 메타태그 포함
- 블로그 글은 구조화된 데이터(markup) 삽입
- 이미지에는 `alt` 텍스트 필수
- 키보드 네비게이션 및 스크린 리더 대응

