/**
 * Notion CMS 타입 정의
 *
 * Notion API와 블로그 애플리케이션 간의 타입 안전성을 보장합니다.
 * 실제 Notion 데이터베이스 구조를 기반으로 작성되었습니다.
 *
 * @requires @notionhq/client - Notion API 클라이언트 ✅ Task 009에서 설치 완료
 * @see https://developers.notion.com/reference/property-value-object
 */

/**
 * NOTE: @notionhq/client 설치 완료 ✅
 *
 * 실제 타입 임포트는 Task 010 (Notion API 클라이언트 구현)에서 진행합니다.
 * 현재는 기존 Mock 시스템과 호환성을 위해 커스텀 타입을 유지합니다.
 *
 * 향후 교체 예정 타입:
 * import type {
 *   PageObjectResponse,
 *   PartialPageObjectResponse,
 *   DatabaseObjectResponse,
 *   PartialDatabaseObjectResponse,
 *   BlockObjectResponse,
 *   PartialBlockObjectResponse,
 *   QueryDatabaseParameters,
 * } from '@notionhq/client/build/src/api-endpoints'
 */

// ============================================================================
// Notion API 기본 타입 (커스텀 정의)
// ============================================================================

/**
 * Notion 페이지 객체 응답
 *
 * 실제 @notionhq/client 타입과 호환되도록 설계됨
 */
export interface PageObjectResponse {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  created_by: { id: string }
  last_edited_by: { id: string }
  cover: {
    type: 'external' | 'file'
    external?: { url: string }
    file?: { url: string; expiry_time: string }
  } | null
  icon: {
    type: 'emoji' | 'external' | 'file'
    emoji?: string
    external?: { url: string }
    file?: { url: string; expiry_time: string }
  } | null
  parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'workspace'; workspace: true }
  archived: boolean
  properties: Record<string, unknown>
  url: string
  public_url: string | null
}

/**
 * Notion 부분 페이지 응답
 */
export interface PartialPageObjectResponse {
  object: 'page'
  id: string
}

/**
 * Notion 데이터베이스 객체 응답
 */
export interface DatabaseObjectResponse {
  object: 'database'
  id: string
  created_time: string
  created_by: { id: string }
  last_edited_time: string
  last_edited_by: { id: string }
  title: RichTextItemResponse[]
  description: RichTextItemResponse[]
  icon: unknown
  cover: unknown
  properties: Record<string, unknown>
  parent: unknown
  url: string
  public_url: string | null
  archived: boolean
  is_inline: boolean
}

/**
 * Notion 부분 데이터베이스 응답
 */
export interface PartialDatabaseObjectResponse {
  object: 'database'
  id: string
}

/**
 * Notion 블록 객체 응답
 */
export interface BlockObjectResponse {
  object: 'block'
  id: string
  parent: unknown
  created_time: string
  last_edited_time: string
  created_by: { id: string }
  last_edited_by: { id: string }
  has_children: boolean
  archived: boolean
  type: string
  [key: string]: unknown
}

/**
 * Notion 부분 블록 응답
 */
export interface PartialBlockObjectResponse {
  object: 'block'
  id: string
}

// ============================================================================
// Notion API 기본 타입 재정의 (편의성)
// ============================================================================

/**
 * Notion 페이지 응답 (전체 또는 부분)
 */
export type NotionPage = PageObjectResponse | PartialPageObjectResponse

/**
 * Notion 데이터베이스 응답 (전체 또는 부분)
 */
export type NotionDatabase =
  | DatabaseObjectResponse
  | PartialDatabaseObjectResponse

/**
 * Notion 블록 응답 (전체 또는 부분)
 */
export type NotionBlock = BlockObjectResponse | PartialBlockObjectResponse

/**
 * Notion RichText 타입
 */
export interface RichTextItemResponse {
  type: 'text' | 'mention' | 'equation'
  text?: {
    content: string
    link?: { url: string } | null
  }
  mention?: unknown
  equation?: { expression: string }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

// ============================================================================
// Notion 속성 값 타입 (Property Value Types)
// ============================================================================

/**
 * Title 속성 (제목)
 */
export interface TitleProperty {
  type: 'title'
  title: RichTextItemResponse[]
  id: string
}

/**
 * RichText 속성 (일반 텍스트)
 */
export interface RichTextProperty {
  type: 'rich_text'
  rich_text: RichTextItemResponse[]
  id: string
}

/**
 * Number 속성 (숫자)
 */
export interface NumberProperty {
  type: 'number'
  number: number | null
  id: string
}

/**
 * Select 속성 (단일 선택)
 */
export interface SelectProperty {
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
  id: string
}

/**
 * Multi-Select 속성 (다중 선택)
 */
export interface MultiSelectProperty {
  type: 'multi_select'
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
  id: string
}

/**
 * Date 속성 (날짜)
 */
export interface DateProperty {
  type: 'date'
  date: {
    start: string
    end: string | null
    time_zone: string | null
  } | null
  id: string
}

/**
 * URL 속성 (링크)
 */
export interface URLProperty {
  type: 'url'
  url: string | null
  id: string
}

/**
 * Files 속성 (파일 및 미디어)
 */
export interface FilesProperty {
  type: 'files'
  files: Array<{
    name: string
    type?: 'external' | 'file'
    external?: { url: string }
    file?: { url: string; expiry_time: string }
  }>
  id: string
}

/**
 * Relation 속성 (관계)
 */
export interface RelationProperty {
  type: 'relation'
  relation: Array<{ id: string }>
  id: string
  has_more?: boolean
}

// ============================================================================
// Posts 데이터베이스 스키마
// ============================================================================

/**
 * Posts 데이터베이스의 속성 스키마
 *
 * 실제 Notion 데이터베이스 구조:
 * - title: 블로그 글 제목
 * - Places: 장소 데이터베이스와의 관계
 * - category: 카테고리 (Multi-select, 예: "🍽️ 맛집", "📚 일상")
 * - cover: 커버 이미지
 * - description: 글 요약
 * - published: 발행일
 * - slug: URL 슬러그
 * - status: 상태 (Select, 예: "📝 초안", "✅ 발행됨")
 * - tags: 태그 (Multi-select)
 */
export interface PostsDatabaseSchema {
  title: TitleProperty
  Places: RelationProperty
  category: MultiSelectProperty
  cover: FilesProperty
  description: RichTextProperty
  published: DateProperty
  slug: RichTextProperty
  status: SelectProperty
  tags: MultiSelectProperty
}

/**
 * Posts 페이지 응답 타입 (타입 가드용)
 */
export type PostsPageResponse = PageObjectResponse & {
  properties: PostsDatabaseSchema
}

// ============================================================================
// Places 데이터베이스 스키마
// ============================================================================

/**
 * Places 데이터베이스의 속성 스키마
 *
 * 실제 Notion 데이터베이스 구조:
 * - name: 장소 이름
 * - visited-date: 방문일
 * - Posts: 포스트와의 관계
 * - district: 지역
 * - naver-maps: 네이버 지도 링크
 * - notes: 메모
 * - rating: 평점 (1-5)
 * - type: 타입 (Select, 예: "🍽️ 식당", "🏨 숙소")
 */
export interface PlacesDatabaseSchema {
  name: TitleProperty
  'visited-date': DateProperty
  Posts: RelationProperty
  district: RichTextProperty
  'naver-maps': URLProperty
  notes: RichTextProperty
  rating: NumberProperty
  type: SelectProperty
}

/**
 * Places 페이지 응답 타입 (타입 가드용)
 */
export type PlacesPageResponse = PageObjectResponse & {
  properties: PlacesDatabaseSchema
}

// ============================================================================
// 도메인 모델 타입 (Application Layer)
// ============================================================================

/**
 * 포스트 상태
 */
export type PostStatus = '📝 초안' | '✅ 발행됨'

/**
 * 장소 타입
 */
export type PlaceType =
  | '🍽️ 식당'
  | '🏨 숙소'
  | '☕ 카페'
  | '🎨 문화시설'
  | '🌳 공원'
  | '🛍️ 쇼핑'
  | string // 확장 가능하도록 string 허용

/**
 * 카테고리
 */
export type Category =
  | '🍽️ 맛집'
  | '✈️ 여행'
  | '💻 기술'
  | '📚 일상'
  | '🎨 문화'
  | string // 확장 가능하도록 string 허용

/**
 * 블로그 포스트 (변환된 도메인 모델)
 *
 * Notion API 응답을 애플리케이션에서 사용하기 쉬운 형태로 변환한 타입
 */
export interface BlogPost {
  /** Notion 페이지 ID */
  id: string

  /** 글 제목 */
  title: string

  /** URL 슬러그 */
  slug: string

  /** 글 요약 (SEO 메타 설명) */
  description: string | null

  /** 카테고리 목록 (이모지 포함) */
  category: string[]

  /** 태그 목록 */
  tags: string[]

  /** 발행 상태 */
  status: PostStatus

  /** 발행일 */
  published: Date | null

  /** 커버 이미지 URL */
  cover: string | null

  /** 관련 장소 목록 (옵션, populate 필요) */
  places?: Place[]

  /** 페이지 블록 콘텐츠 (옵션, lazy load) */
  content?: NotionBlock[]

  /** 생성일 */
  createdAt: Date

  /** 수정일 */
  updatedAt: Date
}

/**
 * 장소 정보 (변환된 도메인 모델)
 */
export interface Place {
  /** Notion 페이지 ID */
  id: string

  /** 장소 이름 */
  name: string

  /** 장소 타입 (이모지 포함) */
  type: PlaceType

  /** 지역/구역 */
  district: string | null

  /** 네이버 지도 링크 */
  naverMaps: string | null

  /** 메모/설명 */
  notes: string | null

  /** 평점 (1-5) */
  rating: number | null

  /** 방문일 */
  visitedDate: Date | null

  /** 관련 포스트 목록 (옵션, populate 필요) */
  posts?: BlogPost[]
}

/**
 * 카테고리 정보
 */
export interface CategoryInfo {
  /** 카테고리 이름 (이모지 포함) */
  name: string

  /** 카테고리 색상 */
  color: string

  /** 해당 카테고리의 글 개수 */
  count: number
}

/**
 * 태그 정보
 */
export interface TagInfo {
  /** 태그 이름 */
  name: string

  /** 태그 색상 */
  color: string

  /** 해당 태그의 글 개수 */
  count: number
}

// ============================================================================
// API 응답 래퍼 타입
// ============================================================================

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  /** 다음 페이지 커서 */
  nextCursor: string | null

  /** 다음 페이지 존재 여부 */
  hasMore: boolean

  /** 현재 페이지 아이템 개수 */
  count: number
}

/**
 * Notion 데이터베이스 쿼리 응답
 */
export interface NotionDatabaseQueryResponse<T = BlogPost | Place> {
  /** 결과 아이템 목록 */
  results: T[]

  /** 페이지네이션 정보 */
  pagination: PaginationInfo

  /** 응답 메타데이터 */
  metadata?: {
    /** 쿼리 실행 시간 (ms) */
    queryTime?: number

    /** 캐시 여부 */
    cached?: boolean
  }
}

/**
 * Notion 페이지 상세 응답
 */
export interface NotionPageDetailResponse {
  /** 페이지 정보 (BlogPost 또는 Place) */
  page: BlogPost | Place

  /** 페이지 블록 콘텐츠 */
  blocks: NotionBlock[]

  /** 응답 메타데이터 */
  metadata?: {
    /** 블록 개수 */
    blockCount: number

    /** 조회 시간 (ms) */
    queryTime?: number
  }
}

// ============================================================================
// 쿼리 필터 및 정렬 타입
// ============================================================================

/**
 * 포스트 필터 옵션
 */
export interface PostsFilterOptions {
  /** 카테고리 필터 */
  category?: string | string[]

  /** 태그 필터 */
  tags?: string | string[]

  /** 상태 필터 */
  status?: PostStatus | PostStatus[]

  /** 발행일 범위 필터 */
  publishedRange?: {
    start?: Date
    end?: Date
  }

  /** 검색 키워드 (제목, 설명) */
  search?: string
}

/**
 * 정렬 옵션
 */
export interface SortOptions {
  /** 정렬 기준 필드 */
  property: 'published' | 'created_time' | 'last_edited_time' | 'title'

  /** 정렬 방향 */
  direction: 'ascending' | 'descending'
}

/**
 * 페이지네이션 옵션
 */
export interface PaginationOptions {
  /** 페이지 크기 */
  pageSize?: number

  /** 시작 커서 */
  startCursor?: string
}

/**
 * Notion 데이터베이스 쿼리 옵션
 */
export interface NotionQueryOptions {
  /** 필터 */
  filter?: PostsFilterOptions

  /** 정렬 */
  sorts?: SortOptions[]

  /** 페이지네이션 */
  pagination?: PaginationOptions
}

// ============================================================================
// 유틸리티 타입 가드
// ============================================================================

/**
 * PageObjectResponse 타입 가드
 */
export function isFullPage(page: NotionPage): page is PageObjectResponse {
  return 'properties' in page
}

/**
 * PostsPageResponse 타입 가드
 */
export function isPostsPage(
  page: PageObjectResponse
): page is PostsPageResponse {
  return (
    'title' in page.properties &&
    'status' in page.properties &&
    'published' in page.properties
  )
}

/**
 * PlacesPageResponse 타입 가드
 */
export function isPlacesPage(
  page: PageObjectResponse
): page is PlacesPageResponse {
  return (
    'name' in page.properties &&
    'type' in page.properties &&
    'rating' in page.properties
  )
}

/**
 * BlockObjectResponse 타입 가드
 */
export function isFullBlock(block: NotionBlock): block is BlockObjectResponse {
  return 'type' in block
}

// ============================================================================
// Notion 블록 타입 (콘텐츠 렌더링용)
// ============================================================================

/**
 * 지원되는 Notion 블록 타입
 */
export type SupportedBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'code'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'image'
  | 'video'
  | 'file'
  | 'bookmark'
  | 'equation'
  | 'table'
  | 'table_row'
  | 'column_list'
  | 'column'

/**
 * 블록 렌더링 옵션
 */
export interface BlockRenderOptions {
  /** 코드 블록 구문 강조 활성화 */
  enableCodeHighlight?: boolean

  /** 이미지 최적화 활성화 */
  optimizeImages?: boolean

  /** 외부 링크 새 탭 열기 */
  openLinksInNewTab?: boolean

  /** 목차 생성 (heading 블록 기반) */
  generateTableOfContents?: boolean
}

// ============================================================================
// 구체적인 블록 타입 인터페이스 (Task 011)
// ============================================================================

/**
 * 중첩 블록 지원을 위한 재귀적 블록 타입
 */
export interface NotionBlockWithChildren extends BlockObjectResponse {
  /** 자식 블록 목록 (재귀적) */
  children?: NotionBlockWithChildren[]
}

/**
 * Paragraph 블록
 */
export interface ParagraphBlock extends BlockObjectResponse {
  type: 'paragraph'
  paragraph: {
    rich_text: RichTextItemResponse[]
    color: string
  }
}

/**
 * Heading 블록 (1, 2, 3)
 */
export interface HeadingBlock extends BlockObjectResponse {
  type: 'heading_1' | 'heading_2' | 'heading_3'
  heading_1?: {
    rich_text: RichTextItemResponse[]
    color: string
    is_toggleable: boolean
  }
  heading_2?: {
    rich_text: RichTextItemResponse[]
    color: string
    is_toggleable: boolean
  }
  heading_3?: {
    rich_text: RichTextItemResponse[]
    color: string
    is_toggleable: boolean
  }
}

/**
 * Bulleted List Item 블록
 */
export interface BulletedListItemBlock extends BlockObjectResponse {
  type: 'bulleted_list_item'
  bulleted_list_item: {
    rich_text: RichTextItemResponse[]
    color: string
  }
}

/**
 * Numbered List Item 블록
 */
export interface NumberedListItemBlock extends BlockObjectResponse {
  type: 'numbered_list_item'
  numbered_list_item: {
    rich_text: RichTextItemResponse[]
    color: string
  }
}

/**
 * Code 블록
 */
export interface CodeBlock extends BlockObjectResponse {
  type: 'code'
  code: {
    rich_text: RichTextItemResponse[]
    caption: RichTextItemResponse[]
    language: string
  }
}

/**
 * Quote 블록
 */
export interface QuoteBlock extends BlockObjectResponse {
  type: 'quote'
  quote: {
    rich_text: RichTextItemResponse[]
    color: string
  }
}

/**
 * Callout 블록
 */
export interface CalloutBlock extends BlockObjectResponse {
  type: 'callout'
  callout: {
    rich_text: RichTextItemResponse[]
    icon:
      | { type: 'emoji'; emoji: string }
      | { type: 'external'; external: { url: string } }
      | { type: 'file'; file: { url: string; expiry_time: string } }
      | null
    color: string
  }
}

/**
 * Divider 블록
 */
export interface DividerBlock extends BlockObjectResponse {
  type: 'divider'
  divider: Record<string, never> // 빈 객체
}

/**
 * Image 블록
 */
export interface ImageBlock extends BlockObjectResponse {
  type: 'image'
  image: {
    type: 'external' | 'file'
    external?: { url: string }
    file?: { url: string; expiry_time: string }
    caption: RichTextItemResponse[]
  }
}

/**
 * Toggle 블록
 */
export interface ToggleBlock extends BlockObjectResponse {
  type: 'toggle'
  toggle: {
    rich_text: RichTextItemResponse[]
    color: string
  }
}

/**
 * 모든 렌더링 가능한 블록 타입의 유니온
 */
export type RenderableBlock =
  | ParagraphBlock
  | HeadingBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | CodeBlock
  | QuoteBlock
  | CalloutBlock
  | DividerBlock
  | ImageBlock
  | ToggleBlock

// ============================================================================
// 에러 타입
// ============================================================================

/**
 * Notion API 에러
 */
export interface NotionAPIError {
  /** 에러 코드 */
  code: string

  /** 에러 메시지 */
  message: string

  /** 에러 상태 코드 */
  status: number

  /** 추가 에러 정보 */
  details?: Record<string, unknown>
}

/**
 * 데이터 변환 에러
 */
export interface DataTransformError {
  /** 에러 타입 */
  type: 'transform_error'

  /** 에러 메시지 */
  message: string

  /** 원본 데이터 */
  rawData?: unknown

  /** 에러 발생 필드 */
  field?: string
}
