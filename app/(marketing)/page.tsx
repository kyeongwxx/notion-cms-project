/**
 * 홈 페이지
 *
 * 블로그 글 목록을 표시합니다.
 * - 검색 기능
 * - 카테고리 필터링
 * - 반응형 그리드 레이아웃
 * - 페이지네이션
 *
 * Phase 3에서 실제 Notion API로 교체 예정입니다.
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import {
  PostGrid,
  CategoryFilter,
  SearchBar,
  Pagination,
} from '@/components/blog'

// 더미 데이터
import { getPublishedPosts } from '@/lib/mock/posts'
import { mockCategories } from '@/lib/mock/categories'
import { getCategoriesWithCount } from '@/lib/utils/categories'

/**
 * 페이지당 글 개수
 */
const POSTS_PER_PAGE = 6

/**
 * 홈 페이지 컴포넌트
 */
export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 현재 페이지 읽기
  const pageParam = searchParams.get('page')
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1

  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 발행된 글 목록 가져오기
  const publishedPosts = useMemo(() => getPublishedPosts(), [])

  // 카테고리별 글 개수 계산
  const categoriesWithCount = useMemo(
    () => getCategoriesWithCount(mockCategories, publishedPosts),
    [publishedPosts]
  )

  // 필터링된 글 목록
  const filteredPosts = useMemo(() => {
    let posts = publishedPosts

    // 카테고리 필터링
    if (selectedCategory) {
      posts = posts.filter((post) => post.category.includes(selectedCategory))
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim()
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

    return posts
  }, [publishedPosts, selectedCategory, searchQuery])

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  // 페이지 변경 핸들러 - URL 업데이트
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', page.toString())
      }
      router.push(`/?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // 필터 변경 시 첫 페이지로 이동
  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category)
      // Reset to page 1 without calling handlePageChange
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page')
      router.push(`/?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      // Reset to page 1 without calling handlePageChange
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page')
      router.push(`/?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <Section>
      <Container size="lg">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">최신 블로그 글</h1>
          <p className="text-lg text-muted-foreground">
            Notion CMS로 관리되는 개인 블로그입니다. 맛집, 여행, 기술 등 다양한
            주제를 다룹니다.
          </p>
        </div>

        {/* 검색 & 필터 */}
        <div className="mb-8 space-y-6">
          {/* 검색창 */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="글 제목, 설명, 태그로 검색..."
          />

          {/* 카테고리 필터 */}
          <CategoryFilter
            categories={categoriesWithCount}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 결과 개수 표시 */}
        <div className="mb-4 text-sm text-muted-foreground">
          전체 {filteredPosts.length}개의 글
          {selectedCategory && ` (카테고리: ${selectedCategory})`}
          {searchQuery && ` (검색어: "${searchQuery}")`}
        </div>

        {/* 글 목록 그리드 */}
        <PostGrid
          posts={paginatedPosts}
          prioritizeFirstImage
          emptyMessage={
            searchQuery || selectedCategory
              ? '검색 결과가 없습니다. 다른 키워드나 카테고리를 선택해보세요.'
              : '아직 작성된 글이 없습니다.'
          }
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Container>
    </Section>
  )
}
