/**
 * List 블록 컴포넌트 (Bulleted List, Numbered List)
 *
 * @module lib/notion/blocks/list
 */

import type {
  BulletedListItemBlock,
  NumberedListItemBlock,
} from '@/lib/notion/types'
import { RichText } from './rich-text'

interface BulletedListItemBlockProps {
  block: BulletedListItemBlock
}

interface NumberedListItemBlockProps {
  block: NumberedListItemBlock
}

/**
 * Bulleted List Item 블록 렌더링
 *
 * prose 클래스가 <ul> <li> 스타일을 자동 처리합니다.
 */
export function BulletedListItemBlockComponent({
  block,
}: BulletedListItemBlockProps) {
  const { rich_text } = block.bulleted_list_item

  return (
    <li>
      <RichText richText={rich_text} />
    </li>
  )
}

/**
 * Numbered List Item 블록 렌더링
 *
 * prose 클래스가 <ol> <li> 스타일을 자동 처리합니다.
 */
export function NumberedListItemBlockComponent({
  block,
}: NumberedListItemBlockProps) {
  const { rich_text } = block.numbered_list_item

  return (
    <li>
      <RichText richText={rich_text} />
    </li>
  )
}
