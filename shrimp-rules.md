# AI 에이전트 개발 표준

> **목적**: 이 문서는 Notion CMS 블로그 프로젝트에서 작업하는 AI 에이전트를 위한 운영 규칙을 제공합니다.
> **초점**: 일반적인 개발 지식이 아닌, 프로젝트별 구현 패턴에 집중합니다.

---

## 1. 컴포넌트 개발 규칙

### 1.1 컴포넌트 생성 패턴 (필수)

**모든 컴포넌트는 반드시 이 패턴을 따라야 합니다:**

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. CVA를 사용하여 variant 정의
const componentVariants = cva(
  "base-classes-here", // 기본 스타일
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. variants 함수 내보내기
export { componentVariants };

// 3. Props 인터페이스 정의
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean; // 선택사항: Radix UI Slot 패턴용
}

// 4. forwardRef를 사용한 컴포넌트 구현
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";
```

### 1.2 Import 규칙

**✅ 올바른 예시:**

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";
```

**❌ 잘못된 예시:**

```typescript
import { Button } from "../components/ui/button"; // 상대 경로 사용 금지
import { Button } from "./button"; // 상대 경로 사용 금지
```

**규칙**: 반드시 `@/` 경로 별칭을 사용하세요. 상대 경로 (`../`, `./`)는 절대 사용하지 마세요.

### 1.3 서버 vs 클라이언트 컴포넌트

**기본값: 서버 컴포넌트**

**✅ 서버 컴포넌트 사용 (기본값):**

- 정적 콘텐츠 렌더링
- 데이터 페칭
- 사용자 상호작용 없음
- 브라우저 API 미사용

**✅ "use client"는 다음 경우에만 추가:**

- React hooks: `useState`, `useEffect`, `useContext`
- 이벤트 핸들러: `onClick`, `onChange`, `onSubmit`
- 브라우저 API: `window`, `document`, `localStorage`
- 서드파티 hooks: `useTheme`, `useRouter` (from next/navigation)

**의사결정 트리 예시:**

```
컴포넌트가 hooks나 이벤트를 사용하나요?
├─ 아니오  → 서버 컴포넌트 (기본값)
└─ 예 → "use client" 지시어 추가
```

---

## 2. 파일 구조 규칙

### 2.1 컴포넌트 파일 위치

**반드시 올바른 디렉토리에 파일을 배치하세요:**

| 컴포넌트 유형          | 위치                 | 예시                             |
| ---------------------- | -------------------- | -------------------------------- |
| 기본 UI 컴포넌트       | `components/ui/`     | `button.tsx`, `card.tsx`         |
| 레이아웃 컴포넌트      | `components/layout/` | `header.tsx`, `footer.tsx`       |
| 테마 컴포넌트          | `components/theme/`  | `theme-toggle.tsx`               |
| 블로그 전용 (Phase 3+) | `components/blog/`   | `post-card.tsx`, `post-grid.tsx` |

### 2.2 테스트 파일 위치

**반드시 `__tests__/` 하위 디렉토리에 테스트 파일 생성:**

```
components/
├── ui/
│   ├── button.tsx
│   └── __tests__/
│       └── button.test.tsx
├── layout/
│   ├── header.tsx
│   └── __tests__/
│       └── header.test.tsx
```

**명명 규칙**: `component-name.test.tsx` (NOT `ComponentName.test.tsx`)

### 2.3 Notion API 파일 (Phase 1+)

**반드시 이 순서대로 생성:**

1. `lib/notion/types.ts` - TypeScript 인터페이스
2. `lib/notion/client.ts` - API 클라이언트 및 함수
3. `lib/notion/renderer.tsx` - 블록 렌더링 컴포넌트
4. `lib/mock/` - 더미 데이터 (Phase 2)

---

## 3. 다중 파일 연계 규칙

### 3.1 중요 의존성

**X를 수정할 때, 반드시 Y도 함께 업데이트해야 합니다:**

| 작업                  | 필수 업데이트                                     |
| --------------------- | ------------------------------------------------- |
| 새 UI 컴포넌트 추가   | → `__tests__/`에 테스트 파일 생성                 |
| 라우트 추가/수정      | → `lib/constants.ts` (mainNav) 업데이트           |
| CSS 변수 변경         | → `globals.css`의 `:root`와 `.dark` 모두 업데이트 |
| 새 페이지 라우트 추가 | → `page.tsx`, `loading.tsx`, `error.tsx` 생성     |
| 컴포넌트 variant 수정 | → 모든 variant 테스트 업데이트                    |
| 사이트 설정 추가      | → `lib/constants.ts` (siteConfig) 업데이트        |

### 3.2 설정 관리

**다음 항목은 반드시 `lib/constants.ts`에서 관리:**

- 사이트 메타데이터 (title, description, author)
- 네비게이션 메뉴 항목
- 소셜 링크
- 여러 곳에서 사용되는 모든 값

**하드코딩 금지**: constants에 속하는 값을 직접 코드에 작성하지 마세요.

---

## 4. Next.js App Router 규칙

### 4.1 라우트 구조

**Route Groups (괄호는 URL에 영향을 주지 않음):**

```
app/
├── (marketing)/          # URL: /
│   ├── layout.tsx        # 블로그 페이지용 레이아웃
│   ├── page.tsx          # 홈페이지 (/)
```

**동적 라우트:**

```
app/
├── posts/
│   └── [slug]/
│       ├── page.tsx      # /posts/hello-world
│       ├── loading.tsx   # 로딩 UI
│       └── error.tsx     # 에러 UI
```

### 4.2 각 라우트에 필요한 파일

**새 라우트마다 반드시 이 3개 파일 생성:**

1. `page.tsx` - 메인 페이지 컴포넌트
2. `loading.tsx` - 로딩 스켈레톤 UI
3. `error.tsx` - 에러 바운더리 UI

### 4.3 ISR 설정 (Phase 3+)

**Notion 데이터를 사용하는 블로그 페이지:**

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 60; // 60초마다 재검증

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  return <article>{/* ... */}</article>;
}
```

### 4.4 메타데이터 (SEO)

**반드시 generateMetadata() 사용, 레거시 Head 사용 금지:**

```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: "페이지 제목",
    description: "페이지 설명",
    openGraph: {
      title: "페이지 제목",
      description: "페이지 설명",
      images: ["/og-image.jpg"],
    },
  };
}
```

---

## 5. 스타일링 시스템 규칙

### 5.1 Tailwind CSS v4 + CSS 변수

**반드시 `app/globals.css`의 CSS 변수 사용:**

**사용 가능한 색상 변수:**

- `--color-primary`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-foreground`
- `--color-destructive`, `--color-destructive-foreground`
- `--color-accent`, `--color-accent-foreground`
- `--color-muted`, `--color-muted-foreground`
- `--color-card`, `--color-card-foreground`
- `--color-background`, `--color-foreground`
- `--color-border`, `--color-input`, `--color-ring`

**Border Radius 변수:**

- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl`

### 5.2 새 CSS 변수 추가

**반드시 `:root`와 `.dark` 선택자 모두 업데이트:**

```css
@theme {
  /* 라이트 모드 */
  --color-custom: oklch(0.6 0.2 250);
}

.dark {
  /* 다크 모드 - 반드시 다크 variant 제공 */
  --color-custom: oklch(0.7 0.2 250);
}
```

**❌ 금지**: 직접 hex 색상 (`#000000`), RGB 색상. OKLCh 색공간을 사용하세요.

### 5.3 조건부 클래스 병합

**반드시 `cn()` 유틸리티 사용:**

```typescript
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    variant === "primary" && "primary-class",
    className
  )}
/>;
```

---

## 6. 테스트 요구사항

### 6.1 테스트 파일 구조

**반드시 다음 테스트 카테고리 포함:**

```typescript
import { render, screen, userEvent } from "@/lib/test-utils";
import { Component } from "@/components/ui/component";

describe("Component", () => {
  describe("렌더링", () => {
    it("기본 props로 렌더링", () => {
      // 기본 렌더링 테스트
    });
  });

  describe("Variants", () => {
    it("모든 variant 스타일 렌더링", () => {
      // CVA variants 테스트
    });
  });

  describe("상호작용", () => {
    it("사용자 이벤트 처리", async () => {
      // click, change, submit 이벤트 테스트
    });
  });

  describe("접근성", () => {
    it("접근성 위반 없음", async () => {
      const { container } = render(<Component />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### 6.2 CVA Variant 테스트

**반드시 헬퍼를 사용하여 모든 variants 테스트:**

```typescript
import { testAllVariants } from "@/lib/test-utils";

const variants = ["default", "destructive", "outline"] as const;
testAllVariants(Component, "variant", variants, { children: "Test" });
```

### 6.3 커버리지 임계값

**반드시 다음 최소값 충족:**

- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

**커버리지 실행:** `npm run test:coverage`

### 6.4 테스트 체크리스트

**코드 커밋 전:**

- [ ] `__tests__/` 디렉토리에 테스트 파일 생성
- [ ] 모든 CVA variants 테스트
- [ ] jest-axe로 접근성 테스트
- [ ] userEvent로 사용자 상호작용 테스트
- [ ] 커버리지 임계값 충족
- [ ] 테스트 통과: `npm run test:run`

---

## 7. Notion API 연동 (Phase 1+)

### 7.1 환경 변수

**반드시 두 파일 모두 생성:**

1. `.env.local` (절대 git에 커밋하지 마세요):

```bash
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx
```

2. `.env.example` (git에 커밋):

```bash
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

**반드시 사용 전 검증:**

```typescript
if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}
```

### 7.2 API 에러 처리

**반드시 재시도 로직이 포함된 try-catch 구현:**

```typescript
export async function getPublishedPosts() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Status",
        select: { equals: "발행됨" },
      },
    });
    return response.results;
  } catch (error) {
    console.error("Notion API error:", error);
    // 재시도 로직 구현 또는 fallback 반환
    throw new Error("Failed to fetch posts from Notion");
  }
}
```

### 7.3 타입 정의

**반드시 `lib/notion/types.ts`에 타입 정의:**

```typescript
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  published: string;
  description?: string;
  coverImage?: string;
}

export interface NotionPageResponse {
  // Notion API 응답 구조 미러링
}
```

---

## 8. 개발 워크플로우 규칙

### 8.1 코드 읽기 규칙

**❌ 금지**: 기존 코드를 읽지 않고 변경 제안.

**✅ 필수**: 수정을 제안하기 전에 반드시 관련 파일을 읽으세요.

**예시 워크플로우:**

1. 기존 컴포넌트/파일 읽기
2. 현재 패턴 이해
3. 기존 스타일과 일치하는 변경사항 제안
4. 변경사항 구현
5. 테스트 생성
6. 테스트 실행

### 8.2 작업 추적

**반드시 다단계 작업(3단계 이상)에는 TodoWrite 사용:**

```typescript
// 예시: 새 블로그 컴포넌트 추가
TodoWrite([
  { content: "PostCard 컴포넌트 생성", status: "in_progress" },
  { content: "PostCard 테스트 생성", status: "pending" },
  { content: "PostGrid에 PostCard 추가", status: "pending" },
  { content: "Storybook 업데이트", status: "pending" },
]);
```

### 8.3 Git 커밋 워크플로우

**반드시 `/commit` 명령어 사용**하여 일관된 커밋 메시지 작성:

**형식**: `<이모지> <타입>: <설명>`

**주요 타입:**

- ✨ `feat`: 새 기능
- 🐛 `fix`: 버그 수정
- 📝 `docs`: 문서화
- ♻️ `refactor`: 코드 리팩토링
- ✅ `test`: 테스트 추가/수정
- 💄 `style`: UI/스타일 변경

### 8.4 코드 리뷰

**다음 경우 반드시 code-reviewer 에이전트 호출:**

- 중요한 기능 구현 후
- 복잡한 리팩토링
- API 연동
- 최종 커밋 전

---

## 9. 금지 사항

### 9.1 Import 규칙

❌ **절대 상대 경로 import 사용 금지:**

```typescript
import { Button } from "../ui/button"; // 잘못됨
import { Button } from "./button"; // 잘못됨
```

✅ **반드시 @/ 별칭 사용:**

```typescript
import { Button } from "@/components/ui/button"; // 올바름
```

### 9.2 컴포넌트 규칙

❌ **금지 사항:**

- CVA variants 없이 컴포넌트 생성 (여러 스타일이 존재할 때)
- "use client" 분석 건너뛰기 (항상 명시적으로 결정)
- 인라인 스타일 또는 커스텀 CSS 사용
- 불필요한 "use client" 지시어 추가
- 테스트 없이 컴포넌트 생성

### 9.3 설정 규칙

❌ **금지 사항:**

- 네비게이션 항목 하드코딩 (`lib/constants.ts` 사용)
- 사이트 메타데이터 하드코딩 (`lib/constants.ts` 사용)
- `.env.local` 또는 API 키 커밋
- hex/RGB 색상 사용 (CSS 변수 + OKLCh 사용)

### 9.4 과잉 엔지니어링

❌ **금지 사항:**

- 명시적으로 요청되지 않은 기능 추가
- 일회성 코드를 위한 추상화 생성
- 하위 호환성 핵 추가 (`_unusedVar`, `// removed`)
- 일회성 작업을 위한 헬퍼 생성
- 가상의 미래 요구사항을 위한 설계

✅ **해야 할 것:**

- 솔루션을 단순하고 집중적으로 유지
- 요청된 변경사항만 구현
- 사용하지 않는 코드 완전히 삭제
- 내부 코드 보증 신뢰

### 9.5 테스트 규칙

❌ **금지 사항:**

- 새 컴포넌트에 대한 테스트 생성 건너뛰기
- 접근성 테스트 건너뛰기
- CVA 컴포넌트에 대한 variant 테스트 건너뛰기
- 실패하는 테스트와 함께 커밋

---

## 10. 의사결정 트리

### 10.1 "use client" 결정

```
컴포넌트에 필요한 것은:
├─ React hooks (useState, useEffect 등)? → 예 → "use client"
├─ 이벤트 핸들러 (onClick, onChange)? → 예 → "use client"
├─ 브라우저 API (window, localStorage)? → 예 → "use client"
├─ 서드파티 hooks (useTheme, useRouter)? → 예 → "use client"
└─ 위의 어느 것도 아님? → 아니오 → 서버 컴포넌트 (기본값)
```

### 10.2 컴포넌트 배치

```
어떤 유형의 컴포넌트인가요?
├─ 기본 UI (Button, Card, Input)? → components/ui/
├─ 레이아웃 (Header, Footer, Container)? → components/layout/
├─ 테마 (ThemeToggle, ThemeProvider)? → components/theme/
└─ 블로그 전용 (PostCard, PostGrid)? → components/blog/
```

### 10.3 설정 vs 하드코드

```
이 값이 여러 곳에서 사용되나요?
├─ 예 → lib/constants.ts에 추가
└─ 아니오 → 인라인 가능 (하지만 향후 재사용 고려)

사이트 전역 설정인가요?
└─ 예 → 반드시 lib/constants.ts에 있어야 함
```

### 10.4 서버 vs 클라이언트 데이터 페칭

```
데이터를 어디서 가져올까요?
├─ 정적 콘텐츠 (블로그 글)? → 서버 컴포넌트 + ISR
├─ 사용자별 데이터? → 클라이언트 컴포넌트 + useEffect
└─ 검색/필터? → 클라이언트 컴포넌트 (미리 페칭한 데이터 필터링)
```

---

## 11. Phase별 규칙

### Phase 1: Notion API 설정

**파일 생성 순서:**

1. `lib/notion/types.ts` - 인터페이스 정의
2. `.env.local` + `.env.example` - 환경 설정
3. `lib/notion/client.ts` - API 클라이언트 초기화
4. 유틸리티 함수 (getPublishedPosts 등)

**반드시 검증:**

- API 호출 전 환경 변수 검증
- API 응답이 TypeScript 타입과 일치
- 모든 API 호출에 대한 에러 처리

### Phase 2: 더미 데이터를 사용한 UI

**반드시:**

- `lib/mock/` 디렉토리에 모크 데이터 생성
- 모크 데이터가 Phase 1 TypeScript 인터페이스와 일치하는지 확인
- Phase 3 통합 전까지 더미 데이터 사용

**예시:**

```typescript
// lib/mock/posts.ts
import type { BlogPost } from "@/lib/notion/types";

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Sample Post",
    slug: "sample-post",
    // ... BlogPost 인터페이스와 정확히 일치
  },
];
```

### Phase 3: Notion API 통합

**반드시:**

1. 모크 import를 실제 API 호출로 교체
2. ISR 설정 추가: `export const revalidate = 60`
3. API 실패에 대한 에러 바운더리 구현
4. Playwright MCP로 E2E 검증 테스트

**데이터 플로우:**

```
Notion Database → Notion API → lib/notion/client.ts →
Server Component (ISR) → React Component → User Browser
```

---

## 12. 코드 예시

### 12.1 완전한 컴포넌트 예시

```typescript
// components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

### 12.2 완전한 테스트 예시

```typescript
// components/ui/__tests__/badge.test.tsx
import { render, screen } from "@/lib/test-utils";
import { Badge } from "@/components/ui/badge";
import { axe } from "jest-axe";

describe("Badge", () => {
  it("children과 함께 렌더링", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("variant 스타일 적용", () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-primary");

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive");
  });

  it("접근성 위반 없음", async () => {
    const { container } = render(<Badge>Accessible</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 12.3 ISR을 사용한 서버 컴포넌트

```typescript
// app/posts/[slug]/page.tsx
import { getPostBySlug } from "@/lib/notion/client";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR: 60초마다 재검증

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {/* ... */}
    </article>
  );
}
```

---

## 13. 빠른 참조 체크리스트

### 컴포넌트 생성 전:

- [ ] 서버 또는 클라이언트 컴포넌트 결정
- [ ] 배치할 기존 컴포넌트 계층 구조 확인
- [ ] CVA variants 계획 (여러 스타일이 필요한 경우)
- [ ] @/ imports만 사용

### 컴포넌트 생성 후:

- [ ] `__tests__/` 디렉토리에 테스트 파일 생성
- [ ] 모든 CVA variants 테스트
- [ ] jest-axe로 접근성 테스트
- [ ] 커버리지 임계값 충족
- [ ] 컴포넌트 export (해당되는 경우)

### 페이지 생성 전:

- [ ] `page.tsx` 생성
- [ ] `loading.tsx` 생성
- [ ] `error.tsx` 생성
- [ ] `lib/constants.ts`의 네비게이션에 추가 (필요한 경우)
- [ ] SEO를 위한 generateMetadata() 구현

### 커밋 전:

- [ ] 변경하기 전에 기존 코드 읽기
- [ ] 테스트 통과: `npm run test:run`
- [ ] TypeScript 오류 없음: `npm run build`
- [ ] 커밋 메시지에 `/commit` 명령어 사용
- [ ] code-reviewer 에이전트 호출 (중요한 변경사항의 경우)

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-12-30
**대상**: Notion CMS 블로그 프로젝트에서 작업하는 AI 에이전트
