# Task 004: 블로그 공통 컴포넌트 개발

**상태**: ✅ 완료
**담당**: Claude Code
**날짜**: 2025-12-31
**연관 작업**: Task 003 (더미 데이터 및 Mock 시스템 구축)

---

## 목표

블로그 UI/UX를 위한 재사용 가능한 공통 컴포넌트 5개를 개발합니다.

---

## 구현 내용

### 1. PostCard 컴포넌트 (`components/blog/post-card.tsx`)

**기능**:
- 블로그 글 정보를 카드 형태로 표시
- 커버 이미지 (Next.js Image 최적화)
- 카테고리 뱃지 (이미지 위 오버레이)
- 제목 및 설명 (line-clamp로 2줄 제한)
- 태그 목록 (최대 3개 + "+" 표시)
- 발행일 (date-fns 한국어 포맷)

**기술 스택**:
- CVA variant: `default`, `compact`
- Next.js Link, Image
- shadcn/ui: Card, Badge
- date-fns (한국어 로케일)
- lucide-react 아이콘 (Calendar, Tag)

**Props**:
- `post: BlogPost` - 블로그 글 데이터
- `variant?: 'default' | 'compact'` - 카드 스타일
- `priority?: boolean` - 이미지 우선 로딩 여부

**접근성**:
- alt 텍스트 (커버 이미지)
- aria-label (링크)
- 포커스 스타일 (ring-2)

---

### 2. PostGrid 컴포넌트 (`components/blog/post-grid.tsx`)

**기능**:
- 블로그 글 목록을 반응형 그리드로 표시
- 빈 상태 처리 (FileQuestion 아이콘 + 메시지)

**반응형 레이아웃**:
- 모바일: `grid-cols-1`
- 태블릿: `md:grid-cols-2`
- 데스크톱: `lg:grid-cols-3`
- 간격: `gap-6`

**Props**:
- `posts: BlogPost[]` - 블로그 글 목록
- `emptyMessage?: string` - 빈 상태 메시지
- `prioritizeFirstImage?: boolean` - 첫 번째 카드 이미지 우선 로딩

**접근성**:
- role="status"
- aria-live="polite" (빈 상태)

---

### 3. CategoryFilter 컴포넌트 (`components/blog/category-filter.tsx`)

**기능**:
- "전체" 버튼 + 각 카테고리 버튼
- 선택된 카테고리 하이라이트 (variant="default")
- 카테고리별 글 개수 표시
- 모바일: 가로 스크롤 / 데스크톱: flex-wrap

**Props**:
- `categories: CategoryInfo[]` - 카테고리 목록
- `selectedCategory: string | null` - 선택된 카테고리
- `onCategoryChange: (category: string | null) => void` - 변경 콜백

**접근성**:
- role="group"
- aria-label="카테고리 필터"
- 각 버튼: aria-label
- 글 개수 0일 때: disabled

**클라이언트 컴포넌트**: ✅ 'use client'

---

### 4. SearchBar 컴포넌트 (`components/blog/search-bar.tsx`)

**기능**:
- 검색 아이콘 (좌측)
- 실시간 검색 (디바운스 300ms)
- 클리어 버튼 (우측 X 아이콘, 입력값 있을 때만 표시)

**Props**:
- `value: string` - 검색어
- `onChange: (value: string) => void` - 검색어 변경 콜백 (디바운스 적용)
- `debounceMs?: number` - 디바운스 지연 시간 (기본 300ms)
- `placeholder?: string` - 플레이스홀더 텍스트

**접근성**:
- label (sr-only)
- aria-label="블로그 글 검색"
- 클리어 버튼: aria-label="검색어 지우기"

**클라이언트 컴포넌트**: ✅ 'use client'
**훅 사용**: `useDebounceValue` (usehooks-ts)

---

### 5. Pagination 컴포넌트 (`components/blog/pagination.tsx`)

**기능**:
- 이전/다음 버튼
- 페이지 번호 버튼 (현재 페이지 기준 앞뒤 siblingCount개)
- 첫/마지막 페이지 버튼 (데스크톱만 표시)
- ellipsis (...) 표시 (페이지가 많을 때)
- 현재 페이지 하이라이트 (variant="default")

**Props**:
- `currentPage: number` - 현재 페이지 (1부터 시작)
- `totalPages: number` - 총 페이지 수
- `onPageChange: (page: number) => void` - 페이지 변경 콜백
- `siblingCount?: number` - 표시할 페이지 버튼 개수 (기본 1)

**접근성**:
- role="navigation"
- aria-label="페이지네이션"
- 현재 페이지: aria-current="page"
- 각 버튼: aria-label

**클라이언트 컴포넌트**: ✅ 'use client'

---

## 추가 파일

### 1. 배럴 exports (`components/blog/index.ts`)

모든 컴포넌트와 Props 타입을 중앙에서 export:

```tsx
export { PostCard } from './post-card'
export type { PostCardProps } from './post-card'

export { PostGrid } from './post-grid'
export type { PostGridProps } from './post-grid'

export { CategoryFilter } from './category-filter'
export type { CategoryFilterProps } from './category-filter'

export { SearchBar } from './search-bar'
export type { SearchBarProps } from './search-bar'

export { Pagination } from './pagination'
export type { PaginationProps } from './pagination'
```

### 2. 카테고리 유틸리티 (`lib/utils/categories.ts`)

카테고리 관련 헬퍼 함수:
- `getCategoriesWithCount()` - 카테고리별 글 개수 계산
- `removeCategoryEmoji()` - 이모지 제거
- `categoryToSlug()` - 카테고리 이름 → URL 슬러그
- `slugToCategory()` - URL 슬러그 → 카테고리 이름

### 3. 플레이스홀더 이미지 (`public/images/placeholder-cover.svg`)

커버 이미지가 없는 글을 위한 기본 이미지 (SVG)

### 4. README 문서 (`components/blog/README.md`)

컴포넌트 사용 가이드 및 통합 예시

---

## 홈 페이지 업데이트

`app/(marketing)/page.tsx` 업데이트:

**변경 사항**:
- 기존 플레이스홀더 카드 제거
- 새로운 블로그 컴포넌트 통합
- 클라이언트 컴포넌트로 변경 ('use client')
- 검색, 카테고리 필터링, 페이지네이션 기능 구현

**상태 관리**:
- `selectedCategory: string | null` - 선택된 카테고리
- `searchQuery: string` - 검색어
- `currentPage: number` - 현재 페이지

**필터링 로직**:
1. 카테고리 필터링 (선택된 카테고리 포함)
2. 검색 필터링 (제목, 설명, 태그)
3. 페이지네이션 (6개씩)

**useMemo 최적화**:
- `publishedPosts` - 발행된 글 목록
- `categoriesWithCount` - 카테고리별 글 개수
- `filteredPosts` - 필터링된 글 목록
- `paginatedPosts` - 페이지네이션 적용된 글 목록

---

## 기술 스택

### 프레임워크
- Next.js 16.1.0 (App Router)
- React 19.2.3
- TypeScript 5 (strict 모드)

### UI 라이브러리
- shadcn/ui (Card, Badge, Button, Input)
- Tailwind CSS v4
- CVA (Class Variance Authority) 0.7.1
- lucide-react 0.562.0 (아이콘)

### 유틸리티
- date-fns 4.1.0 (날짜 포맷팅, 한국어 로케일)
- usehooks-ts 3.1.1 (useDebounceValue)
- clsx + tailwind-merge (cn 함수)

---

## 완료 체크리스트

### 컴포넌트 개발
- [x] PostCard 컴포넌트 구현
- [x] PostGrid 컴포넌트 구현
- [x] CategoryFilter 컴포넌트 구현
- [x] SearchBar 컴포넌트 구현
- [x] Pagination 컴포넌트 구현
- [x] 배럴 exports (index.ts)

### 유틸리티
- [x] 카테고리 유틸리티 함수 (lib/utils/categories.ts)
- [x] 플레이스홀더 이미지 생성 (SVG)

### 통합 및 테스트
- [x] 홈 페이지 업데이트 (더미 데이터 연동)
- [x] TypeScript 컴파일 오류 없음
- [x] ESLint 경고 수정
- [x] Next.js 빌드 성공
- [x] 반응형 디자인 적용

### 문서화
- [x] 컴포넌트 README 작성
- [x] JSDoc 주석 작성
- [x] Props 타입 export

### 접근성
- [x] ARIA 레이블 추가
- [x] 키보드 네비게이션 지원
- [x] 포커스 스타일 적용
- [x] 시맨틱 HTML 사용

---

## 빌드 결과

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (5/5)

Route (app)                              Size  First Load JS
┌ ○ /                                  19.8 kB         136 kB
├ ○ /_not-found                          138 B         102 kB
├ ƒ /category/[category]                 138 B         102 kB
└ ƒ /posts/[slug]                        138 B         102 kB
+ First Load JS shared by all           102 kB
```

**번들 사이즈**:
- 홈 페이지: 19.8 kB (gzip 후 약 5-6 kB 예상)
- First Load JS: 136 kB

---

## 다음 단계 (Task 005)

홈 페이지 UI가 완성되었으므로, 다음 작업은:

1. **Task 005: 글 상세 페이지 UI 완성**
   - Article Header 구현
   - Article Content 영역 레이아웃
   - Notion 블록 타입별 컴포넌트 스타일
   - 관련 글 섹션 레이아웃

2. **Task 006: 카테고리 페이지 UI 완성**
   - Category Header 구현
   - 필터링된 글 목록 그리드
   - 빈 상태 UI

---

## 참고 자료

- **PRD**: @docs/PRD.md
- **로드맵**: @docs/ROADMAP.md
- **컴포넌트 가이드**: @components/blog/README.md
- **더미 데이터**: @lib/mock/posts.ts, @lib/mock/categories.ts
- **타입 정의**: @lib/notion/types.ts

---

**완료 일자**: 2025-12-31
**소요 시간**: 약 1-2시간
**코드 라인 수**: 약 600줄
**파일 수**: 9개 (컴포넌트 5개 + 유틸 1개 + exports 1개 + README 1개 + 홈 페이지 1개)
