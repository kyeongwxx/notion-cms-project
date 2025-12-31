/**
 * Toggle 블록 컴포넌트 (접기/펼치기)
 *
 * @module lib/notion/blocks/toggle
 */

'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { ToggleBlock } from '@/lib/notion/types'
import { RichText } from './rich-text'

interface ToggleBlockProps {
  block: ToggleBlock
  /** 자식 블록 렌더링 (재귀적) */
  children?: React.ReactNode
}

/**
 * Toggle 블록 렌더링
 *
 * 클라이언트 컴포넌트로 구현하여 상호작용을 지원합니다.
 * ChevronRight 아이콘이 열림/닫힘 상태를 시각적으로 표시합니다.
 */
export function ToggleBlockComponent({ block, children }: ToggleBlockProps) {
  const { rich_text } = block.toggle
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="my-4">
      {/* Toggle 헤더 (클릭 가능) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-muted"
        aria-expanded={isOpen}
        type="button"
      >
        {/* 화살표 아이콘 */}
        <ChevronRight
          className={`h-5 w-5 shrink-0 transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        />

        {/* Toggle 제목 */}
        <span className="flex-1 font-medium">
          <RichText richText={rich_text} />
        </span>
      </button>

      {/* Toggle 콘텐츠 (자식 블록) */}
      {isOpen && children && (
        <div className="ml-7 mt-2 border-l-2 border-muted pl-4">
          {children}
        </div>
      )}
    </div>
  )
}
