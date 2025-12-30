# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 1. 프로젝트 개요

Next.js 16과 React 19를 기반으로 한 **Notion CMS 개인 블로그** 프로젝트입니다. Notion을 Headless CMS로 활용하여 맛집, 여행, 기술 등 다양한 주제의 블로그 콘텐츠를 관리합니다. TypeScript strict 모드, Tailwind CSS v4, shadcn/ui 컴포넌트를 사용하며 다크 모드와 접근성을 지원합니다.

**주요 기술 스택:**
- Next.js 16.1.0 (App Router) + React 19.2.3
- TypeScript 5 (strict 모드)
- Tailwind CSS v4 + shadcn/ui
- Vitest 3.2.4 + React Testing Library
- @notionhq/client (Notion API - Phase 1에서 추가 예정)
- next-themes (다크 모드)

**프로젝트 구조 (주요 디렉토리):**
```
notion-cms-project/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 블로그 페이지 Route Group
│   │   ├── page.tsx              # 홈 (블로그 글 목록)
│   │   └── layout.tsx            # 블로그 레이아웃
│   ├── layout.tsx                # 루트 레이아웃
│   └── globals.css               # Tailwind v4 전역 스타일
│
├── components/                   # React 컴포넌트
│   ├── ui/                       # 기본 UI (shadcn/ui)
│   ├── layout/                   # 레이아웃 컴포넌트
│   └── theme/                    # 테마 관리
│
├── lib/                          # 유틸리티 함수
│   ├── utils.ts                  # cn() 함수
│   ├── constants.ts              # 사이트 설정
│   └── test-utils.tsx            # 테스트 헬퍼
│
├── docs/                         # 프로젝트 문서
│   └── PRD.md                    # 프로젝트 요구사항 정의서
│
├── .claude/                      # Claude Code 통합
│   ├── agents/                   # 커스텀 에이전트
│   ├── commands/                 # 커스텀 명령어
│   └── hooks/                    # 생명주기 훅
│
├── vitest.config.mts             # Vitest 설정
├── vitest.setup.tsx              # 테스트 초기화
└── components.json               # shadcn/ui 설정
```

---

## 2. 빠른 시작

### 개발 서버 실행
```bash
npm run dev              # http://localhost:3000
```

### 테스트 실행
```bash
npm run test             # 감시 모드
npm run test:ui          # UI 대시보드
npm run test:watch       # 파일 변경 감지
npm run test:run         # 한 번만 실행
npm run test:coverage    # 커버리지 리포트
```

### 빌드 및 배포
```bash
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버
npm run lint             # ESLint 검사
```

---

## 3. 아키텍처

### 3.1 프로젝트 구조

**app/ (Next.js App Router)**
- `app/layout.tsx` - 루트 레이아웃 (ThemeProvider 적용)
- `app/globals.css` - Tailwind v4 전역 스타일 및 CSS 변수
- `app/(marketing)/` - 블로그 페이지 Route Group (괄호는 URL에 포함되지 않음)
  - `page.tsx` - 홈 페이지 (블로그 글 목록 플레이스홀더)
  - `layout.tsx` - Header와 Footer를 포함한 블로그 레이아웃

**lib/ (유틸리티)**
- `lib/utils.ts` - `cn()` 함수 (clsx + tailwind-merge)
- `lib/constants.ts` - `siteConfig`, `mainNav` 등 중앙 집중식 설정
- `lib/test-utils.tsx` - 테스트 헬퍼 함수
  - `renderWithProviders()` - Provider 래핑 렌더링
  - `testAllVariants()` - CVA variant 자동 테스트
  - `fillAndSubmitForm()` - 폼 상호작용 헬퍼

**기타 설정 파일**
- `components.json` - shadcn/ui 설정 (style: "new-york", baseColor: "neutral")
- `vitest.config.mts` - Vitest 테스트 설정
- `vitest.setup.tsx` - 테스트 환경 초기화 및 모킹

### 3.2 라우팅 시스템 (App Router)

Next.js 16 App Router를 사용하며, Route Groups를 활용하여 레이아웃을 분리합니다.

**Route Groups 패턴:**
- `(marketing)` - 블로그 페이지 그룹 (Header + Footer 레이아웃)
- 괄호는 URL에 포함되지 않음 (예: `/` 는 `/(marketing)/page.tsx`에 매핑)

**주요 라우트 (현재):**
- `/` - 홈페이지 (블로그 글 목록 플레이스홀더)

**계획된 라우트 (Phase 4 구현 예정):**
- `/posts/[slug]` - 글 상세 페이지
- `/category/[category]` - 카테고리별 글 목록

### 3.3 컴포넌트 계층

```
components/
├── ui/                           # 기본 UI 컴포넌트 (shadcn/ui 스타일)
│   ├── button.tsx                # CVA를 사용한 variant 패턴
│   ├── card.tsx                  # Card, CardHeader, CardTitle 등 합성 컴포넌트
│   ├── badge.tsx                 # 뱃지 컴포넌트
│   ├── separator.tsx             # 구분선
│   ├── sheet.tsx                 # 모바일 드로어/모달
│   ├── input.tsx                 # 폼 입력 필드
│   └── textarea.tsx              # 여러 줄 텍스트 입력
│
├── layout/                       # 레이아웃 컴포넌트
│   ├── header.tsx                # "use client" - 네비게이션 및 테마 토글
│   ├── footer.tsx                # 푸터 영역
│   ├── container.tsx             # size variants (sm, md, lg, xl, full)
│   ├── section.tsx               # spacing variants, 테마 variant
│   └── mobile-nav.tsx            # "use client" - Sheet 기반 모바일 네비게이션
│
└── theme/                        # 테마 관리
    ├── theme-provider.tsx        # next-themes 래퍼
    └── theme-toggle.tsx          # "use client" - 다크/라이트 모드 토글
```

**Phase 3에서 추가 예정:**
- `components/blog/` - 블로그 특화 컴포넌트
  - `post-card.tsx` - 블로그 글 카드
  - `post-grid.tsx` - 글 목록 그리드
  - `category-filter.tsx` - 카테고리 필터
  - `search-bar.tsx` - 검색창
```

---

## 4. 개발 워크플로우

### 4.1 일반적인 개발 흐름

권장하는 개발 프로세스:

1. **기능 구현**
   - CVA variant 패턴 사용
   - @/ 경로 별칭 사용
   - 서버 컴포넌트 우선, 필요시에만 "use client" 추가

2. **테스트 작성** (test-specialist 에이전트 활용 가능)
   - `components/**/__tests__/**/*.test.tsx`에 테스트 파일 생성
   - CVA variant 모두 테스트
   - 접근성 테스트 포함 (jest-axe)
   - 커버리지 80% 목표

3. **코드 리뷰** (code-reviewer 에이전트 호출)
   - 아키텍처 패턴 준수 확인
   - TypeScript 타입 안전성 검토
   - 접근성 및 성능 최적화

4. **커밋** (`/commit` 명령어 사용)
   - 이모지 + 컨벤셔널 커밋 형식 자동 생성
   - 분할 커밋 제안 (필요시)

5. **세션 종료**
   - notify.sh 훅이 자동으로 알림 발송
   - 토큰 사용량, 도구 통계, 파일 변경 통계 표시

### 4.2 컴포넌트 추가 시

- **위치:** 기존 계층 구조를 따라 적절한 디렉토리에 배치 (ui/layout/marketing/theme)
- **패턴:** CVA를 사용해 variant 기반으로 설계
- **경로:** 항상 `@/` prefix 사용 (예: `@/components/ui/button`)
- **타입:** 서버 컴포넌트 우선, 상호작용 필요 시에만 `"use client"` 추가

**CVA Variant 패턴 예시:**
```typescript
import { cva } from "class-variance-authority"

const componentVariants = cva("base-styles", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
})
```

### 4.3 페이지 추가 시

- **Route Group 선택:** `(marketing)` 내에 추가하거나 새로운 route group 생성
- **메타데이터:** 적절한 title, description 설정
- **SEO:** Open Graph 이미지, 키워드 최적화
- **접근성:** 적절한 heading 계층 (h1 → h2 → h3)

---

## 5. 테스트 설정

### 5.1 테스트 프레임워크

**Vitest 3.2.4**
- 환경: jsdom (브라우저 DOM 에뮬레이션)
- 커버리지 제공자: V8
- 전역 변수 활성화 (expect 임포트 불필요)
- 멀티스레드 실행 (성능 최적화)

**React Testing Library 16.3.1**
- 사용자 동작 기반 테스팅
- @testing-library/jest-dom 6.9.1 (DOM 매처)
- @testing-library/user-event 14.6.1 (사용자 이벤트)

**접근성 테스트**
- jest-axe 9.0.0 (WCAG 규칙 자동 검사)

### 5.2 테스트 실행

```bash
npm run test              # 감시 모드 (파일 변경 시 자동 재실행)
npm run test:ui           # UI 대시보드로 테스트 보기
npm run test:watch        # 감시 모드 (명시적)
npm run test:run          # 한 번만 실행 (CI 환경)
npm run test:coverage     # 커버리지 리포트 생성 (HTML, JSON, LCOV)
```

### 5.3 테스트 구조

**파일 위치:**
- `components/**/__tests__/**/*.test.tsx`
- `components/**/__tests__/**/*.spec.tsx`

**커버리지 목표:**
- 라인: 80%
- 함수: 80%
- 분기: 75%
- 스테이트먼트: 80%

**Vitest 설정 파일:** `vitest.config.mts`
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    globals: true,
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 }
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') }
  }
})
```

### 5.4 테스트 유틸리티 (lib/test-utils.tsx)

**renderWithProviders()**
- Provider와 함께 컴포넌트를 렌더링하는 헬퍼
- ThemeProvider, Router 등의 컨텍스트 자동 래핑

**testAllVariants()**
- CVA 컴포넌트의 모든 variant를 자동으로 테스트
- 예시:
```typescript
const variants = ['default', 'destructive', 'outline'] as const
testAllVariants(Button, 'variant', variants, { children: 'Click' })
```

**fillAndSubmitForm()**
- 폼 작성 및 제출을 간편하게 처리
- 예시:
```typescript
const user = userEvent.setup()
await fillAndSubmitForm(user, {
  '이름': '홍길동',
  '이메일': 'test@example.com'
})
```

### 5.5 모킹 설정 (vitest.setup.tsx)

다음 모듈들이 자동으로 모킹됩니다:

**next-themes**
```typescript
useTheme: () => ({ theme: 'light', setTheme: vi.fn(), ... })
```

**next/navigation**
```typescript
useRouter: () => ({ push: vi.fn(), replace: vi.fn(), ... })
usePathname: () => '/'
useSearchParams: () => new URLSearchParams()
```

**lucide-react**
- 모든 아이콘이 `<svg data-testid="icon-name" />`로 모킹
- 스냅샷 테스트 최적화

**브라우저 API**
- `IntersectionObserver` (지연 로딩 테스트)
- `window.matchMedia` (반응형 쿼리 테스트)

### 5.6 기존 테스트

**Button 컴포넌트 (`components/ui/__tests__/button.test.tsx`)**
- 48개 테스트 케이스
- 테스트 영역:
  - 기본 렌더링 (2개)
  - Variant 테스트 (5개: default, destructive, outline, secondary, ghost, link)
  - Size 테스트 (4개: default, sm, lg, icon)
  - Variant + Size 조합 (3개)
  - 클릭 이벤트 (4개)
  - forwardRef (3개)
  - className 병합 (3개)
  - HTML 속성 전달 (6개)
  - 접근성 (4개)
  - buttonVariants 함수 (5개)
  - 엣지 케이스 (5개)
  - 폼 제출 (3개)

**테스트 예시:**
```typescript
import { render, screen, userEvent } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 6. 기술 스택 및 패턴

### 6.1 핵심 프레임워크

- **Next.js 16.1.0** - App Router 사용
- **React 19.2.3** - 최신 React 버전
- **TypeScript 5** - strict 모드 활성화

### 6.2 스타일링

- **Tailwind CSS v4** - @theme 구문과 CSS 변수 기반
- **CVA (Class Variance Authority) 0.7.1** - 타입 안전 variant 패턴
- **clsx + tailwind-merge** - 조건부 className 병합
- **tw-animate-css 1.4.0** - 애니메이션 유틸리티 (globals.css에서 import)

### 6.3 UI 라이브러리

- **shadcn/ui** - 접근 가능한 unstyled 컴포넌트 라이브러리
  - 스타일: "new-york"
  - 기본 색상: "neutral"
- **lucide-react 0.562.0** - 아이콘 라이브러리
- **next-themes 0.4.6** - 다크 모드 관리

### 6.4 CMS 및 데이터 (Phase 1에서 추가 예정)

- **@notionhq/client** - Notion API 클라이언트
- **react-notion-x** (선택 사항) - Notion 블록 렌더링

### 6.5 테스팅

- **vitest 3.2.4** - 테스트 프레임워크
- **@vitejs/plugin-react 4.7.0** - Vitest React 지원
- **@testing-library/react 16.3.1** - React 컴포넌트 테스팅
- **@testing-library/jest-dom 6.9.1** - DOM 매처
- **@testing-library/user-event 14.6.1** - 사용자 이벤트 시뮬레이션
- **@vitest/coverage-v8 3.2.4** - 커버리지 측정
- **jest-axe 9.0.0** - 접근성 테스팅
- **jsdom 25.0.1** - 브라우저 DOM 에뮬레이션

### 6.6 주요 아키텍처 패턴

1. **서버 컴포넌트 우선**
   - 기본적으로 서버 컴포넌트 사용
   - 상호작용이 필요한 경우에만 `"use client"` 추가
   - 예: Header, MobileNav, ThemeToggle

2. **Route Groups**
   - 괄호 `(groupname)`를 사용해 레이아웃 분리
   - URL에 영향 없음

3. **CVA Variant 패턴**
   - prop 조합 대신 variant 기반 컴포넌트 설계
   - 타입 안전성 보장

4. **Path Aliases**
   - 상대 경로 대신 `@/`를 항상 사용
   - 예: `@/components/ui/button`, `@/lib/utils`

5. **중앙 집중식 설정**
   - 네비게이션 및 사이트 설정은 `lib/constants.ts`에서 관리
   - `siteConfig`, `mainNav` 등

---

## 7. 스타일링 시스템

### 7.1 CSS 변수 기반 테마

`app/globals.css`에서 `:root`와 `.dark` 선택자로 CSS 변수 정의:

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@theme {
  --color-primary: oklch(0.6 0.2 250);
  --color-primary-foreground: oklch(1 0 0);
  --color-secondary: oklch(0.9 0.02 250);
  /* ... */

  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  /* ... */
}

.dark {
  --color-primary: oklch(0.7 0.2 250);
  /* ... */
}
```

**주요 특징:**
- **OKLCh 색공간** - 지각적으로 균일한 색상
- **의미론적 색상 이름** - primary, secondary, destructive, accent, muted 등
- **반응형 border-radius** - sm, md, lg, xl, 2xl, 3xl, 4xl

### 7.2 CVA 사용 예시

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

---

## 8. Claude Code 통합

이 프로젝트는 Claude Code와 긴밀하게 통합되어 있습니다. `.claude/` 디렉토리에서 커스텀 에이전트, 명령어, 훅을 관리합니다.

### 8.1 커스텀 에이전트

#### code-reviewer 에이전트
**용도:** 코드 구현 후 자동으로 전문적인 리뷰 수행

**모델:** claude-3-5-sonnet
**색상:** 초록색

**핵심 책임:**
- 아키텍처 패턴 준수 확인 (서버 컴포넌트, @/ 경로 별칭, CVA 패턴)
- TypeScript strict 모드 타입 안전성 검토
- React 19 및 Next.js 16 패턴 준수
- Tailwind CSS v4 및 CSS 변수 스타일링 검증
- WCAG 접근성 준수 확인
- 성능 최적화 검토
- 한국어 현지화 확인

**리뷰 레벨:**
- 🔴 **필수 (Critical):** 보안 취약점, 접근성 위반, 브레이킹 체인지
- 🟡 **중요 (Important):** 모범 사례 위반, 성능 문제
- 🔵 **제안 (Suggestion):** 스타일 개선, 코드 최적화

**호출 시점:** 기능 구현이나 버그 수정 완료 후

#### test-specialist 에이전트
**용도:** 테스트 코드 생성, 검토 및 개선

**모델:** claude-3-5-sonnet
**색상:** 파란색

**핵심 책임:**
- 단위/통합/컴포넌트 테스트 작성
- 정상 경로, 엣지 케이스, 오류 시나리오 테스트
- React Testing Library 활용
- 폼 검증 테스트 (react-hook-form + zod)
- 접근성 테스트 (axe-core, jest-axe)
- CVA variant 테스트
- Next.js 특화 테스팅 (서버 컴포넌트, App Router)

**테스팅 도구:**
- Vitest + jsdom
- React Testing Library
- Testing Library Jest-DOM
- MSW (API 모킹)
- Playwright (E2E, 필요시)

**호출 시점:** 새로운 컴포넌트나 기능 추가 시, 테스트 커버리지 검토 시

### 8.2 커스텀 명령어

#### /commit 명령어
**용도:** 이모지 + 컨벤셔널 커밋 형식으로 고품질 커밋 메시지 자동 생성

**형식:**
```
<이모지> <타입>: <설명>
```

**주요 타입:**
- ✨ `feat`: 새로운 기능
- 🐛 `fix`: 버그 수정
- 📝 `docs`: 문서 변경
- 💄 `style`: 코드 포맷팅
- ♻️ `refactor`: 리팩토링
- ⚡ `perf`: 성능 개선
- ✅ `test`: 테스트 추가/수정
- 🔧 `chore`: 빌드/도구 변경

**특징:**
- 스테이지된 파일 자동 분석
- diff 기반 변경사항 이해
- 필요시 분할 커밋 제안
- 55개 이상의 특정 상황별 이모지 지원

**사용 예시:**
```
✨ feat: Add dark mode toggle to header component
```

### 8.3 Hooks

#### notify.sh (Stop Hook)
**용도:** Claude Code 세션 종료 시 macOS 알림으로 통계 표시

**알림 정보:**
- 📊 토큰 사용량 (입력/출력 토큰, 캐시 읽기)
- 💰 세션 비용 (있는 경우)
- 🔧 도구 사용 통계 (Read, Edit, Write, Bash, Grep, Glob, Task)
- 📝 파일 변경 개수 (Edit/Write 도구로 변경된 파일)

**기술:**
- macOS `osascript`를 사용한 네이티브 알림
- `jq` 사용 시: JSON 파싱으로 정확한 분석
- `jq` 미설치 시: grep/sed로 기본 통계 제공
- 성능 최적화: 최근 200줄만 분석
- 안전 장치: 무한 루프 방지 (`stop_hook_active` 체크)

**예시 알림:**
```
📊 토큰: 1,234 입력 / 5,678 출력 (캐시: 2,000)
💰 비용: $0.15
🔧 도구: Read(5), Edit(3), Bash(2)
📝 변경: 3개 파일
```

**권한 설정:** `.claude/settings.local.json`에서 타임아웃 5초로 설정

### 8.4 MCP 서버

프로젝트는 3개의 MCP(Model Context Protocol) 서버를 사용합니다 (`.mcp.json` 설정):

#### playwright (stdio)
- **용도:** 브라우저 자동화 및 E2E 테스팅
- **활용:** 웹페이지 스크린샷, 상호작용 테스트, 네트워크 분석

#### context7 (http)
- **용도:** 라이브러리 문서 검색 및 API 참조
- **활용:** 최신 라이브러리 문서 검색, 코드 예제 조회

#### sequential-thinking (stdio)
- **용도:** 복잡한 문제 해결을 위한 단계적 사고
- **활용:** 복잡한 아키텍처 결정, 디버깅, 문제 분석

### 8.5 권장 워크플로우

1. **기능 구현**
   - CVA variant 패턴 사용
   - @/ 경로 별칭 사용
   - 서버 컴포넌트 우선

2. **커밋** - `/commit` 명령어 실행
   - 이모지 + 컨벤셔널 형식 자동 생성

3. **코드 리뷰** - code-reviewer 에이전트 호출
   - 아키텍처 패턴 검증
   - 타입 안전성 검토
   - 접근성 및 성능 확인

4. **필요시 개선**
   - 리뷰 피드백 반영
   - 추가 커밋

5. **테스트 작성** - test-specialist 에이전트 활용
   - 포괄적인 테스트 스위트 생성
   - CVA variant 모두 테스트
   - 접근성 테스트 포함

6. **테스트 실행 및 커버리지 검증**
   ```bash
   npm run test:coverage
   ```

7. **세션 종료**
   - notify.sh 훅이 자동으로 통계 알림 발송

---

## 9. TypeScript 설정

**tsconfig.json 주요 설정:**

- **strict: true** - 전체 타입 안전성 활성화
- **moduleResolution: "bundler"** - Next.js 16 모듈 해석
- **paths: { "@/*": ["./*"] }** - 경로 별칭
- **target: ES2017** - 적절한 브라우저 호환성

**테스트 관련 타입:**
```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/__tests__/**/*",
    "vitest.setup.ts"
  ]
}
```

---

## 10. 로컬라이제이션

- 현재 UI 언어: **한국어 (KO)**
- HTML lang 속성: `lang="ko"` (app/layout.tsx)
- 모든 콘텐츠, 네비게이션, 메타데이터가 한국어로 작성됨
- i18n 라이브러리는 현재 미사용 (정적 한국어 콘텐츠)

---

## 11. 확장 가이드

이 템플릿은 다음과 같은 확장을 쉽게 지원하도록 설계되었습니다:

**새로운 라우트 그룹 추가**
- 예: `(dashboard)`, `(auth)`
- 각 그룹에 독립적인 레이아웃 적용 가능

**데이터베이스 통합**
- API 라우트 활용 (`app/api/`)
- Prisma, Drizzle 등의 ORM 통합

**인증 시스템 구현**
- NextAuth.js, Clerk, Supabase Auth 등
- `(auth)` route group 생성

**관리자 대시보드**
- `(dashboard)` route group
- 별도 레이아웃 및 네비게이션

**E-commerce 기능**
- 상품 목록, 장바구니, 결제
- Stripe, PayPal 등 결제 통합

**커스텀 훅 추가**
- `hooks/` 디렉토리에 추가
- 예: `useMediaQuery`, `useLocalStorage`

**새 테스트 작성**
- test-specialist 에이전트 활용
- `__tests__` 디렉토리에 테스트 파일 생성
- CVA variant, 접근성, 폼 검증 테스트 포함

---

## 12. 개발 시 주의사항

### 일반 개발

1. **컴포넌트 추가 시**
   - 기존 컴포넌트 계층 구조를 따라 적절한 디렉토리에 배치 (ui/layout/marketing/theme)
   - CVA를 사용해 variant 기반으로 설계

2. **새 페이지 추가 시**
   - `(marketing)` 그룹 내에 추가하거나 새로운 route group 생성
   - 메타데이터 및 SEO 설정 추가

3. **스타일 수정 시**
   - CSS 변수를 활용하고 Tailwind utility 클래스 사용
   - 커스텀 CSS는 최소화

4. **클라이언트 인터랙션**
   - 필요한 경우에만 `"use client"` 지시어 추가
   - 서버 컴포넌트 우선 사용

5. **경로 참조 시**
   - 항상 `@/` prefix 사용 (예: `@/components/ui/button`)
   - 상대 경로 (`../`, `./`) 사용 지양

6. **설정 변경 시**
   - `lib/constants.ts`에서 siteConfig와 mainNav 수정

### 테스트 작성 시

1. **CVA variant 테스트**
   - 모든 variant 조합을 테스트
   - `testAllVariants()` 헬퍼 활용

2. **접근성 테스트**
   - jest-axe로 자동 접근성 검사
   - 키보드 네비게이션 테스트
   - 적절한 aria-label 확인

3. **폼 검증 시나리오**
   - 정상 케이스, 에러 케이스 모두 커버
   - `fillAndSubmitForm()` 헬퍼 활용

4. **커버리지 목표**
   - 80% 이상 유지 (라인/함수/스테이트먼트)
   - 75% 이상 유지 (분기)

### Claude Code 활용 팁

1. **복잡한 구현 전**
   - code-reviewer 에이전트와 상담하여 접근 방법 검증
   - 아키텍처 패턴 확인

2. **테스트 작성**
   - test-specialist 에이전트에게 위임 고려
   - 포괄적인 테스트 스위트 자동 생성

3. **커밋 메시지**
   - `/commit` 명령어로 일관된 형식 유지
   - 분할 커밋 제안 활용

4. **세션 통계**
   - notify.sh 훅으로 토큰 사용량 모니터링
   - 비용 최적화 인사이트

---

## 13. 성능 및 접근성

### 접근성 (WCAG 준수)

- 시맨틱 HTML 사용 (적절한 heading 계층)
- 키보드 네비게이션 지원
- aria-label, aria-describedby 제공
- 색상 대비 4.5:1 이상 유지
- **jest-axe로 자동 접근성 테스트** (테스트 시 포함)

### 성능 최적화

- Next.js 16 기본 최적화 활용
  - 자동 코드 스플리팅
  - 이미지 최적화 (next/image)
  - 폰트 최적화 (next/font)
- Core Web Vitals 모니터링 (ESLint 설정)
- 서버 컴포넌트로 초기 로드 시간 단축
- 클라이언트 컴포넌트 최소화

### SEO

- 메타데이터 API 활용
- Open Graph 이미지 설정
- 적절한 title, description
- 구조화된 데이터 (JSON-LD)
- Sitemap 및 robots.txt 설정 (Phase 6)

---

## 11. 구현 로드맵

### ✅ Phase 0: 프로젝트 초기화 (완료)
- [x] 마케팅 관련 페이지 제거 (about, contact, feature)
- [x] 마케팅 컴포넌트 제거 (HeroSection, CtaSection, FeatureCard, FeatureGrid, ContactForm)
- [x] Auth 디렉토리 제거
- [x] 블로그 구조로 변경
- [x] lib/constants.ts 블로그 설정 업데이트
- [x] 홈 페이지를 블로그 글 목록 플레이스홀더로 변경
- [x] 문서 업데이트 (README.md, CLAUDE.md)

### 🚧 Phase 1: 환경 설정 (다음 단계)
- [ ] Notion API 패키지 설치 (`@notionhq/client`)
- [ ] Notion 데이터베이스 생성 및 샘플 데이터 입력
- [ ] Notion API 키 발급 및 환경 변수 설정 (`.env.local`)
- [ ] `.env.example` 파일 생성

### 📅 Phase 2: API 연동 (예정)
- [ ] `lib/notion/` 디렉토리 생성
- [ ] Notion API 클라이언트 초기화 (`lib/notion/client.ts`)
- [ ] 글 목록 조회 함수 구현 (`getPublishedPosts()`)
- [ ] 글 상세 조회 함수 구현 (`getPostBySlug()`)
- [ ] 카테고리 목록 조회 함수 구현 (`getCategories()`)
- [ ] API 응답 데이터 TypeScript 타입 정의 (`lib/notion/types.ts`)

### 📅 Phase 3: UI 컴포넌트 개발 (예정)
- [ ] `components/blog/` 디렉토리 생성
- [ ] 글 카드 컴포넌트 (`PostCard`)
- [ ] 글 목록 그리드 컴포넌트 (`PostGrid`)
- [ ] 카테고리 필터 컴포넌트 (`CategoryFilter`)
- [ ] 검색창 컴포넌트 (`SearchBar`)
- [ ] 각 컴포넌트 테스트 작성

### 📅 Phase 4: 페이지 구현 (예정)
- [ ] 홈 페이지 실제 Notion 데이터 연동 (`app/(marketing)/page.tsx`)
- [ ] 글 상세 페이지 (`app/posts/[slug]/page.tsx`)
- [ ] 카테고리 페이지 (`app/category/[category]/page.tsx`)
- [ ] Notion 블록 렌더링 (react-notion-x 또는 직접 구현)
- [ ] 메타데이터 및 SEO 최적화
