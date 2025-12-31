/**
 * Pagination 컴포넌트
 *
 * 페이지 네비게이션을 위한 컴포넌트입니다.
 * - 이전/다음 버튼
 * - 페이지 번호 버튼 (현재 페이지 기준 앞뒤 2개씩)
 * - 현재 페이지 하이라이트
 * - 첫/마지막 페이지 버튼
 * - 접근성 지원 (aria-current, aria-label)
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 * ```
 */

'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number
  /** 총 페이지 수 */
  totalPages: number
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void
  /** 표시할 페이지 버튼 개수 (현재 페이지 기준 양옆) */
  siblingCount?: number
}

/**
 * Pagination 컴포넌트
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  // 페이지가 1개 이하면 표시하지 않음
  if (totalPages <= 1) {
    return null
  }

  /**
   * 페이지 번호 범위 계산
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const totalNumbers = siblingCount * 2 + 3 // 양옆 sibling + 현재 페이지 + 첫/마지막 페이지
    const totalBlocks = totalNumbers + 2 // ellipsis 2개 추가

    // 페이지 수가 적으면 모두 표시
    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftEllipsis = leftSiblingIndex > 2
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1

    // 첫 페이지 + ellipsis + 중간 범위 + ellipsis + 마지막 페이지
    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
    }

    // 첫 페이지 + 중간 범위 + ellipsis + 마지막 페이지
    if (shouldShowRightEllipsis) {
      const leftRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => i + 1
      )
      return [...leftRange, 'ellipsis', totalPages]
    }

    // 첫 페이지 + ellipsis + 중간 범위 + 마지막 페이지
    if (shouldShowLeftEllipsis) {
      const rightRange = Array.from(
        { length: 3 + siblingCount * 2 },
        (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
      )
      return [1, 'ellipsis', ...rightRange]
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pageNumbers = getPageNumbers()
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <nav
      role="navigation"
      aria-label="페이지네이션"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      {/* 첫 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        aria-label="첫 페이지로 이동"
        className="hidden sm:inline-flex"
      >
        <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* 페이지 번호 버튼들 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isCurrentPage = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`페이지 ${pageNumber}${isCurrentPage ? ' (현재 페이지)' : ''}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              className="min-w-10"
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* 마지막 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        aria-label="마지막 페이지로 이동"
        className="hidden sm:inline-flex"
      >
        <ChevronsRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
