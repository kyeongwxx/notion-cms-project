/**
 * Notion API 응답을 BlogPost 타입으로 변환
 *
 * Notion API의 복잡한 응답 구조를 애플리케이션에서 사용하기 쉬운
 * BlogPost 타입으로 변환하는 헬퍼 함수들을 제공합니다.
 *
 * @module lib/notion/transform
 */

import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
  TitleProperty,
  RichTextProperty,
  SelectProperty,
  MultiSelectProperty,
  DateProperty,
  FilesProperty,
} from '@/lib/notion/types'
import type { BlogPost, PostStatus } from '@/lib/notion/types'
import { DataTransformError } from '@/lib/notion/errors'

// ============================================================================
// 속성 추출 헬퍼 함수
// ============================================================================

/**
 * Title 속성에서 plain text 추출
 *
 * @param property - Title 속성
 * @returns 추출된 텍스트
 *
 * @example
 * ```typescript
 * const title = extractTitle(page.properties.title)
 * // "서울 성수동 맛집 베스트 5"
 * ```
 */
function extractTitle(property: TitleProperty): string {
  if (!property.title || property.title.length === 0) {
    return ''
  }

  return property.title.map((rt) => rt.plain_text).join('')
}

/**
 * RichText 속성에서 plain text 추출
 *
 * @param property - RichText 속성
 * @returns 추출된 텍스트
 *
 * @example
 * ```typescript
 * const description = extractRichText(page.properties.description)
 * // "성수동에서 꼭 가봐야 할 맛집 5곳을 소개합니다."
 * ```
 */
function extractRichText(property: RichTextProperty): string {
  if (!property.rich_text || property.rich_text.length === 0) {
    return ''
  }

  return property.rich_text.map((rt) => rt.plain_text).join('')
}

/**
 * Select 속성에서 선택된 값 추출
 *
 * @param property - Select 속성
 * @returns 선택된 값 (없으면 null)
 *
 * @example
 * ```typescript
 * const status = extractSelect(page.properties.status)
 * // "✅ 발행됨"
 * ```
 */
function extractSelect(property: SelectProperty): string | null {
  return property.select?.name ?? null
}

/**
 * Multi-Select 속성에서 선택된 값 배열 추출
 *
 * @param property - Multi-Select 속성
 * @returns 선택된 값 배열
 *
 * @example
 * ```typescript
 * const categories = extractMultiSelect(page.properties.category)
 * // ["🍽️ 맛집"]
 *
 * const tags = extractMultiSelect(page.properties.tags)
 * // ["서울", "성수동", "카페"]
 * ```
 */
function extractMultiSelect(property: MultiSelectProperty): string[] {
  if (!property.multi_select || property.multi_select.length === 0) {
    return []
  }

  return property.multi_select.map((item) => item.name)
}

/**
 * Date 속성에서 Date 객체 추출
 *
 * @param property - Date 속성
 * @returns Date 객체 (없으면 null)
 *
 * @example
 * ```typescript
 * const published = extractDate(page.properties.published)
 * // new Date('2025-12-15T10:00:00.000Z')
 * ```
 */
function extractDate(property: DateProperty): Date | null {
  if (!property.date?.start) {
    return null
  }

  return new Date(property.date.start)
}

/**
 * Files 속성에서 첫 번째 파일 URL 추출
 *
 * @param property - Files 속성
 * @returns 파일 URL (없으면 null)
 *
 * @example
 * ```typescript
 * const coverUrl = extractFileUrl(page.properties.cover)
 * // "https://images.unsplash.com/photo-..."
 * ```
 */
function extractFileUrl(property: FilesProperty): string | null {
  if (!property.files || property.files.length === 0) {
    return null
  }

  const file = property.files[0]
  if (!file) return null

  // External 파일
  if (file.type === 'external' && file.external) {
    return file.external.url
  }

  // Notion 업로드 파일
  if (file.type === 'file' && file.file) {
    return file.file.url
  }

  return null
}

/**
 * 페이지 Cover 이미지 URL 추출
 *
 * @param page - Notion 페이지
 * @returns Cover 이미지 URL (없으면 null)
 *
 * @example
 * ```typescript
 * const cover = extractCover(page)
 * // "https://images.unsplash.com/photo-..."
 * ```
 */
function extractCover(page: PageObjectResponse): string | null {
  if (!page.cover) {
    return null
  }

  // External 이미지
  if (page.cover.type === 'external' && page.cover.external) {
    return page.cover.external.url
  }

  // Notion 업로드 이미지
  if (page.cover.type === 'file' && page.cover.file) {
    return page.cover.file.url
  }

  return null
}

// ============================================================================
// 메인 변환 함수
// ============================================================================

/**
 * Notion PageObjectResponse를 BlogPost로 변환
 *
 * @param page - Notion 페이지 응답
 * @returns BlogPost 객체
 * @throws {DataTransformError} 필수 속성이 누락되었거나 형식이 올바르지 않은 경우
 *
 * @example
 * ```typescript
 * const response = await notion.databases.query(...)
 * const posts = response.results.map(transformPageToPost)
 * ```
 */
export function transformPageToPost(page: PageObjectResponse): BlogPost {
  try {
    const properties = page.properties

    // 필수 속성 검증
    if (!('title' in properties)) {
      throw new DataTransformError('필수 속성 누락: title', 'title', page)
    }
    if (!('status' in properties)) {
      throw new DataTransformError('필수 속성 누락: status', 'status', page)
    }
    if (!('slug' in properties)) {
      throw new DataTransformError('필수 속성 누락: slug', 'slug', page)
    }

    // 타입 단언 (타입 가드로 검증 완료)
    const titleProp = properties.title as TitleProperty
    const statusProp = properties.status as SelectProperty
    const slugProp = properties.slug as RichTextProperty
    const categoryProp = properties.category as MultiSelectProperty | undefined
    const tagsProp = properties.tags as MultiSelectProperty | undefined
    const publishedProp = properties.published as DateProperty | undefined
    const descriptionProp = properties.description as
      | RichTextProperty
      | undefined
    const coverProp = properties.cover as FilesProperty | undefined

    // 속성 추출
    const title = extractTitle(titleProp)
    const status = extractSelect(statusProp) as PostStatus | null
    const slug = extractRichText(slugProp)

    // 필수 필드 검증
    if (!title) {
      throw new DataTransformError('제목이 비어있습니다.', 'title', page)
    }
    if (!status) {
      throw new DataTransformError('상태가 설정되지 않았습니다.', 'status', page)
    }
    if (!slug) {
      throw new DataTransformError('슬러그가 비어있습니다.', 'slug', page)
    }

    // BlogPost 객체 생성
    const post: BlogPost = {
      id: page.id,
      title,
      slug,
      description: descriptionProp ? extractRichText(descriptionProp) : null,
      category: categoryProp ? extractMultiSelect(categoryProp) : [],
      tags: tagsProp ? extractMultiSelect(tagsProp) : [],
      status,
      published: publishedProp ? extractDate(publishedProp) : null,
      cover: coverProp ? extractFileUrl(coverProp) : extractCover(page),
      createdAt: new Date(page.created_time),
      updatedAt: new Date(page.last_edited_time),
    }

    return post
  } catch (error) {
    if (error instanceof DataTransformError) {
      throw error
    }

    throw new DataTransformError(
      `페이지 변환 실패: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      page
    )
  }
}

/**
 * 여러 Notion 페이지를 BlogPost 배열로 변환
 *
 * @param pages - Notion 페이지 배열
 * @returns BlogPost 배열
 * @throws {DataTransformError} 변환 실패 시
 *
 * @example
 * ```typescript
 * const response = await notion.databases.query(...)
 * const posts = transformPagesToPosts(response.results)
 * ```
 */
export function transformPagesToPosts(
  pages: PageObjectResponse[]
): BlogPost[] {
  const posts: BlogPost[] = []
  const errors: Array<{ pageId: string; error: Error }> = []

  for (const page of pages) {
    try {
      posts.push(transformPageToPost(page))
    } catch (error) {
      // 개별 페이지 변환 실패 시 에러를 수집하고 계속 진행
      errors.push({
        pageId: page.id,
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }

  // 변환 실패한 페이지가 있으면 경고 출력
  if (errors.length > 0) {
    console.warn(
      `⚠️  ${errors.length}개 페이지 변환 실패:\n${errors.map((e) => `  - ${e.pageId}: ${e.error.message}`).join('\n')}`
    )
  }

  return posts
}

// ============================================================================
// 블록 변환 헬퍼 (향후 Task 011에서 사용)
// ============================================================================

/**
 * RichText 배열에서 plain text 추출
 *
 * @param richTexts - RichText 배열
 * @returns 추출된 텍스트
 *
 * @example
 * ```typescript
 * const text = extractRichTextArray(block.paragraph.rich_text)
 * // "이것은 문단 텍스트입니다."
 * ```
 */
export function extractRichTextArray(
  richTexts: RichTextItemResponse[]
): string {
  if (!richTexts || richTexts.length === 0) {
    return ''
  }

  return richTexts.map((rt) => rt.plain_text).join('')
}

/**
 * 블록 ID 추출 (재귀적으로 중첩 블록 처리 시 사용)
 *
 * @param block - Notion 블록
 * @returns 블록 ID
 */
export function getBlockId(block: BlockObjectResponse): string {
  return block.id
}

/**
 * 블록 타입 추출
 *
 * @param block - Notion 블록
 * @returns 블록 타입 (예: "paragraph", "heading_1")
 */
export function getBlockType(block: BlockObjectResponse): string {
  return block.type
}

/**
 * 블록에 자식이 있는지 확인
 *
 * @param block - Notion 블록
 * @returns 자식 블록 존재 여부
 */
export function hasChildren(block: BlockObjectResponse): boolean {
  return block.has_children
}
