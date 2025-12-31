/**
 * CategoryFilter 컴포넌트
 *
 * 카테고리별 글 필터링을 위한 버튼 그룹 컴포넌트입니다.
 * - "전체" 버튼 + 각 카테고리 버튼
 * - 선택된 카테고리 하이라이트
 * - 카테고리별 글 개수 표시
 * - 모바일: 가로 스크롤, 데스크톱: 래핑
 *
 * @example
 * ```tsx
 * <CategoryFilter
 *   categories={categories}
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={setSelectedCategory}
 * />
 * ```
 */

'use client'

import { Button } from '@/components/ui/button'
import type { CategoryInfo } from '@/lib/notion/types'
import { cn } from '@/lib/utils'

export interface CategoryFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 카테고리 목록 */
  categories: CategoryInfo[]
  /** 선택된 카테고리 (null이면 "전체") */
  selectedCategory: string | null
  /** 카테고리 변경 콜백 */
  onCategoryChange: (category: string | null) => void
}

/**
 * CategoryFilter 컴포넌트
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
  ...props
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="카테고리 필터"
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      {/* 섹션 제목 */}
      <h2 className="text-lg font-semibold">카테고리</h2>

      {/* 카테고리 버튼 그룹 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent lg:flex-wrap lg:overflow-x-visible lg:pb-0">
        {/* "전체" 버튼 */}
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          aria-label="전체 카테고리 보기"
          className="shrink-0"
        >
          전체
          <span className="ml-1.5 text-xs opacity-75">
            ({categories.reduce((sum, cat) => sum + cat.count, 0)})
          </span>
        </Button>

        {/* 각 카테고리 버튼 */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name

          return (
            <Button
              key={category.name}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.name)}
              aria-label={`${category.name} 카테고리 보기`}
              className="shrink-0"
              disabled={category.count === 0}
            >
              {category.name}
              <span className="ml-1.5 text-xs opacity-75">
                ({category.count})
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
