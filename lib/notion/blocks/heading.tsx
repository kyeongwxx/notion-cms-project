/**
 * Heading 블록 컴포넌트 (h1, h2, h3)
 *
 * @module lib/notion/blocks/heading
 */

import type { HeadingBlock } from '@/lib/notion/types'
import { RichText, richTextToPlainText } from './rich-text'

interface HeadingBlockProps {
  block: HeadingBlock
}

/**
 * Heading 블록 렌더링
 *
 * prose 클래스가 자동으로 스타일링하므로 시맨틱 HTML만 사용합니다.
 * ID를 생성하여 목차 링크를 위한 앵커 포인트를 제공합니다.
 */
export function HeadingBlockComponent({ block }: HeadingBlockProps) {
  const { type } = block

  // 블록 타입에 따라 rich_text 가져오기
  const richText =
    type === 'heading_1'
      ? block.heading_1?.rich_text || []
      : type === 'heading_2'
        ? block.heading_2?.rich_text || []
        : block.heading_3?.rich_text || []

  // 헤딩 텍스트를 ID로 변환 (앵커 링크용)
  const plainText = richTextToPlainText(richText)
  const headingId = generateHeadingId(plainText)

  // 헤딩 레벨에 따라 적절한 태그 렌더링
  switch (type) {
    case 'heading_1':
      return (
        <h1 id={headingId}>
          <RichText richText={richText} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2 id={headingId}>
          <RichText richText={richText} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3 id={headingId}>
          <RichText richText={richText} />
        </h3>
      )
    default:
      return null
  }
}

/**
 * 헤딩 텍스트를 URL 친화적인 ID로 변환
 *
 * @param text - 헤딩 텍스트
 * @returns URL-safe ID
 *
 * @example
 * ```typescript
 * generateHeadingId("Hello World!")
 * // "hello-world"
 * ```
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/[^\w\u{1100}-\u{11FF}\u{3130}-\u{318F}\u{AC00}-\u{D7AF}-]/gu, '') // 영문, 숫자, 한글, 하이픈만 허용
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로
    .replace(/^-|-$/g, '') // 양 끝 하이픈 제거
}
