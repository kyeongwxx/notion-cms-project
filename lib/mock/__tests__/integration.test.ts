/**
 * 더미 데이터 통합 테스트
 *
 * 실제 사용 시나리오를 테스트하여 Task 004~008에서 활용 가능성을 검증합니다.
 */

import { describe, it, expect } from 'vitest'
import {
  mockPosts,
  mockCategories,
  getPublishedPosts,
  getPostsByCategory,
  searchPosts,
  paginatePosts,
  updateCategoryCounts,
  getPopularTags,
} from '@/lib/mock'

describe('더미 데이터 통합 테스트 (실제 사용 시나리오)', () => {
  describe('홈 페이지 시나리오', () => {
    it('홈 페이지에서 6개씩 페이지네이션된 글 목록을 보여줘야 함', () => {
      const allPosts = getPublishedPosts()
      const result = paginatePosts(allPosts, 1, 6)

      expect(result.items.length).toBe(6)
      expect(result.totalPages).toBe(2)
      expect(result.currentPage).toBe(1)
      expect(result.hasNext).toBe(true)
      expect(result.hasPrev).toBe(false)
      expect(result.totalItems).toBe(12)
    })

    it('두 번째 페이지도 정상적으로 조회되어야 함', () => {
      const allPosts = getPublishedPosts()
      const result = paginatePosts(allPosts, 2, 6)

      expect(result.items.length).toBe(6)
      expect(result.currentPage).toBe(2)
      expect(result.hasNext).toBe(false)
      expect(result.hasPrev).toBe(true)
    })
  })

  describe('카테고리 페이지 시나리오', () => {
    it('맛집 카테고리 페이지에서 3개의 글을 보여줘야 함', () => {
      const posts = getPostsByCategory('🍽️ 맛집')

      expect(posts.length).toBe(3)
      expect(posts[0]?.category).toContain('🍽️ 맛집')
      expect(posts[0]?.title).toBeTruthy()
    })

    it('카테고리별 글 개수가 정확해야 함', () => {
      const updatedCategories = updateCategoryCounts(mockPosts, mockCategories)

      updatedCategories.forEach((category) => {
        expect(category.count).toBe(3)
      })
    })
  })

  describe('검색 페이지 시나리오', () => {
    it('제주 키워드로 검색하면 관련 글만 반환되어야 함', () => {
      const results = searchPosts('제주')

      expect(results.length).toBeGreaterThan(0)
      results.forEach((post) => {
        const hasKeyword =
          post.title.includes('제주') ||
          post.description?.includes('제주') ||
          post.tags.some((tag) => tag.includes('제주'))
        expect(hasKeyword).toBe(true)
      })
    })

    it('빈 검색어는 전체 글을 반환해야 함', () => {
      const results = searchPosts('')
      expect(results.length).toBe(mockPosts.length)
    })

    it('대소문자 구분 없이 검색되어야 함', () => {
      const upperResults = searchPosts('NEXT.JS')
      const lowerResults = searchPosts('next.js')

      expect(upperResults.length).toBe(lowerResults.length)
      expect(upperResults.length).toBeGreaterThan(0)
    })
  })

  describe('사이드바 위젯 시나리오', () => {
    it('인기 태그 Top 5를 보여줘야 함', () => {
      const topTags = getPopularTags(mockPosts, 5)

      expect(topTags.length).toBeLessThanOrEqual(5)
      topTags.forEach(([tag, count]) => {
        expect(typeof tag).toBe('string')
        expect(typeof count).toBe('number')
        expect(count).toBeGreaterThan(0)
      })

      // 내림차순 정렬 확인
      for (let i = 0; i < topTags.length - 1; i++) {
        expect(topTags[i]![1]).toBeGreaterThanOrEqual(topTags[i + 1]![1])
      }
    })

    it('카테고리 목록을 글 개수와 함께 보여줘야 함', () => {
      const categories = updateCategoryCounts(mockPosts, mockCategories)

      expect(categories.length).toBe(4)
      categories.forEach((category) => {
        expect(category.name).toBeTruthy()
        expect(category.color).toBeTruthy()
        expect(category.count).toBeGreaterThan(0)
      })
    })
  })

  describe('글 상세 페이지 시나리오', () => {
    it('슬러그로 글을 조회하면 전체 정보가 반환되어야 함', () => {
      const post = mockPosts.find(
        (p) => p.slug === 'seoul-seongsu-restaurants'
      )

      expect(post).toBeDefined()
      expect(post?.id).toBe('post-001')
      expect(post?.title).toBe('서울 성수동 맛집 베스트 5')
      expect(post?.category).toContain('🍽️ 맛집')
      expect(post?.tags.length).toBeGreaterThan(0)
      expect(post?.cover).toBeTruthy()
      expect(post?.description).toBeTruthy()
    })

    it('존재하지 않는 슬러그는 undefined를 반환해야 함', () => {
      const post = mockPosts.find((p) => p.slug === 'non-existent-slug')
      expect(post).toBeUndefined()
    })
  })

  describe('최신순 정렬 시나리오', () => {
    it('발행일 기준 최신순으로 정렬되어야 함', () => {
      const posts = getPublishedPosts()

      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = posts[i]!.published!.getTime()
        const nextDate = posts[i + 1]!.published!.getTime()
        expect(currentDate).toBeGreaterThanOrEqual(nextDate)
      }
    })
  })
})
