/**
 * UI 컴포넌트 Props 타입 정의
 *
 * 블로그 애플리케이션의 모든 컴포넌트에서 사용하는 Props 타입을 정의합니다.
 */

import type { BlogPost, Place, CategoryInfo, TagInfo } from '@/lib/notion/types'

// ============================================================================
// 블로그 포스트 컴포넌트
// ============================================================================

/**
 * PostCard 컴포넌트 Props
 *
 * 블로그 글 카드를 표시하는 컴포넌트
 */
export interface PostCardProps {
  /** 블로그 포스트 데이터 */
  post: BlogPost

  /** 카드 클릭 핸들러 (옵션) */
  onClick?: () => void

  /** 카드 크기 variant */
  variant?: 'default' | 'compact' | 'featured'

  /** 커버 이미지 표시 여부 */
  showCover?: boolean

  /** 설명 표시 여부 */
  showDescription?: boolean

  /** 태그 표시 여부 */
  showTags?: boolean

  /** 관련 장소 표시 여부 */
  showPlaces?: boolean

  /** 읽기 시간 표시 여부 */
  showReadingTime?: boolean

  /** 추가 className */
  className?: string

  /** 우선 로딩 (이미지) */
  priority?: boolean
}

/**
 * PostGrid 컴포넌트 Props
 *
 * 블로그 글 목록을 그리드로 표시하는 컴포넌트
 */
export interface PostGridProps {
  /** 포스트 목록 */
  posts: BlogPost[]

  /** 그리드 레이아웃 (열 개수) */
  columns?: {
    /** 모바일 (< 768px) */
    mobile?: 1 | 2
    /** 태블릿 (768px ~ 1024px) */
    tablet?: 2 | 3
    /** 데스크톱 (> 1024px) */
    desktop?: 2 | 3 | 4
  }

  /** 카드 variant (PostCard에 전달) */
  cardVariant?: PostCardProps['variant']

  /** 로딩 상태 */
  isLoading?: boolean

  /** 에러 상태 */
  error?: Error | null

  /** 빈 상태 메시지 */
  emptyMessage?: string

  /** 추가 className */
  className?: string
}

/**
 * PostList 컴포넌트 Props
 *
 * 블로그 글을 리스트 형태로 표시하는 컴포넌트 (테이블 레이아웃)
 */
export interface PostListProps {
  /** 포스트 목록 */
  posts: BlogPost[]

  /** 표시할 컬럼 */
  columns?: Array<'title' | 'category' | 'tags' | 'published' | 'status'>

  /** 정렬 가능 여부 */
  sortable?: boolean

  /** 정렬 상태 */
  sortBy?: {
    column: 'title' | 'published' | 'category'
    direction: 'asc' | 'desc'
  }

  /** 정렬 변경 핸들러 */
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void

  /** 행 클릭 핸들러 */
  onRowClick?: (post: BlogPost) => void

  /** 추가 className */
  className?: string
}

// ============================================================================
// 카테고리 및 필터 컴포넌트
// ============================================================================

/**
 * CategoryFilter 컴포넌트 Props
 *
 * 카테고리 필터링 UI
 */
export interface CategoryFilterProps {
  /** 카테고리 목록 */
  categories: CategoryInfo[]

  /** 선택된 카테고리 */
  selectedCategories: string[]

  /** 카테고리 선택 핸들러 */
  onCategoryChange: (categories: string[]) => void

  /** 다중 선택 가능 여부 */
  multiSelect?: boolean

  /** 전체 보기 옵션 표시 */
  showAllOption?: boolean

  /** 레이아웃 variant */
  variant?: 'tabs' | 'pills' | 'dropdown' | 'sidebar'

  /** 추가 className */
  className?: string
}

/**
 * TagFilter 컴포넌트 Props
 *
 * 태그 필터링 UI
 */
export interface TagFilterProps {
  /** 태그 목록 */
  tags: TagInfo[]

  /** 선택된 태그 */
  selectedTags: string[]

  /** 태그 선택 핸들러 */
  onTagChange: (tags: string[]) => void

  /** 다중 선택 가능 여부 */
  multiSelect?: boolean

  /** 최대 표시 태그 개수 */
  maxVisible?: number

  /** 검색 가능 여부 */
  searchable?: boolean

  /** 추가 className */
  className?: string
}

/**
 * FilterBar 컴포넌트 Props
 *
 * 통합 필터 바 (카테고리 + 태그 + 검색)
 */
export interface FilterBarProps {
  /** 카테고리 목록 */
  categories?: CategoryInfo[]

  /** 선택된 카테고리 */
  selectedCategories?: string[]

  /** 카테고리 변경 핸들러 */
  onCategoryChange?: (categories: string[]) => void

  /** 태그 목록 */
  tags?: TagInfo[]

  /** 선택된 태그 */
  selectedTags?: string[]

  /** 태그 변경 핸들러 */
  onTagChange?: (tags: string[]) => void

  /** 검색어 */
  searchQuery?: string

  /** 검색어 변경 핸들러 */
  onSearchChange?: (query: string) => void

  /** 정렬 옵션 */
  sortOptions?: Array<{
    label: string
    value: string
  }>

  /** 선택된 정렬 */
  selectedSort?: string

  /** 정렬 변경 핸들러 */
  onSortChange?: (sort: string) => void

  /** 필터 초기화 핸들러 */
  onReset?: () => void

  /** 추가 className */
  className?: string
}

// ============================================================================
// 검색 컴포넌트
// ============================================================================

/**
 * SearchBar 컴포넌트 Props
 *
 * 검색 입력 및 결과 표시
 */
export interface SearchBarProps {
  /** 검색어 */
  query: string

  /** 검색어 변경 핸들러 */
  onQueryChange: (query: string) => void

  /** 검색 실행 핸들러 (엔터 또는 버튼 클릭) */
  onSearch?: (query: string) => void

  /** 플레이스홀더 텍스트 */
  placeholder?: string

  /** 로딩 상태 */
  isLoading?: boolean

  /** 자동완성 제안 */
  suggestions?: string[]

  /** 제안 클릭 핸들러 */
  onSuggestionClick?: (suggestion: string) => void

  /** 디바운스 지연 (ms) */
  debounceMs?: number

  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg'

  /** 추가 className */
  className?: string
}

/**
 * SearchResults 컴포넌트 Props
 *
 * 검색 결과 표시
 */
export interface SearchResultsProps {
  /** 검색 결과 포스트 목록 */
  results: BlogPost[]

  /** 검색어 */
  query: string

  /** 로딩 상태 */
  isLoading?: boolean

  /** 검색어 하이라이팅 여부 */
  highlightQuery?: boolean

  /** 빈 결과 메시지 */
  emptyMessage?: string

  /** 추가 className */
  className?: string
}

// ============================================================================
// 페이지네이션 컴포넌트
// ============================================================================

/**
 * Pagination 컴포넌트 Props
 *
 * 페이지 네비게이션 UI
 */
export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number

  /** 전체 페이지 수 */
  totalPages: number

  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void

  /** 페이지당 아이템 수 */
  pageSize?: number

  /** 전체 아이템 수 */
  totalItems?: number

  /** 표시할 페이지 버튼 개수 */
  siblingCount?: number

  /** 이전/다음 버튼 표시 */
  showPrevNext?: boolean

  /** 처음/마지막 버튼 표시 */
  showFirstLast?: boolean

  /** 페이지 정보 텍스트 표시 */
  showInfo?: boolean

  /** 추가 className */
  className?: string
}

/**
 * LoadMore 컴포넌트 Props
 *
 * 더보기 버튼 또는 무한 스크롤
 */
export interface LoadMoreProps {
  /** 더 로드할 항목 존재 여부 */
  hasMore: boolean

  /** 로드 핸들러 */
  onLoad: () => void

  /** 로딩 상태 */
  isLoading?: boolean

  /** 자동 로드 (무한 스크롤) */
  autoLoad?: boolean

  /** 버튼 텍스트 */
  buttonText?: string

  /** 로딩 텍스트 */
  loadingText?: string

  /** 추가 className */
  className?: string
}

// ============================================================================
// 장소 관련 컴포넌트
// ============================================================================

/**
 * PlaceCard 컴포넌트 Props
 *
 * 장소 정보 카드
 */
export interface PlaceCardProps {
  /** 장소 데이터 */
  place: Place

  /** 카드 클릭 핸들러 */
  onClick?: () => void

  /** 카드 크기 variant */
  variant?: 'default' | 'compact' | 'detailed'

  /** 평점 표시 여부 */
  showRating?: boolean

  /** 방문일 표시 여부 */
  showVisitedDate?: boolean

  /** 메모 표시 여부 */
  showNotes?: boolean

  /** 관련 포스트 표시 여부 */
  showRelatedPosts?: boolean

  /** 추가 className */
  className?: string
}

/**
 * PlaceList 컴포넌트 Props
 *
 * 장소 목록 표시
 */
export interface PlaceListProps {
  /** 장소 목록 */
  places: Place[]

  /** 레이아웃 타입 */
  layout?: 'grid' | 'list' | 'map'

  /** 카드 variant */
  cardVariant?: PlaceCardProps['variant']

  /** 정렬 옵션 */
  sortBy?: 'name' | 'rating' | 'visitedDate'

  /** 정렬 방향 */
  sortDirection?: 'asc' | 'desc'

  /** 추가 className */
  className?: string
}

// ============================================================================
// 콘텐츠 렌더링 컴포넌트
// ============================================================================

/**
 * NotionRenderer 컴포넌트 Props
 *
 * Notion 블록 콘텐츠를 렌더링하는 컴포넌트
 */
export interface NotionRendererProps {
  /** Notion 블록 배열 */
  blocks: Array<unknown> // TODO: NotionBlock 타입 사용 (Task 011에서 구현)

  /** 코드 구문 강조 활성화 */
  enableCodeHighlight?: boolean

  /** 이미지 최적화 활성화 */
  optimizeImages?: boolean

  /** 외부 링크 새 탭 열기 */
  openLinksInNewTab?: boolean

  /** 목차 생성 */
  generateTableOfContents?: boolean

  /** 커스텀 블록 렌더러 */
  customRenderers?: Record<string, React.ComponentType<Record<string, unknown>>>

  /** 추가 className */
  className?: string
}

/**
 * TableOfContents 컴포넌트 Props
 *
 * 목차 네비게이션
 */
export interface TableOfContentsProps {
  /** 헤딩 목록 */
  headings: Array<{
    id: string
    text: string
    level: 1 | 2 | 3
  }>

  /** 활성 헤딩 ID */
  activeId?: string

  /** 헤딩 클릭 핸들러 */
  onHeadingClick?: (id: string) => void

  /** 고정 여부 (스크롤 시 상단 고정) */
  sticky?: boolean

  /** 추가 className */
  className?: string
}

// ============================================================================
// 레이아웃 컴포넌트
// ============================================================================

/**
 * BlogLayout 컴포넌트 Props
 *
 * 블로그 전체 레이아웃
 */
export interface BlogLayoutProps {
  /** 자식 요소 */
  children: React.ReactNode

  /** 사이드바 표시 여부 */
  showSidebar?: boolean

  /** 사이드바 콘텐츠 */
  sidebar?: React.ReactNode

  /** 추가 className */
  className?: string
}

/**
 * PostHeader 컴포넌트 Props
 *
 * 글 상세 페이지 헤더
 */
export interface PostHeaderProps {
  /** 포스트 데이터 */
  post: BlogPost

  /** 커버 이미지 표시 여부 */
  showCover?: boolean

  /** 카테고리 표시 여부 */
  showCategory?: boolean

  /** 태그 표시 여부 */
  showTags?: boolean

  /** 발행일 표시 여부 */
  showPublishedDate?: boolean

  /** 읽기 시간 표시 여부 */
  showReadingTime?: boolean

  /** 공유 버튼 표시 여부 */
  showShareButtons?: boolean

  /** 추가 className */
  className?: string
}

/**
 * RelatedPosts 컴포넌트 Props
 *
 * 관련 글 섹션
 */
export interface RelatedPostsProps {
  /** 현재 포스트 ID */
  currentPostId: string

  /** 관련 포스트 목록 */
  relatedPosts: BlogPost[]

  /** 표시할 최대 개수 */
  maxPosts?: number

  /** 섹션 제목 */
  title?: string

  /** 추가 className */
  className?: string
}

// ============================================================================
// 상태 및 피드백 컴포넌트
// ============================================================================

/**
 * LoadingSkeleton 컴포넌트 Props
 *
 * 로딩 스켈레톤 UI
 */
export interface LoadingSkeletonProps {
  /** 스켈레톤 타입 */
  type:
    | 'post-card'
    | 'post-grid'
    | 'post-detail'
    | 'place-card'
    | 'category-filter'
    | 'search-bar'

  /** 반복 개수 (그리드용) */
  count?: number

  /** 추가 className */
  className?: string
}

/**
 * EmptyState 컴포넌트 Props
 *
 * 빈 상태 UI
 */
export interface EmptyStateProps {
  /** 아이콘 */
  icon?: React.ReactNode

  /** 제목 */
  title: string

  /** 설명 */
  description?: string

  /** 액션 버튼 */
  action?: {
    label: string
    onClick: () => void
  }

  /** 추가 className */
  className?: string
}

/**
 * ErrorState 컴포넌트 Props
 *
 * 에러 상태 UI
 */
export interface ErrorStateProps {
  /** 에러 객체 */
  error: Error

  /** 재시도 핸들러 */
  onRetry?: () => void

  /** 추가 className */
  className?: string
}
