/**
 * 카테고리 페이지
 *
 * 특정 카테고리의 블로그 글 목록을 표시합니다.
 * - 카테고리별 필터링
 * - 반응형 그리드 레이아웃
 * - 페이지네이션
 * - 빈 상태 UI
 *
 * Phase 3에서 실제 Notion API로 교체 예정입니다.
 */

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Badge } from '@/components/ui/badge'
import { PostGrid, Pagination } from '@/components/blog'

// 더미 데이터
import { getPublishedPosts } from '@/lib/mock/posts'
import { mockCategories, getCategoryBySlug } from '@/lib/mock/categories'
import { slugToCategory } from '@/lib/utils/categories'

/**
 * 페이지당 글 개수
 */
const POSTS_PER_PAGE = 6

/**
 * 카테고리 페이지 컴포넌트
 */
export default function CategoryPage() {
  const params = useParams()
  const categorySlug = decodeURIComponent(params.category as string)

  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1)

  // 카테고리 정보 조회
  const categoryInfo = useMemo(
    () => getCategoryBySlug(categorySlug),
    [categorySlug]
  )

  // 카테고리 전체 이름 (이모지 포함)
  const categoryFullName = useMemo(
    () => slugToCategory(categorySlug, mockCategories),
    [categorySlug]
  )

  // 발행된 글 목록 가져오기
  const publishedPosts = useMemo(() => getPublishedPosts(), [])

  // 카테고리별 필터링된 글 목록
  const filteredPosts = useMemo(() => {
    if (!categoryFullName) return []
    return publishedPosts.filter((post) =>
      post.category.includes(categoryFullName)
    )
  }, [publishedPosts, categoryFullName])

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  // 카테고리 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [categorySlug])

  // 카테고리 표시 이름 (이모지 제거)
  const displayName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)

  return (
    <Section>
      <Container size="lg">
        <div className="py-12">
          {/* Category Header */}
          <header className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-4"
              style={{
                backgroundColor: categoryInfo
                  ? `var(--color-${categoryInfo.color}-100)`
                  : undefined,
                color: categoryInfo
                  ? `var(--color-${categoryInfo.color}-700)`
                  : undefined,
              }}
            >
              카테고리
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              {displayName}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {displayName} 카테고리의 모든 글을 확인하세요
            </p>
          </header>

          {/* 결과 개수 표시 */}
          {categoryFullName && (
            <div className="mb-4 text-sm text-muted-foreground">
              전체 {filteredPosts.length}개의 글
            </div>
          )}

          {/* 카테고리를 찾을 수 없을 때 */}
          {!categoryFullName && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center py-12">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  카테고리를 찾을 수 없습니다
                </h2>
                <p className="text-muted-foreground">
                  존재하지 않는 카테고리입니다.
                </p>
              </div>
            </div>
          )}

          {/* 글 목록 그리드 */}
          {categoryFullName && (
            <>
              <PostGrid
                posts={paginatedPosts}
                prioritizeFirstImage
                emptyMessage={`${displayName} 카테고리에는 아직 글이 없습니다.`}
              />

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
