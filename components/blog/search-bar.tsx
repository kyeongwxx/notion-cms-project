/**
 * SearchBar 컴포넌트
 *
 * 블로그 글 검색을 위한 입력 필드 컴포넌트입니다.
 * - 검색 아이콘
 * - 실시간 검색 (디바운스 처리)
 * - 클리어 버튼 (X 아이콘)
 * - 접근성 지원 (label, aria-label)
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="글 제목, 태그로 검색..."
 * />
 * ```
 */

'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** 검색어 */
  value: string
  /** 검색어 변경 콜백 (디바운스 적용됨) */
  onChange: (value: string) => void
  /** 디바운스 지연 시간 (ms) */
  debounceMs?: number
}

/**
 * SearchBar 컴포넌트
 */
export function SearchBar({
  value,
  onChange,
  debounceMs = 300,
  placeholder = '글 제목, 태그로 검색...',
  className,
  ...props
}: SearchBarProps) {
  // 로컬 상태 (즉시 반영용)
  const [localValue, setLocalValue] = useState(value)

  // 디바운스된 값
  const [debouncedValue] = useDebounceValue(localValue, debounceMs)

  // 디바운스된 값이 변경되면 부모에 전달
  useEffect(() => {
    onChange(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  // value prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  /**
   * 검색어 클리어
   */
  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={cn('relative', className)}>
      {/* 레이블 (시각적으로 숨김) */}
      <label htmlFor="search-input" className="sr-only">
        블로그 글 검색
      </label>

      {/* 검색 아이콘 */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />

      {/* 검색 입력 필드 */}
      <Input
        id="search-input"
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label="블로그 글 검색"
        {...props}
      />

      {/* 클리어 버튼 */}
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
          aria-label="검색어 지우기"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
