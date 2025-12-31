# 블로그 컴포넌트

Notion CMS 기반 개인 블로그를 위한 재사용 가능한 컴포넌트 모음입니다.

## 컴포넌트 목록

### 1. PostCard

블로그 글 정보를 카드 형태로 표시하는 컴포넌트입니다.

**주요 기능:**
- 커버 이미지 (Next.js Image 최적화)
- 카테고리 뱃지
- 제목 및 설명
- 태그 목록 (최대 3개 표시)
- 발행일

**Props:**
- `post: BlogPost` - 블로그 글 데이터
- `variant?: 'default' | 'compact'` - 카드 스타일
- `priority?: boolean` - 이미지 우선 로딩 여부

**사용 예시:**
```tsx
import { PostCard } from '@/components/blog'

<PostCard post={blogPost} priority />
<PostCard post={blogPost} variant="compact" />
```

---

### 2. PostGrid

블로그 글 목록을 반응형 그리드 레이아웃으로 표시합니다.

**주요 기능:**
- 반응형 그리드 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- 빈 상태 처리 (글이 없을 때)
- 첫 번째 이미지 우선 로딩 옵션

**Props:**
- `posts: BlogPost[]` - 블로그 글 목록
- `emptyMessage?: string` - 빈 상태 메시지
- `prioritizeFirstImage?: boolean` - 첫 번째 카드 이미지 우선 로딩

**사용 예시:**
```tsx
import { PostGrid } from '@/components/blog'

<PostGrid
  posts={publishedPosts}
  prioritizeFirstImage
  emptyMessage="검색 결과가 없습니다."
/>
```

---

### 3. CategoryFilter

카테고리별 글 필터링을 위한 버튼 그룹 컴포넌트입니다.

**주요 기능:**
- "전체" 버튼 + 각 카테고리 버튼
- 선택된 카테고리 하이라이트
- 카테고리별 글 개수 표시
- 모바일: 가로 스크롤, 데스크톱: 래핑

**Props:**
- `categories: CategoryInfo[]` - 카테고리 목록
- `selectedCategory: string | null` - 선택된 카테고리 (null이면 "전체")
- `onCategoryChange: (category: string | null) => void` - 카테고리 변경 콜백

**사용 예시:**
```tsx
import { CategoryFilter } from '@/components/blog'

const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

<CategoryFilter
  categories={categoriesWithCount}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

---

### 4. SearchBar

블로그 글 검색을 위한 입력 필드 컴포넌트입니다.

**주요 기능:**
- 검색 아이콘
- 실시간 검색 (디바운스 처리)
- 클리어 버튼 (X 아이콘)
- 접근성 지원 (label, aria-label)

**Props:**
- `value: string` - 검색어
- `onChange: (value: string) => void` - 검색어 변경 콜백 (디바운스 적용됨)
- `debounceMs?: number` - 디바운스 지연 시간 (기본 300ms)
- `placeholder?: string` - 플레이스홀더 텍스트

**사용 예시:**
```tsx
import { SearchBar } from '@/components/blog'

const [searchQuery, setSearchQuery] = useState('')

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="글 제목, 태그로 검색..."
  debounceMs={500}
/>
```

---

### 5. Pagination

페이지 네비게이션을 위한 컴포넌트입니다.

**주요 기능:**
- 이전/다음 버튼
- 페이지 번호 버튼 (현재 페이지 기준 앞뒤 2개씩)
- 현재 페이지 하이라이트
- 첫/마지막 페이지 버튼 (데스크톱만)
- 접근성 지원 (aria-current, aria-label)

**Props:**
- `currentPage: number` - 현재 페이지 (1부터 시작)
- `totalPages: number` - 총 페이지 수
- `onPageChange: (page: number) => void` - 페이지 변경 콜백
- `siblingCount?: number` - 표시할 페이지 버튼 개수 (기본 1)

**사용 예시:**
```tsx
import { Pagination } from '@/components/blog'

const [currentPage, setCurrentPage] = useState(1)
const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  siblingCount={2}
/>
```

---

## 통합 사용 예시

```tsx
'use client'

import { useState, useMemo } from 'react'
import {
  PostGrid,
  CategoryFilter,
  SearchBar,
  Pagination,
} from '@/components/blog'
import { getPublishedPosts } from '@/lib/mock/posts'
import { mockCategories } from '@/lib/mock/categories'
import { getCategoriesWithCount } from '@/lib/utils/categories'

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const publishedPosts = useMemo(() => getPublishedPosts(), [])
  const categoriesWithCount = useMemo(
    () => getCategoriesWithCount(mockCategories, publishedPosts),
    [publishedPosts]
  )

  // 필터링
  const filteredPosts = useMemo(() => {
    let posts = publishedPosts

    if (selectedCategory) {
      posts = posts.filter((post) => post.category.includes(selectedCategory))
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description?.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    }

    return posts
  }, [publishedPosts, selectedCategory, searchQuery])

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilter
        categories={categoriesWithCount}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <PostGrid posts={paginatedPosts} prioritizeFirstImage />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
```

---

## 스타일링

모든 컴포넌트는 Tailwind CSS v4를 사용하며, shadcn/ui의 디자인 시스템을 따릅니다.

**CVA Variant 패턴:**
- PostCard: `default`, `compact`

**반응형 브레이크포인트:**
- 모바일: `< 768px` (grid-cols-1)
- 태블릿: `768px ~ 1024px` (grid-cols-2)
- 데스크톱: `> 1024px` (grid-cols-3)

---

## 접근성

모든 컴포넌트는 WCAG 접근성 표준을 준수합니다:

- **PostCard**: 적절한 alt 텍스트, aria-label, 포커스 스타일
- **CategoryFilter**: role="group", aria-label
- **SearchBar**: label (sr-only), aria-label
- **Pagination**: role="navigation", aria-current, aria-label

---

## 타입 정의

모든 컴포넌트는 TypeScript strict 모드를 준수하며, Props 타입을 export 합니다:

```tsx
import type { PostCardProps, PostGridProps } from '@/components/blog'
```

---

## 의존성

- `next` (Link, Image)
- `react` (useState, useMemo)
- `date-fns` (날짜 포맷팅)
- `lucide-react` (아이콘)
- `usehooks-ts` (useDebounceValue)
- `class-variance-authority` (CVA variant)
- `@/components/ui` (shadcn/ui 컴포넌트)

---

## 개발 가이드

### 새로운 컴포넌트 추가

1. `components/blog/` 디렉토리에 컴포넌트 파일 생성
2. CVA variant 패턴 사용 (필요시)
3. TypeScript Props 인터페이스 정의 및 export
4. JSDoc 주석으로 문서화
5. `components/blog/index.ts`에 export 추가

### 테스트 (Phase 4에서 작성 예정)

```bash
# 단위 테스트
npm run test

# 커버리지
npm run test:coverage
```

---

## 라이센스

이 프로젝트는 개인 블로그 용도로 개발되었습니다.
