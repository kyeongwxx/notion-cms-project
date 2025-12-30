# Mock 데이터 사용 가이드

Task 003에서 생성된 더미 데이터 모듈입니다. Phase 2 (Task 004~008) UI 개발에서 사용하며, Phase 3에서 실제 Notion API로 교체됩니다.

## 파일 구조

```
lib/mock/
├── index.ts           # 통합 export (이 파일만 import하면 됩니다)
├── categories.ts      # 카테고리 더미 데이터 (4개)
├── posts.ts          # 블로그 글 더미 데이터 (12개)
├── utils.ts          # 유틸리티 함수 (페이지네이션, 검색 등)
├── __tests__/
│   └── validate.test.ts  # 데이터 유효성 검증 테스트
└── README.md         # 이 파일
```

## 빠른 시작

### 1. 기본 사용법

```typescript
import { mockPosts, getPublishedPosts, paginatePosts } from '@/lib/mock'

// 발행된 글 목록 (최신순)
const posts = getPublishedPosts()
console.log(posts.length) // 12

// 페이지네이션
const result = paginatePosts(posts, 1, 6)
console.log(result.items.length) // 6
console.log(result.totalPages) // 2
console.log(result.hasNext) // true
```

### 2. 카테고리 필터링

```typescript
import { getPostsByCategory, mockCategories } from '@/lib/mock'

// "🍽️ 맛집" 카테고리 글만 조회
const foodPosts = getPostsByCategory('🍽️ 맛집')
console.log(foodPosts.length) // 3

// 모든 카테고리 목록
console.log(mockCategories)
// [
//   { name: '🍽️ 맛집', color: 'red', count: 0 },
//   { name: '✈️ 여행', color: 'blue', count: 0 },
//   { name: '💻 기술', color: 'green', count: 0 },
//   { name: '📚 일상', color: 'yellow', count: 0 },
// ]
```

### 3. 검색

```typescript
import { searchPosts } from '@/lib/mock'

// 제목, 설명, 태그에서 검색
const results = searchPosts('제주')
console.log(results.length) // 2

// 검색어가 없으면 전체 글 반환
const allPosts = searchPosts('')
console.log(allPosts.length) // 12
```

### 4. 슬러그로 글 조회

```typescript
import { getPostBySlug } from '@/lib/mock'

const post = getPostBySlug('seoul-seongsu-restaurants')
console.log(post?.title) // "서울 성수동 맛집 베스트 5"
console.log(post?.category) // ['🍽️ 맛집']
console.log(post?.tags) // ['서울', '성수동', '카페', '브런치', '레스토랑']
```

### 5. 태그 필터링

```typescript
import { getPostsByTag, getPopularTags } from '@/lib/mock'

// 특정 태그 포함 글
const cafePosts = getPostsByTag('카페')
console.log(cafePosts.length) // 3

// 인기 태그 Top 5
const topTags = getPopularTags(mockPosts, 5)
console.log(topTags)
// [
//   ['서울', 3],
//   ['카페', 3],
//   ['제주도', 2],
//   ...
// ]
```

## React 컴포넌트 예시

### 홈 페이지 (글 목록)

```typescript
// app/(marketing)/page.tsx
import { getPublishedPosts, paginatePosts } from '@/lib/mock'

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page, 10)

  const allPosts = getPublishedPosts()
  const { items, totalPages, hasNext, hasPrev } = paginatePosts(
    allPosts,
    currentPage,
    6 // 페이지당 6개
  )

  return (
    <div>
      <h1>블로그</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </div>
  )
}
```

### 카테고리 페이지

```typescript
// app/category/[category]/page.tsx
import { getPostsByCategory } from '@/lib/mock'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categoryName = decodeURIComponent(category) // "맛집" → "🍽️ 맛집"

  const posts = getPostsByCategory(`🍽️ ${categoryName}`)

  return (
    <div>
      <h1>{categoryName} 카테고리</h1>
      <p>{posts.length}개의 글</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

### 검색 결과

```typescript
// app/search/page.tsx
'use client'

import { searchPosts } from '@/lib/mock'
import { useState, useEffect } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogPost[]>([])

  useEffect(() => {
    const filtered = searchPosts(query)
    setResults(filtered)
  }, [query])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <p>{results.length}개의 결과</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

## 데이터 구조

### BlogPost

```typescript
interface BlogPost {
  id: string // "post-001"
  title: string // "서울 성수동 맛집 베스트 5"
  slug: string // "seoul-seongsu-restaurants"
  description: string | null // "힙한 성수동에서 꼭 가봐야 할..."
  category: string[] // ['🍽️ 맛집']
  tags: string[] // ['서울', '성수동', '카페', ...]
  status: PostStatus // '✅ 발행됨'
  published: Date | null
  cover: string | null // "https://images.unsplash.com/..."
  createdAt: Date
  updatedAt: Date
}
```

### CategoryInfo

```typescript
interface CategoryInfo {
  name: string // "🍽️ 맛집"
  color: string // "red"
  count: number // 카테고리 글 개수
}
```

## 유틸리티 함수

### 페이지네이션

```typescript
paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number
): PaginatedResult<BlogPost>

// 반환 타입
interface PaginatedResult<T> {
  items: T[]
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  totalItems: number
}
```

### 통계 및 집계

```typescript
// 카테고리별 글 개수 업데이트
updateCategoryCounts(posts: BlogPost[], categories: CategoryInfo[]): CategoryInfo[]

// 태그 사용 횟수 집계
getTagCounts(posts: BlogPost[]): Map<string, number>

// 인기 태그 Top N
getPopularTags(posts: BlogPost[], limit: number): Array<[string, number]>
```

### 데이터 검증

```typescript
// 단일 글 유효성 검증
isValidPost(post: BlogPost): boolean

// 전체 더미 데이터 검증
validateMockData(): { valid: boolean; errors: string[] }
```

## 테스트

```bash
# 더미 데이터 유효성 검증 테스트
npm run test -- lib/mock/__tests__/validate.test.ts
```

**검증 항목:**
- ✅ 최소 12개의 샘플 글
- ✅ 모든 글이 발행됨 상태
- ✅ 각 카테고리마다 최소 3개의 글
- ✅ 모든 글이 필수 필드 포함
- ✅ 모든 글이 2~5개의 태그
- ✅ 슬러그 중복 없음
- ✅ 모든 글에 커버 이미지 (Unsplash)
- ✅ 발행일이 최근 3개월 이내
- ✅ 설명이 50~200자
- ✅ validateMockData() 통과
- ✅ 카테고리 개수 업데이트 정확성
- ✅ 발행일 기준 정렬 정확성

## 다음 단계

**Task 004~008 (Phase 2 UI 개발):**
1. **Task 004**: BlogPost 컴포넌트 개발 (PostCard, PostGrid, CategoryFilter, SearchBar)
2. **Task 005**: 홈 페이지 UI 완성
3. **Task 006**: 글 상세 페이지 UI 완성
4. **Task 007**: 카테고리 페이지 UI 완성
5. **Task 008**: 검색 결과 페이지 UI 완성

**Phase 3 (Notion API 연동):**
- Task 009: Notion API 환경 설정
- Task 010: Notion API 클라이언트 구현
- lib/mock 함수들을 lib/notion 함수로 교체

## 주의사항

1. **경로 별칭**: 항상 `@/lib/mock` 사용
2. **불변성**: 원본 데이터 변경 금지 (spread operator 사용)
3. **타입 안전성**: 모든 함수에 타입 명시
4. **Phase 3 교체**: Notion API 연동 시 import 경로만 변경하면 됨

---

**생성일**: 2025-12-31
**작성자**: Claude Code (Task 003)
**버전**: 1.0
