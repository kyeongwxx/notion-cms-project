/**
 * 더미 데이터 유틸리티 함수
 *
 * 랜덤 데이터 생성, 페이지네이션 등 더미 데이터 조작을 위한 헬퍼 함수를 제공합니다.
 */

import type { BlogPost, CategoryInfo } from '@/lib/notion/types'
import { mockPosts } from './posts'
import { mockCategories } from './categories'

/**
 * 페이지네이션 결과 타입
 */
export interface PaginatedResult<T> {
  /** 현재 페이지 아이템 목록 */
  items: T[]

  /** 전체 페이지 수 */
  totalPages: number

  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number

  /** 다음 페이지 존재 여부 */
  hasNext: boolean

  /** 이전 페이지 존재 여부 */
  hasPrev: boolean

  /** 전체 아이템 개수 */
  totalItems: number
}

// ============================================================================
// 랜덤 데이터 생성
// ============================================================================

/**
 * 랜덤 블로그 글 추출
 *
 * @param count - 추출할 글 개수
 * @returns 랜덤하게 선택된 블로그 글 배열
 *
 * @example
 * ```typescript
 * const randomPosts = getRandomPosts(3)
 * console.log(randomPosts.length) // 3
 * ```
 */
export function getRandomPosts(count: number): BlogPost[] {
  const shuffled = [...mockPosts].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, mockPosts.length))
}

/**
 * 랜덤 카테고리 선택
 *
 * @returns 랜덤하게 선택된 카테고리 정보
 *
 * @example
 * ```typescript
 * const category = getRandomCategory()
 * console.log(category.name) // "🍽️ 맛집" (랜덤)
 * ```
 */
export function getRandomCategory(): CategoryInfo {
  const randomIndex = Math.floor(Math.random() * mockCategories.length)
  return mockCategories[randomIndex] as CategoryInfo
}

/**
 * 랜덤 슬러그 생성
 *
 * @returns UUID 형식의 고유 슬러그
 *
 * @example
 * ```typescript
 * const slug = generateRandomSlug()
 * console.log(slug) // "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * ```
 */
export function generateRandomSlug(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 랜덤 날짜 생성
 *
 * 현재 시점부터 지정된 일수만큼 과거의 랜덤 날짜를 생성합니다.
 *
 * @param daysBack - 과거로 갈 최대 일수
 * @returns ISO 8601 형식의 날짜 문자열
 *
 * @example
 * ```typescript
 * const date = generateRandomDate(30)
 * console.log(date) // "2025-01-05T12:34:56.789Z" (30일 이내 랜덤)
 * ```
 */
export function generateRandomDate(daysBack: number): string {
  const now = Date.now()
  const randomTime = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return new Date(now - randomTime).toISOString()
}

// ============================================================================
// 페이지네이션
// ============================================================================

/**
 * 블로그 글 목록 페이지네이션
 *
 * @param posts - 전체 글 배열
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @param perPage - 페이지당 아이템 개수
 * @returns 페이지네이션된 결과
 *
 * @example
 * ```typescript
 * const result = paginatePosts(allPosts, 1, 6)
 * console.log(result.items.length) // 6
 * console.log(result.totalPages) // 2
 * console.log(result.hasNext) // true
 * ```
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number
): PaginatedResult<BlogPost> {
  const totalItems = posts.length
  const totalPages = Math.ceil(totalItems / perPage)

  // 페이지 번호 유효성 검사 (1부터 시작)
  const currentPage = Math.max(1, Math.min(page, totalPages || 1))

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage

  const items = posts.slice(startIndex, endIndex)

  return {
    items,
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems,
  }
}

/**
 * 카테고리 목록 페이지네이션
 *
 * @param categories - 전체 카테고리 배열
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @param perPage - 페이지당 아이템 개수
 * @returns 페이지네이션된 결과
 *
 * @example
 * ```typescript
 * const result = paginateCategories(allCategories, 1, 10)
 * console.log(result.items.length) // 4 (전체 카테고리 개수)
 * ```
 */
export function paginateCategories(
  categories: CategoryInfo[],
  page: number,
  perPage: number
): PaginatedResult<CategoryInfo> {
  const totalItems = categories.length
  const totalPages = Math.ceil(totalItems / perPage)

  const currentPage = Math.max(1, Math.min(page, totalPages || 1))

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage

  const items = categories.slice(startIndex, endIndex)

  return {
    items,
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems,
  }
}

// ============================================================================
// 통계 및 집계
// ============================================================================

/**
 * 카테고리별 글 개수 업데이트
 *
 * mockCategories의 count 필드를 실제 글 개수로 업데이트합니다.
 *
 * @param posts - 글 목록
 * @param categories - 카테고리 목록
 * @returns 업데이트된 카테고리 목록
 *
 * @example
 * ```typescript
 * const updated = updateCategoryCounts(mockPosts, mockCategories)
 * console.log(updated[0].count) // 3 (맛집 카테고리 글 개수)
 * ```
 */
export function updateCategoryCounts(
  posts: BlogPost[],
  categories: CategoryInfo[]
): CategoryInfo[] {
  return categories.map((category) => ({
    ...category,
    count: posts.filter(
      (post) =>
        post.status === '✅ 발행됨' && post.category.includes(category.name)
    ).length,
  }))
}

/**
 * 모든 태그 추출 및 집계
 *
 * @param posts - 글 목록
 * @returns 태그별 사용 횟수 맵
 *
 * @example
 * ```typescript
 * const tagCounts = getTagCounts(mockPosts)
 * console.log(tagCounts.get('제주도')) // 2
 * ```
 */
export function getTagCounts(posts: BlogPost[]): Map<string, number> {
  const tagCounts = new Map<string, number>()

  posts
    .filter((post) => post.status === '✅ 발행됨')
    .forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      })
    })

  return tagCounts
}

/**
 * 인기 태그 조회
 *
 * @param posts - 글 목록
 * @param limit - 상위 N개 태그
 * @returns 인기 태그 배열 (사용 횟수 내림차순)
 *
 * @example
 * ```typescript
 * const topTags = getPopularTags(mockPosts, 5)
 * console.log(topTags) // [['서울', 3], ['카페', 3], ...]
 * ```
 */
export function getPopularTags(
  posts: BlogPost[],
  limit: number = 10
): Array<[string, number]> {
  const tagCounts = getTagCounts(posts)

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
}

// ============================================================================
// 데이터 검증
// ============================================================================

/**
 * 글 데이터 유효성 검증
 *
 * @param post - 검증할 블로그 글
 * @returns 유효성 검증 결과
 *
 * @example
 * ```typescript
 * const isValid = isValidPost(mockPosts[0])
 * console.log(isValid) // true
 * ```
 */
export function isValidPost(post: BlogPost): boolean {
  return !!(
    post.id &&
    post.title &&
    post.slug &&
    post.status &&
    post.category.length > 0 &&
    post.createdAt &&
    post.updatedAt
  )
}

/**
 * 모든 더미 데이터 유효성 검증
 *
 * @returns 유효성 검증 결과 및 에러 메시지
 *
 * @example
 * ```typescript
 * const result = validateMockData()
 * if (!result.valid) {
 *   console.error(result.errors)
 * }
 * ```
 */
export function validateMockData(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 글 개수 검증
  if (mockPosts.length < 12) {
    errors.push(`글 개수 부족: ${mockPosts.length}개 (최소 12개 필요)`)
  }

  // 각 글 유효성 검증
  mockPosts.forEach((post, index) => {
    if (!isValidPost(post)) {
      errors.push(`글 #${index + 1} (${post.id}) 유효성 검증 실패`)
    }
  })

  // 카테고리별 글 개수 검증
  mockCategories.forEach((category) => {
    const count = mockPosts.filter((post) =>
      post.category.includes(category.name)
    ).length
    if (count < 3) {
      errors.push(
        `${category.name} 카테고리 글 부족: ${count}개 (최소 3개 필요)`
      )
    }
  })

  // 슬러그 중복 검증
  const slugs = new Set<string>()
  mockPosts.forEach((post) => {
    if (slugs.has(post.slug)) {
      errors.push(`슬러그 중복: ${post.slug}`)
    }
    slugs.add(post.slug)
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
