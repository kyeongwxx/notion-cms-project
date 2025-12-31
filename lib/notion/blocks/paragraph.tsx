/**
 * Paragraph 블록 컴포넌트
 *
 * @module lib/notion/blocks/paragraph
 */

import type { ParagraphBlock } from '@/lib/notion/types'
import { RichText } from './rich-text'

interface ParagraphBlockProps {
  block: ParagraphBlock
}

/**
 * Paragraph 블록 렌더링
 *
 * prose 클래스가 자동으로 스타일링하므로 최소한의 마크업만 사용합니다.
 */
export function ParagraphBlockComponent({ block }: ParagraphBlockProps) {
  const { rich_text } = block.paragraph

  // 빈 단락은 줄바꿈으로 처리
  if (rich_text.length === 0) {
    return <p className="min-h-[1.5em]">&nbsp;</p>
  }

  return (
    <p>
      <RichText richText={rich_text} />
    </p>
  )
}
