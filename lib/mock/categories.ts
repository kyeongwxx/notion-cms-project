/**
 * 카테고리 더미 데이터
 *
 * UI/UX 개발을 위한 샘플 카테고리 목록 및 조회 함수를 제공합니다.
 * Phase 3에서 실제 Notion API로 교체됩니다.
 */

import type { CategoryInfo } from '@/lib/notion/types'

/**
 * 카테고리 더미 데이터
 *
 * Notion 데이터베이스의 category 속성 값을 모방합니다.
 */
export const mockCategories: CategoryInfo[] = [
  {
    name: '🍽️ 맛집',
    color: 'red',
    count: 0, // 초기값, mockPosts에서 계산됨
  },
  {
    name: '✈️ 여행',
    color: 'blue',
    count: 0,
  },
  {
    name: '💻 기술',
    color: 'green',
    count: 0,
  },
  {
    name: '📚 일상',
    color: 'yellow',
    count: 0,
  },
]

/**
 * 카테고리 이름으로 카테고리 정보 조회
 *
 * @param name - 카테고리 이름 (이모지 포함, 예: "🍽️ 맛집")
 * @returns 카테고리 정보 또는 undefined
 *
 * @example
 * ```typescript
 * const category = getCategoryByName('🍽️ 맛집')
 * console.log(category?.color) // "red"
 * ```
 */
export function getCategoryByName(name: string): CategoryInfo | undefined {
  return mockCategories.find((cat) => cat.name === name)
}

/**
 * 카테고리 슬러그로 카테고리 정보 조회
 *
 * 이모지를 제외한 카테고리 이름으로 조회합니다.
 *
 * @param slug - 카테고리 슬러그 (예: "맛집", "여행")
 * @returns 카테고리 정보 또는 undefined
 *
 * @example
 * ```typescript
 * const category = getCategoryBySlug('맛집')
 * console.log(category?.name) // "🍽️ 맛집"
 * ```
 */
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return mockCategories.find((cat) => {
    // 이모지 제거 후 비교
    const nameWithoutEmoji = cat.name.replace(/[\u{1F000}-\u{1F9FF}]\s*/gu, '')
    return nameWithoutEmoji === slug
  })
}

/**
 * 모든 카테고리 목록 조회
 *
 * @returns 카테고리 정보 배열
 *
 * @example
 * ```typescript
 * const categories = getAllCategories()
 * console.log(categories.length) // 4
 * ```
 */
export function getAllCategories(): CategoryInfo[] {
  return [...mockCategories]
}
