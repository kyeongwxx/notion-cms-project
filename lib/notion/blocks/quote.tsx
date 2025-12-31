/**
 * Quote 블록 컴포넌트
 *
 * @module lib/notion/blocks/quote
 */

import type { QuoteBlock } from '@/lib/notion/types'
import { RichText } from './rich-text'

interface QuoteBlockProps {
  block: QuoteBlock
}

/**
 * Quote 블록 렌더링
 *
 * prose 클래스가 <blockquote> 스타일을 자동 처리하지만,
 * 추가로 커스텀 스타일을 적용합니다.
 */
export function QuoteBlockComponent({ block }: QuoteBlockProps) {
  const { rich_text } = block.quote

  return (
    <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground">
      <RichText richText={rich_text} />
    </blockquote>
  )
}
