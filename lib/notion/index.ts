/**
 * Notion API 모듈 메인 인덱스
 *
 * Notion API 관련 모든 함수와 타입을 재내보냅니다.
 * 다른 모듈에서 import 시 이 파일을 통해 접근합니다.
 *
 * @module lib/notion
 *
 * @example
 * ```typescript
 * // API 함수 사용
 * import { getPublishedPosts, getPostBySlug } from '@/lib/notion'
 *
 * // 타입 사용
 * import type { BlogPost, CategoryInfo } from '@/lib/notion'
 *
 * // 클라이언트 직접 사용 (고급)
 * import { getNotionClient, notionCall } from '@/lib/notion'
 * ```
 */

// ============================================================================
// API 함수 재내보내기
// ============================================================================

export {
  getPublishedPosts,
  getPostBySlug,
  getPostById,
  getCategories,
  getPageBlocks,
  getPublishedPostsCount,
  getRecentPosts,
  getPostStatsByStatus,
} from './api'

export type {
  GetPublishedPostsOptions,
  GetPublishedPostsResponse,
} from './api'

// ============================================================================
// 클라이언트 및 Rate Limiter 재내보내기
// ============================================================================

export {
  getNotionClient,
  getRateLimiter,
  notionCall,
  resetNotionClient,
  getClientStatus,
  NotionRateLimiter,
} from './client'

// ============================================================================
// 에러 핸들링 재내보내기
// ============================================================================

export {
  NotionError,
  DataTransformError,
  safeNotionCall,
  retryWithBackoff,
  safeParallelCalls,
  isNotionError,
  isDataTransformError,
  logNotionError,
} from './errors'

// ============================================================================
// 변환 헬퍼 재내보내기
// ============================================================================

export {
  transformPageToPost,
  transformPagesToPosts,
  extractRichTextArray,
  getBlockId,
  getBlockType,
  hasChildren,
} from './transform'

// ============================================================================
// 타입 재내보내기
// ============================================================================

export type {
  // Notion API 기본 타입
  PageObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse,
  PartialDatabaseObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
  NotionPage,
  NotionDatabase,
  NotionBlock,
  RichTextItemResponse,
  // Notion 속성 타입
  TitleProperty,
  RichTextProperty,
  NumberProperty,
  SelectProperty,
  MultiSelectProperty,
  DateProperty,
  URLProperty,
  FilesProperty,
  RelationProperty,
  // 데이터베이스 스키마
  PostsDatabaseSchema,
  PostsPageResponse,
  PlacesDatabaseSchema,
  PlacesPageResponse,
  // 도메인 모델
  PostStatus,
  PlaceType,
  Category,
  BlogPost,
  Place,
  CategoryInfo,
  TagInfo,
  // API 응답 래퍼
  PaginationInfo,
  NotionDatabaseQueryResponse,
  NotionPageDetailResponse,
  // 쿼리 옵션
  PostsFilterOptions,
  SortOptions,
  PaginationOptions,
  NotionQueryOptions,
  // 블록 타입
  SupportedBlockType,
  BlockRenderOptions,
  // 에러 타입
  NotionAPIError,
  DataTransformError as DataTransformErrorType,
} from './types'

// ============================================================================
// 타입 가드 재내보내기
// ============================================================================

export { isFullPage, isPostsPage, isPlacesPage, isFullBlock } from './types'
