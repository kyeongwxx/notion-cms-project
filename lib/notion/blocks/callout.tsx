/**
 * Callout 블록 컴포넌트
 *
 * @module lib/notion/blocks/callout
 */

import type { CalloutBlock } from '@/lib/notion/types'
import { RichText } from './rich-text'

interface CalloutBlockProps {
  block: CalloutBlock
}

/**
 * Callout 블록 렌더링
 *
 * Notion의 Callout 블록을 시각적으로 강조된 박스로 표시합니다.
 * 아이콘(이모지)과 함께 렌더링됩니다.
 */
export function CalloutBlockComponent({ block }: CalloutBlockProps) {
  const { rich_text, icon } = block.callout

  // 아이콘 추출 (이모지만 지원, 외부/파일 이미지는 생략)
  const emoji = icon?.type === 'emoji' ? icon.emoji : '💡'

  return (
    <div className="my-4 flex gap-3 rounded-lg border-l-4 border-primary bg-muted/50 p-4">
      {/* 아이콘 (이모지) */}
      <div className="shrink-0 text-2xl" aria-hidden="true">
        {emoji}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 leading-7">
        <RichText richText={rich_text} />
      </div>
    </div>
  )
}
