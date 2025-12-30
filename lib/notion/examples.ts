/**
 * 타입 사용 예시
 *
 * 이 파일은 타입 시스템의 올바른 사용법을 보여주는 예시입니다.
 * 실제 구현 시 참고하세요.
 */

import type {
  BlogPost,
  Place,
  CategoryInfo,
  PostsFilterOptions,
  NotionDatabaseQueryResponse,
  PostStatus,
  PlaceType,
} from '@/types'

// ============================================================================
// 예시 1: BlogPost 도메인 모델 사용
// ============================================================================

/**
 * 더미 블로그 포스트 생성
 */
export function createDummyPost(): BlogPost {
  return {
    id: 'abc123',
    title: '송도 맛집/호텔 방문',
    slug: 'incheon-seongsu-trip',
    description: '인천 송도 지역의 맛집과 호텔을 소개합니다.',
    category: ['🍽️ 맛집', '📚 일상'],
    tags: ['송도', '인천', '여행'],
    status: '✅ 발행됨',
    published: new Date('2025-12-30'),
    cover: 'https://example.com/cover.jpg',
    createdAt: new Date('2025-12-29'),
    updatedAt: new Date('2025-12-30'),
  }
}

/**
 * 포스트 상태 확인
 */
export function isPublished(post: BlogPost): boolean {
  return post.status === '✅ 발행됨'
}

/**
 * 포스트 필터링
 */
export function filterPostsByCategory(
  posts: BlogPost[],
  category: string
): BlogPost[] {
  return posts.filter((post) => post.category.includes(category))
}

// ============================================================================
// 예시 2: Place 도메인 모델 사용
// ============================================================================

/**
 * 더미 장소 생성
 */
export function createDummyPlace(): Place {
  return {
    id: 'def456',
    name: '동해청명활어회수산',
    type: '🍽️ 식당',
    district: '송도',
    naverMaps: 'https://naver.me/53l4s0SD',
    notes: '방어맛집',
    rating: 4,
    visitedDate: new Date('2025-12-30'),
  }
}

/**
 * 평점별 장소 필터링
 */
export function filterPlacesByRating(
  places: Place[],
  minRating: number
): Place[] {
  return places.filter((place) => place.rating !== null && place.rating >= minRating)
}

/**
 * 장소 타입별 필터링
 */
export function filterPlacesByType(
  places: Place[],
  type: PlaceType
): Place[] {
  return places.filter((place) => place.type === type)
}

// ============================================================================
// 예시 3: 타입 안전한 API 응답 처리
// ============================================================================

/**
 * 블로그 포스트 목록 조회 (더미)
 */
export async function getPublishedPosts(
  filter?: PostsFilterOptions
): Promise<NotionDatabaseQueryResponse<BlogPost>> {
  // TODO: 실제 Notion API 호출 (Task 010에서 구현)
  const allPosts = [createDummyPost()]

  // 필터 적용
  let filteredPosts = allPosts

  if (filter?.status) {
    const statuses = Array.isArray(filter.status)
      ? filter.status
      : [filter.status]
    filteredPosts = filteredPosts.filter((post) =>
      statuses.includes(post.status)
    )
  }

  if (filter?.category) {
    const categories = Array.isArray(filter.category)
      ? filter.category
      : [filter.category]
    filteredPosts = filteredPosts.filter((post) =>
      categories.some((cat) => post.category.includes(cat))
    )
  }

  if (filter?.search) {
    const query = filter.search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
    )
  }

  return {
    results: filteredPosts,
    pagination: {
      nextCursor: null,
      hasMore: false,
      count: filteredPosts.length,
    },
    metadata: {
      queryTime: 50,
      cached: false,
    },
  }
}

/**
 * 카테고리 목록 조회 (더미)
 */
export async function getCategories(): Promise<CategoryInfo[]> {
  // TODO: 실제 Notion API에서 카테고리 추출 (Task 010에서 구현)
  return [
    { name: '🍽️ 맛집', color: 'red', count: 5 },
    { name: '✈️ 여행', color: 'blue', count: 3 },
    { name: '💻 기술', color: 'green', count: 2 },
    { name: '📚 일상', color: 'yellow', count: 8 },
  ]
}

// ============================================================================
// 예시 4: 타입 가드 활용
// ============================================================================

/**
 * 포스트 상태 타입 가드
 */
export function isValidPostStatus(value: string): value is PostStatus {
  return value === '📝 초안' || value === '✅ 발행됨'
}

/**
 * 장소 타입 타입 가드
 */
export function isValidPlaceType(value: string): value is PlaceType {
  const validTypes: PlaceType[] = [
    '🍽️ 식당',
    '🏨 숙소',
    '☕ 카페',
    '🎨 문화시설',
    '🌳 공원',
    '🛍️ 쇼핑',
  ]
  return validTypes.includes(value as PlaceType)
}

/**
 * 안전한 포스트 상태 파싱
 */
export function parsePostStatus(value: string): PostStatus {
  if (isValidPostStatus(value)) {
    return value
  }
  throw new Error(`Invalid post status: ${value}`)
}

// ============================================================================
// 예시 5: 유틸리티 함수
// ============================================================================

/**
 * 포스트를 slug로 찾기
 */
export function findPostBySlug(
  posts: BlogPost[],
  slug: string
): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}

/**
 * 최신 포스트 가져오기
 */
export function getRecentPosts(posts: BlogPost[], limit: number): BlogPost[] {
  return posts
    .filter((post) => post.published !== null)
    .sort((a, b) => {
      if (!a.published || !b.published) return 0
      return b.published.getTime() - a.published.getTime()
    })
    .slice(0, limit)
}

/**
 * 관련 포스트 찾기 (태그 기반)
 */
export function findRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  return allPosts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) =>
      post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .slice(0, limit)
}

/**
 * 카테고리별 포스트 개수 계산
 */
export function countPostsByCategory(posts: BlogPost[]): CategoryInfo[] {
  const categoryMap = new Map<string, { color: string; count: number }>()

  posts.forEach((post) => {
    post.category.forEach((cat) => {
      const existing = categoryMap.get(cat)
      if (existing) {
        existing.count++
      } else {
        categoryMap.set(cat, { color: 'default', count: 1 })
      }
    })
  })

  return Array.from(categoryMap.entries()).map(([name, { color, count }]) => ({
    name,
    color,
    count,
  }))
}
