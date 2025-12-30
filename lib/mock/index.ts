/**
 * 더미 데이터 모듈 통합 Export
 *
 * UI/UX 개발을 위한 모든 더미 데이터와 헬퍼 함수를 제공합니다.
 * Phase 3에서 실제 Notion API로 교체됩니다.
 *
 * @module lib/mock
 *
 * @example
 * ```typescript
 * import { mockPosts, getPublishedPosts, paginatePosts } from '@/lib/mock'
 *
 * const posts = getPublishedPosts()
 * const result = paginatePosts(posts, 1, 6)
 * ```
 */

// ============================================================================
// 더미 데이터 Export
// ============================================================================

export { mockCategories } from './categories'
export { mockPosts } from './posts'

// ============================================================================
// 카테고리 관련 함수 Export
// ============================================================================

export {
  getCategoryByName,
  getCategoryBySlug,
  getAllCategories,
} from './categories'

// ============================================================================
// 블로그 글 관련 함수 Export
// ============================================================================

export {
  getPublishedPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  getPostsByTag,
  getPostById,
  getAllPosts,
} from './posts'

// ============================================================================
// 유틸리티 함수 Export
// ============================================================================

export {
  // 랜덤 데이터 생성
  getRandomPosts,
  getRandomCategory,
  generateRandomSlug,
  generateRandomDate,
  // 페이지네이션
  paginatePosts,
  paginateCategories,
  // 통계 및 집계
  updateCategoryCounts,
  getTagCounts,
  getPopularTags,
  // 데이터 검증
  isValidPost,
  validateMockData,
} from './utils'

// ============================================================================
// 타입 Export
// ============================================================================

export type { PaginatedResult } from './utils'
