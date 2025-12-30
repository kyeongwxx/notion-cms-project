/**
 * 타입 정의 통합 Export
 *
 * 프로젝트 전체에서 사용하는 타입들을 중앙에서 관리합니다.
 */

// Notion 관련 타입
export type {
  // Notion API 기본 타입
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
  BlogPost,
  Place,
  CategoryInfo,
  TagInfo,
  PostStatus,
  PlaceType,
  Category,
  // API 응답 타입
  PaginationInfo,
  NotionDatabaseQueryResponse,
  NotionPageDetailResponse,
  // 쿼리 옵션
  PostsFilterOptions,
  SortOptions,
  PaginationOptions,
  NotionQueryOptions,
  // 블록 렌더링
  SupportedBlockType,
  BlockRenderOptions,
  // 에러 타입
  NotionAPIError,
  DataTransformError,
} from '@/lib/notion/types'

// 타입 가드 함수
export {
  isFullPage,
  isPostsPage,
  isPlacesPage,
  isFullBlock,
} from '@/lib/notion/types'

// 컴포넌트 Props 타입
export type {
  // 포스트 컴포넌트
  PostCardProps,
  PostGridProps,
  PostListProps,
  // 필터 컴포넌트
  CategoryFilterProps,
  TagFilterProps,
  FilterBarProps,
  // 검색 컴포넌트
  SearchBarProps,
  SearchResultsProps,
  // 페이지네이션
  PaginationProps,
  LoadMoreProps,
  // 장소 컴포넌트
  PlaceCardProps,
  PlaceListProps,
  // 콘텐츠 렌더링
  NotionRendererProps,
  TableOfContentsProps,
  // 레이아웃 컴포넌트
  BlogLayoutProps,
  PostHeaderProps,
  RelatedPostsProps,
  // 상태 컴포넌트
  LoadingSkeletonProps,
  EmptyStateProps,
  ErrorStateProps,
} from './components'
