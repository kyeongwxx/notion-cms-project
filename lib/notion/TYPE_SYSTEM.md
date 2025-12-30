# Notion CMS 타입 시스템 문서

## 개요

이 문서는 Notion CMS 블로그 프로젝트의 TypeScript 타입 시스템을 설명합니다. 타입 시스템은 5개의 계층으로 구성되어 있으며, Notion API 응답부터 React 컴포넌트까지 전체 애플리케이션의 타입 안전성을 보장합니다.

---

## 타입 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                  Layer 5: Component Props                   │
│                    (types/components.ts)                     │
│         PostCardProps, SearchBarProps, etc.                 │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│              Layer 4: Domain Models (Application)           │
│                   (lib/notion/types.ts)                      │
│            BlogPost, Place, CategoryInfo, TagInfo           │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│           Layer 3: Database Schema Types                    │
│                   (lib/notion/types.ts)                      │
│        PostsDatabaseSchema, PlacesDatabaseSchema            │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│          Layer 2: Notion Property Types                     │
│                   (lib/notion/types.ts)                      │
│   TitleProperty, SelectProperty, MultiSelectProperty, etc.  │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│            Layer 1: Notion API Base Types                   │
│                   (lib/notion/types.ts)                      │
│    PageObjectResponse, BlockObjectResponse, etc.            │
│     (임시 정의 - @notionhq/client 설치 후 교체 예정)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Notion API 기본 타입

### 개요
Notion API의 기본 응답 타입들입니다. 현재는 `@notionhq/client` 패키지 설치 전까지 임시로 정의되어 있으며, Task 009에서 패키지 설치 후 실제 타입으로 교체됩니다.

### 주요 타입

#### `PageObjectResponse`
Notion 페이지 객체의 완전한 응답

```typescript
interface PageObjectResponse {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  cover: { ... } | null
  icon: { ... } | null
  properties: Record<string, any>
  // ...
}
```

#### `NotionBlock`
Notion 블록 (콘텐츠) 응답

```typescript
type NotionBlock = BlockObjectResponse | PartialBlockObjectResponse
```

#### `RichTextItemResponse`
Notion의 Rich Text 형식

```typescript
interface RichTextItemResponse {
  type: 'text' | 'mention' | 'equation'
  text?: { content: string; link?: { url: string } | null }
  annotations: { bold: boolean; italic: boolean; ... }
  plain_text: string
  href: string | null
}
```

---

## Layer 2: Notion 속성 타입

### 개요
Notion 데이터베이스의 각 속성(Property) 타입을 정의합니다. 실제 Notion API 응답의 `properties` 필드에서 사용됩니다.

### 주요 타입

#### `TitleProperty` - 제목
```typescript
interface TitleProperty {
  type: 'title'
  title: RichTextItemResponse[]
  id: string
}
```

#### `SelectProperty` - 단일 선택
```typescript
interface SelectProperty {
  type: 'select'
  select: {
    id: string
    name: string  // 예: "📝 초안", "✅ 발행됨"
    color: string
  } | null
  id: string
}
```

#### `MultiSelectProperty` - 다중 선택
```typescript
interface MultiSelectProperty {
  type: 'multi_select'
  multi_select: Array<{
    id: string
    name: string  // 예: "🍽️ 맛집", "✈️ 여행"
    color: string
  }>
  id: string
}
```

#### `DateProperty` - 날짜
```typescript
interface DateProperty {
  type: 'date'
  date: {
    start: string  // ISO 8601 형식
    end: string | null
    time_zone: string | null
  } | null
  id: string
}
```

#### `RelationProperty` - 관계
```typescript
interface RelationProperty {
  type: 'relation'
  relation: Array<{ id: string }>  // 연결된 페이지 ID 목록
  id: string
  has_more?: boolean
}
```

---

## Layer 3: 데이터베이스 스키마 타입

### 개요
실제 Notion 데이터베이스의 구조를 TypeScript 타입으로 정의합니다. CSV 내보내기 파일 분석을 통해 실제 스키마를 정확히 반영했습니다.

### Posts 데이터베이스

#### `PostsDatabaseSchema`

```typescript
interface PostsDatabaseSchema {
  title: TitleProperty           // 블로그 글 제목
  Places: RelationProperty        // 장소 데이터베이스와의 관계
  category: MultiSelectProperty   // 카테고리 (🍽️ 맛집, 📚 일상 등)
  cover: FilesProperty           // 커버 이미지
  description: RichTextProperty  // 글 요약
  published: DateProperty        // 발행일
  slug: RichTextProperty         // URL 슬러그
  status: SelectProperty         // 상태 (📝 초안, ✅ 발행됨)
  tags: MultiSelectProperty      // 태그
}
```

**실제 데이터 예시:**
```
title: "송도 맛집/호텔 방문"
category: ["🍽️ 맛집", "📚 일상"]
status: "📝 초안"
tags: ["송도", "인천"]
published: "2025년 12월 30일"
slug: "incheon"
```

### Places 데이터베이스

#### `PlacesDatabaseSchema`

```typescript
interface PlacesDatabaseSchema {
  name: TitleProperty            // 장소 이름
  'visited-date': DateProperty   // 방문일
  Posts: RelationProperty        // 포스트와의 관계
  district: RichTextProperty     // 지역
  'naver-maps': URLProperty      // 네이버 지도 링크
  notes: RichTextProperty        // 메모
  rating: NumberProperty         // 평점 (1-5)
  type: SelectProperty           // 타입 (🍽️ 식당, 🏨 숙소)
}
```

**실제 데이터 예시:**
```
name: "동해청명활어회수산"
type: "🍽️ 식당"
district: "송도"
rating: 4
notes: "방어맛집"
visited-date: "2025년 12월 30일"
```

---

## Layer 4: 도메인 모델 타입

### 개요
Notion API 응답을 애플리케이션에서 사용하기 편한 형태로 변환한 타입입니다. 이 계층은 Notion의 복잡한 속성 구조를 숨기고, 깔끔한 인터페이스를 제공합니다.

### `BlogPost` - 블로그 포스트

```typescript
interface BlogPost {
  id: string                    // Notion 페이지 ID
  title: string                 // 글 제목
  slug: string                  // URL 슬러그
  description: string | null    // 글 요약
  category: string[]            // 카테고리 (이모지 포함)
  tags: string[]                // 태그
  status: PostStatus            // "📝 초안" | "✅ 발행됨"
  published: Date | null        // 발행일 (Date 객체로 변환)
  cover: string | null          // 커버 이미지 URL
  places?: Place[]              // 관련 장소 (옵션, populate)
  content?: NotionBlock[]       // 페이지 블록 (옵션, lazy load)
  createdAt: Date               // 생성일
  updatedAt: Date               // 수정일
}
```

**사용 예시:**
```typescript
const post: BlogPost = {
  id: "abc123",
  title: "송도 맛집/호텔 방문",
  slug: "incheon",
  description: "인천송도여행",
  category: ["🍽️ 맛집", "📚 일상"],
  tags: ["송도", "인천"],
  status: "✅ 발행됨",
  published: new Date("2025-12-30"),
  cover: "https://...",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### `Place` - 장소 정보

```typescript
interface Place {
  id: string                    // Notion 페이지 ID
  name: string                  // 장소 이름
  type: PlaceType               // 장소 타입 (이모지 포함)
  district: string | null       // 지역/구역
  naverMaps: string | null      // 네이버 지도 URL
  notes: string | null          // 메모/설명
  rating: number | null         // 평점 (1-5)
  visitedDate: Date | null      // 방문일
  posts?: BlogPost[]            // 관련 포스트 (옵션, populate)
}
```

### `CategoryInfo` - 카테고리 정보

```typescript
interface CategoryInfo {
  name: string      // 카테고리 이름 (이모지 포함)
  color: string     // Notion 색상
  count: number     // 해당 카테고리의 글 개수
}
```

### 유니온 타입

#### `PostStatus`
```typescript
type PostStatus = '📝 초안' | '✅ 발행됨'
```

#### `PlaceType`
```typescript
type PlaceType =
  | '🍽️ 식당'
  | '🏨 숙소'
  | '☕ 카페'
  | '🎨 문화시설'
  | '🌳 공원'
  | '🛍️ 쇼핑'
  | string  // 확장 가능
```

#### `Category`
```typescript
type Category =
  | '🍽️ 맛집'
  | '✈️ 여행'
  | '💻 기술'
  | '📚 일상'
  | '🎨 문화'
  | string  // 확장 가능
```

---

## Layer 5: 컴포넌트 Props 타입

### 개요
React 컴포넌트에서 사용하는 Props 타입들입니다. UI 계층에 특화된 타입 정의를 제공합니다.

### 포스트 관련 컴포넌트

#### `PostCardProps`
블로그 글 카드 컴포넌트

```typescript
interface PostCardProps {
  post: BlogPost
  onClick?: () => void
  variant?: 'default' | 'compact' | 'featured'
  showCover?: boolean
  showDescription?: boolean
  showTags?: boolean
  showPlaces?: boolean
  className?: string
}
```

#### `PostGridProps`
블로그 글 그리드 컴포넌트

```typescript
interface PostGridProps {
  posts: BlogPost[]
  columns?: {
    mobile?: 1 | 2
    tablet?: 2 | 3
    desktop?: 2 | 3 | 4
  }
  cardVariant?: PostCardProps['variant']
  isLoading?: boolean
  className?: string
}
```

### 필터 컴포넌트

#### `CategoryFilterProps`
카테고리 필터링 UI

```typescript
interface CategoryFilterProps {
  categories: CategoryInfo[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  multiSelect?: boolean
  variant?: 'tabs' | 'pills' | 'dropdown' | 'sidebar'
  className?: string
}
```

#### `SearchBarProps`
검색 입력 컴포넌트

```typescript
interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  isLoading?: boolean
  suggestions?: string[]
  debounceMs?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

### 페이지네이션 컴포넌트

#### `PaginationProps`
페이지 네비게이션 UI

```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
  showPrevNext?: boolean
  showFirstLast?: boolean
  className?: string
}
```

---

## API 응답 래퍼 타입

### `NotionDatabaseQueryResponse<T>`
데이터베이스 쿼리 응답을 래핑

```typescript
interface NotionDatabaseQueryResponse<T = BlogPost | Place> {
  results: T[]
  pagination: PaginationInfo
  metadata?: {
    queryTime?: number
    cached?: boolean
  }
}
```

**사용 예시:**
```typescript
// 포스트 목록 조회
const response: NotionDatabaseQueryResponse<BlogPost> = {
  results: [post1, post2, post3],
  pagination: {
    nextCursor: "abc123",
    hasMore: true,
    count: 3
  },
  metadata: {
    queryTime: 250,
    cached: false
  }
}
```

### `NotionPageDetailResponse`
페이지 상세 조회 응답

```typescript
interface NotionPageDetailResponse {
  page: BlogPost | Place
  blocks: NotionBlock[]
  metadata?: {
    blockCount: number
    queryTime?: number
  }
}
```

---

## 쿼리 및 필터 타입

### `PostsFilterOptions`
포스트 필터링 옵션

```typescript
interface PostsFilterOptions {
  category?: string | string[]
  tags?: string | string[]
  status?: PostStatus | PostStatus[]
  publishedRange?: {
    start?: Date
    end?: Date
  }
  search?: string
}
```

### `SortOptions`
정렬 옵션

```typescript
interface SortOptions {
  property: 'published' | 'created_time' | 'last_edited_time' | 'title'
  direction: 'ascending' | 'descending'
}
```

### `NotionQueryOptions`
통합 쿼리 옵션

```typescript
interface NotionQueryOptions {
  filter?: PostsFilterOptions
  sorts?: SortOptions[]
  pagination?: PaginationOptions
}
```

---

## 타입 가드 함수

### `isFullPage()`
페이지가 완전한 응답인지 확인

```typescript
function isFullPage(page: NotionPage): page is PageObjectResponse
```

### `isPostsPage()`
페이지가 Posts 데이터베이스의 페이지인지 확인

```typescript
function isPostsPage(page: PageObjectResponse): page is PostsPageResponse
```

### `isPlacesPage()`
페이지가 Places 데이터베이스의 페이지인지 확인

```typescript
function isPlacesPage(page: PageObjectResponse): page is PlacesPageResponse
```

**사용 예시:**
```typescript
async function getPageData(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId })

  if (!isFullPage(page)) {
    throw new Error('Partial page response')
  }

  if (isPostsPage(page)) {
    // BlogPost로 변환
    return transformPostsPage(page)
  } else if (isPlacesPage(page)) {
    // Place로 변환
    return transformPlacesPage(page)
  }
}
```

---

## 에러 타입

### `NotionAPIError`
Notion API 에러

```typescript
interface NotionAPIError {
  code: string
  message: string
  status: number
  details?: Record<string, unknown>
}
```

### `DataTransformError`
데이터 변환 에러

```typescript
interface DataTransformError {
  type: 'transform_error'
  message: string
  rawData?: unknown
  field?: string
}
```

---

## 타입 사용 가이드

### 1. 타입 임포트 방법

**통합 임포트 (권장):**
```typescript
import type { BlogPost, CategoryInfo, PostCardProps } from '@/types'
```

**개별 임포트:**
```typescript
import type { BlogPost } from '@/lib/notion/types'
import type { PostCardProps } from '@/types/components'
```

### 2. 컴포넌트에서 사용

```typescript
import type { PostCardProps } from '@/types'

export function PostCard({
  post,
  variant = 'default',
  showCover = true,
  className
}: PostCardProps) {
  return (
    <div className={cn('post-card', className)}>
      {showCover && post.cover && (
        <img src={post.cover} alt={post.title} />
      )}
      <h2>{post.title}</h2>
      <p>{post.description}</p>
    </div>
  )
}
```

### 3. API 함수에서 사용

```typescript
import type {
  BlogPost,
  NotionQueryOptions,
  NotionDatabaseQueryResponse
} from '@/types'

export async function getPublishedPosts(
  options?: NotionQueryOptions
): Promise<NotionDatabaseQueryResponse<BlogPost>> {
  // Notion API 호출 로직
  const response = await notion.databases.query({
    database_id: process.env.POSTS_DATABASE_ID!,
    // ...
  })

  return {
    results: response.results.map(transformPost),
    pagination: {
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
      count: response.results.length
    }
  }
}
```

### 4. 타입 가드 활용

```typescript
import { isPostsPage, isPlacesPage } from '@/types'

async function getPageType(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId })

  if (!isFullPage(page)) return 'partial'

  if (isPostsPage(page)) return 'post'
  if (isPlacesPage(page)) return 'place'

  return 'unknown'
}
```

---

## 다음 단계 (Task 009)

1. **@notionhq/client 설치**
   ```bash
   npm install @notionhq/client
   ```

2. **타입 임포트 교체**
   `lib/notion/types.ts` 파일 상단의 주석 처리된 임포트를 활성화:
   ```typescript
   import type {
     PageObjectResponse,
     PartialPageObjectResponse,
     DatabaseObjectResponse,
     PartialDatabaseObjectResponse,
     BlockObjectResponse,
     PartialBlockObjectResponse,
   } from '@notionhq/client/build/src/api-endpoints'
   ```

3. **임시 타입 정의 제거**
   Layer 1의 임시 인터페이스 정의를 삭제하고, @notionhq/client의 실제 타입 사용

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-12-30 | 초기 타입 시스템 구축 (Task 002) |

---

**작성자:** Claude Code
**마지막 업데이트:** 2025-12-30
**관련 Task:** Task 002 - TypeScript 타입 및 인터페이스 정의
