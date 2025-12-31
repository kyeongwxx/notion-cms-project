/**
 * Divider 블록 컴포넌트
 *
 * @module lib/notion/blocks/divider
 */

import { Separator } from '@/components/ui/separator'
import type { DividerBlock } from '@/lib/notion/types'

interface DividerBlockProps {
  block: DividerBlock
}

/**
 * Divider 블록 렌더링
 *
 * shadcn/ui Separator 컴포넌트를 사용하여 구분선을 표시합니다.
 */
export function DividerBlockComponent({}: DividerBlockProps) {
  // Divider 블록은 콘텐츠가 없음
  return <Separator className="my-6" />
}
