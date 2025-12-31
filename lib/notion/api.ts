/**
 * Notion API 함수
 *
 * 블로그 글 조회, 카테고리 조회, 페이지 블록 조회 등
 * Notion API를 호출하는 주요 함수들을 제공합니다.
 *
 * @module lib/notion/api
 */

import type {
  PageObjectResponse,
  BlockObjectResponse,
  PostStatus,
  BlogPost,
  CategoryInfo,
} from '@/lib/notion/types'
import { getNotionClient, notionCall } from '@/lib/notion/client'
import {
  transformPageToPost,
  transformPagesToPosts,
} from '@/lib/notion/transform'
import { safeNotionCall, retryWithBackoff } from '@/lib/notion/errors'
import { env } from '@/lib/env'

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 글 목록 조회 옵션
 */
export interface GetPublishedPostsOptions {
  /** 페이지 크기 (기본값: 10) */
  pageSize?: number

  /** 시작 커서 (페이지네이션) */
  startCursor?: string

  /** 카테고리 필터 */
  category?: string

  /** 검색 키워드 (제목, 설명, 태그) */
  search?: string
}

/**
 * 글 목록 조회 응답
 */
export interface GetPublishedPostsResponse {
  /** 글 목록 */
  results: BlogPost[]

  /** 다음 페이지 커서 */
  nextCursor: string | null

  /** 다음 페이지 존재 여부 */
  hasMore: boolean
}

// ============================================================================
// 글 목록 조회
// ============================================================================

/**
 * 발행된 글 목록 조회
 *
 * Notion 데이터베이스에서 Status가 "✅ 발행됨"인 글만 조회하여
 * 발행일 기준 최신순으로 정렬합니다.
 *
 * @param options - 조회 옵션
 * @returns 발행된 글 목록 및 페이지네이션 정보
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * // 기본 조회 (최신 10개)
 * const { results, hasMore, nextCursor } = await getPublishedPosts()
 *
 * // 페이지네이션
 * const page2 = await getPublishedPosts({ startCursor: nextCursor })
 *
 * // 카테고리 필터
 * const foodPosts = await getPublishedPosts({ category: '🍽️ 맛집' })
 *
 * // 검색
 * const searchResults = await getPublishedPosts({ search: '제주' })
 * ```
 */
export async function getPublishedPosts(
  options: GetPublishedPostsOptions = {}
): Promise<GetPublishedPostsResponse> {
  const { pageSize = 10, startCursor, category, search } = options

  // Notion API 호출
  const response = await retryWithBackoff(() =>
    safeNotionCall(async () => {
      const notion = getNotionClient()

      // 필터 구성
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any[] = [
        // Status가 "✅ 발행됨"인 글만 조회
        {
          property: 'status',
          select: {
            equals: '✅ 발행됨',
          },
        },
      ]

      // 카테고리 필터 (있으면)
      if (category) {
        filters.push({
          property: 'category',
          multi_select: {
            contains: category,
          },
        })
      }

      // Notion API 쿼리
      return notionCall(
        () =>
          notion.databases.query({
            database_id: env.NOTION_DATABASE_ID,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter: (filters.length > 1 ? { and: filters } : filters[0]) as any,
            sorts: [
              {
                property: 'published',
                direction: 'descending',
              },
            ],
            page_size: pageSize,
            start_cursor: startCursor,
          }) as Promise<{
            results: Array<PageObjectResponse | { object: string; id: string }>
            next_cursor: string | null
            has_more: boolean
          }>
      )
    }, '글 목록 조회')
  )

  // PageObjectResponse로 타입 필터링
  const pages = response.results.filter(
    (page): page is PageObjectResponse => 'properties' in page
  )

  // BlogPost로 변환
  let posts = transformPagesToPosts(pages)

  // 검색 필터 (클라이언트 사이드)
  if (search) {
    const lowerQuery = search.toLowerCase().trim()
    posts = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery)
      const descriptionMatch =
        post.description?.toLowerCase().includes(lowerQuery) ?? false
      const tagsMatch = post.tags.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      )
      return titleMatch || descriptionMatch || tagsMatch
    })
  }

  return {
    results: posts,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  }
}

// ============================================================================
// 글 상세 조회
// ============================================================================

/**
 * 슬러그로 특정 글 조회
 *
 * Slug 필드로 특정 글을 검색합니다.
 * 발행된 글만 조회하며, 글이 없으면 null을 반환합니다.
 *
 * @param slug - 글 슬러그 (예: "seoul-seongsu-restaurants")
 * @returns 블로그 글 또는 null
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const post = await getPostBySlug('seoul-seongsu-restaurants')
 * if (post) {
 *   console.log(post.title) // "서울 성수동 맛집 베스트 5"
 * } else {
 *   console.log('글을 찾을 수 없습니다.')
 * }
 * ```
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  // Notion API 호출
  const response = await retryWithBackoff(() =>
    safeNotionCall(async () => {
      const notion = getNotionClient()

      return notionCall(
        () =>
          notion.databases.query({
            database_id: env.NOTION_DATABASE_ID,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter: {
              and: [
                {
                  property: 'slug',
                  rich_text: {
                    equals: slug,
                  },
                },
                {
                  property: 'status',
                  select: {
                    equals: '✅ 발행됨',
                  },
                },
              ],
            } as any,
          }) as Promise<{
            results: Array<PageObjectResponse | { object: string; id: string }>
          }>
      )
    }, `슬러그로 글 조회: ${slug}`)
  )

  // 결과가 없으면 null 반환
  if (response.results.length === 0) {
    return null
  }

  // PageObjectResponse로 타입 필터링
  const page = response.results[0]
  if (!('properties' in page)) {
    return null
  }

  // BlogPost로 변환
  return transformPageToPost(page as PageObjectResponse)
}

/**
 * ID로 특정 글 조회
 *
 * Notion 페이지 ID로 특정 글을 검색합니다.
 *
 * @param pageId - Notion 페이지 ID
 * @returns 블로그 글 또는 null
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const post = await getPostById('2d9f6c09-6107-803c-a617-dce8b09ec649')
 * ```
 */
export async function getPostById(pageId: string): Promise<BlogPost | null> {
  // Notion API 호출
  const page = await retryWithBackoff(() =>
    safeNotionCall(async () => {
      const notion = getNotionClient()

      return notionCall(() => notion.pages.retrieve({ page_id: pageId }))
    }, `ID로 글 조회: ${pageId}`)
  )

  // PageObjectResponse 타입 확인
  if (!('properties' in page)) {
    return null
  }

  // BlogPost로 변환
  return transformPageToPost(page as PageObjectResponse)
}

// ============================================================================
// 카테고리 조회
// ============================================================================

/**
 * 카테고리 목록 조회
 *
 * 데이터베이스의 모든 발행된 글에서 카테고리를 추출하고,
 * 카테고리별 글 개수를 계산합니다.
 *
 * @returns 카테고리 목록 (글 개수 포함)
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const categories = await getCategories()
 * // [
 * //   { name: '🍽️ 맛집', count: 3, color: 'blue' },
 * //   { name: '✈️ 여행', count: 2, color: 'green' },
 * // ]
 * ```
 */
export async function getCategories(): Promise<CategoryInfo[]> {
  // 모든 발행된 글 조회 (최대 100개, 실제로는 페이지네이션 필요할 수 있음)
  const { results: posts } = await getPublishedPosts({ pageSize: 100 })

  // 카테고리별 글 개수 계산
  const categoryMap = new Map<string, number>()

  posts.forEach((post) => {
    post.category.forEach((cat) => {
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
  })

  // CategoryInfo 배열로 변환
  const categories: CategoryInfo[] = Array.from(
    categoryMap,
    ([name, count]) => ({
      name,
      count,
      color: 'default', // 실제 색상은 Notion에서 가져와야 함 (향후 개선)
    })
  )

  // 글 개수 내림차순 정렬
  categories.sort((a, b) => b.count - a.count)

  return categories
}

// ============================================================================
// 페이지 블록 조회
// ============================================================================

/**
 * 페이지 블록 콘텐츠 조회
 *
 * 특정 페이지의 모든 블록을 조회합니다.
 * 재귀적으로 중첩 블록도 함께 조회합니다.
 *
 * @param pageId - Notion 페이지 ID
 * @returns 블록 배열
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const blocks = await getPageBlocks('2d9f6c09-6107-803c-a617-dce8b09ec649')
 * console.log(blocks.length) // 블록 개수
 * ```
 */
export async function getPageBlocks(
  pageId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  // 페이지네이션으로 모든 블록 조회
  while (true) {
    const response = await retryWithBackoff(() =>
      safeNotionCall(async () => {
        const notion = getNotionClient()

        return notionCall(() =>
          notion.blocks.children.list({
            block_id: pageId,
            start_cursor: cursor,
          })
        )
      }, `페이지 블록 조회: ${pageId}`)
    )

    // BlockObjectResponse로 타입 필터링
    const pageBlocks = response.results.filter(
      (block): block is BlockObjectResponse => 'type' in block
    )

    blocks.push(...pageBlocks)

    // 다음 페이지가 없으면 종료
    if (!response.has_more) {
      break
    }

    cursor = response.next_cursor ?? undefined
  }

  // 재귀적으로 중첩 블록 조회
  for (const block of blocks) {
    if (block.has_children) {
      // 중첩 블록 조회 (재귀)
      const children = await getPageBlocks(block.id)
      // children 속성은 런타임에 추가됨
      ;(block as BlockObjectResponse & { children?: BlockObjectResponse[] }).children =
        children
    }
  }

  return blocks
}

// ============================================================================
// 통계 및 유틸리티
// ============================================================================

/**
 * 전체 발행된 글 개수 조회
 *
 * @returns 발행된 글 개수
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const count = await getPublishedPostsCount()
 * console.log(`총 ${count}개의 글이 있습니다.`)
 * ```
 */
export async function getPublishedPostsCount(): Promise<number> {
  const { results } = await getPublishedPosts({ pageSize: 100 })
  return results.length
}

/**
 * 최근 글 조회
 *
 * 발행일 기준 최신 글 N개를 조회합니다.
 *
 * @param limit - 조회할 글 개수 (기본값: 5)
 * @returns 최신 글 배열
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const recentPosts = await getRecentPosts(3)
 * console.log(recentPosts[0].title) // 가장 최신 글
 * ```
 */
export async function getRecentPosts(limit = 5): Promise<BlogPost[]> {
  const { results } = await getPublishedPosts({ pageSize: limit })
  return results
}

/**
 * 상태별 글 개수 조회
 *
 * 초안과 발행된 글의 개수를 각각 조회합니다.
 *
 * @returns 상태별 글 개수
 * @throws {NotionError} Notion API 에러 발생 시
 *
 * @example
 * ```typescript
 * const stats = await getPostStatsByStatus()
 * console.log(`발행: ${stats.published}개, 초안: ${stats.draft}개`)
 * ```
 */
export async function getPostStatsByStatus(): Promise<{
  published: number
  draft: number
}> {
  const notion = getNotionClient()

  // 발행된 글 개수
  const publishedResponse = await retryWithBackoff(() =>
    safeNotionCall(
      async () =>
        notionCall(
          () =>
            notion.databases.query({
              database_id: env.NOTION_DATABASE_ID,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filter: {
                property: 'status',
                select: { equals: '✅ 발행됨' },
              } as any,
              page_size: 1, // 개수만 확인
            }) as Promise<{ results: unknown[] }>
        ),
      '발행된 글 개수 조회'
    )
  )

  // 초안 개수
  const draftResponse = await retryWithBackoff(() =>
    safeNotionCall(
      async () =>
        notionCall(
          () =>
            notion.databases.query({
              database_id: env.NOTION_DATABASE_ID,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filter: {
                property: 'status',
                select: { equals: '📝 초안' },
              } as any,
              page_size: 1, // 개수만 확인
            }) as Promise<{ results: unknown[] }>
        ),
      '초안 개수 조회'
    )
  )

  return {
    published: publishedResponse.results.length,
    draft: draftResponse.results.length,
  }
}
