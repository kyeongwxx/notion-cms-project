/**
 * 카테고리 유틸리티 함수
 *
 * 카테고리 목록과 블로그 글 목록을 기반으로
 * 각 카테고리의 글 개수를 계산하는 함수를 제공합니다.
 */

import type { BlogPost, CategoryInfo } from '@/lib/notion/types'

/**
 * 카테고리별 글 개수를 계산하여 업데이트된 카테고리 목록 반환
 *
 * @param categories - 카테고리 목록
 * @param posts - 블로그 글 목록
 * @returns 글 개수가 업데이트된 카테고리 목록
 *
 * @example
 * ```typescript
 * const categories = getCategoriesWithCount(mockCategories, mockPosts)
 * console.log(categories[0].count) // 3
 * ```
 */
export function getCategoriesWithCount(
  categories: CategoryInfo[],
  posts: BlogPost[]
): CategoryInfo[] {
  return categories.map((category) => {
    // 해당 카테고리를 포함하는 글 개수 계산
    const count = posts.filter((post) =>
      post.category.includes(category.name)
    ).length

    return {
      ...category,
      count,
    }
  })
}

/**
 * 카테고리 이름에서 이모지 제거
 *
 * @param categoryName - 카테고리 이름 (이모지 포함)
 * @returns 이모지가 제거된 카테고리 이름
 *
 * @example
 * ```typescript
 * removeCategoryEmoji('🍽️ 맛집') // "맛집"
 * removeCategoryEmoji('💻 기술') // "기술"
 * ```
 */
export function removeCategoryEmoji(categoryName: string): string {
  return categoryName.replace(/[\u{1F000}-\u{1F9FF}]\s*/gu, '').trim()
}

/**
 * 카테고리 이름을 URL 슬러그로 변환
 *
 * @param categoryName - 카테고리 이름 (이모지 포함)
 * @returns URL 슬러그 (소문자, 공백 제거)
 *
 * @example
 * ```typescript
 * categoryToSlug('🍽️ 맛집') // "맛집"
 * categoryToSlug('✈️ 여행') // "여행"
 * ```
 */
export function categoryToSlug(categoryName: string): string {
  return removeCategoryEmoji(categoryName).toLowerCase()
}

/**
 * 카테고리 슬러그를 카테고리 이름으로 변환
 *
 * @param slug - 카테고리 슬러그
 * @param categories - 카테고리 목록
 * @returns 카테고리 이름 (이모지 포함) 또는 null
 *
 * @example
 * ```typescript
 * slugToCategory('맛집', categories) // "🍽️ 맛집"
 * slugToCategory('여행', categories) // "✈️ 여행"
 * ```
 */
export function slugToCategory(
  slug: string,
  categories: CategoryInfo[]
): string | null {
  const category = categories.find(
    (cat) => categoryToSlug(cat.name) === slug.toLowerCase()
  )
  return category?.name ?? null
}
