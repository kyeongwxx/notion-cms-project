/**
 * RichText 렌더링 헬퍼 컴포넌트
 *
 * Notion의 RichTextItemResponse 배열을 React 요소로 변환합니다.
 * 볼드, 이탤릭, 밑줄, 취소선, 코드, 링크 등의 annotation을 지원합니다.
 *
 * @module lib/notion/blocks/rich-text
 */

import Link from 'next/link'
import type { RichTextItemResponse } from '@/lib/notion/types'

interface RichTextProps {
  /** RichText 아이템 배열 */
  richText: RichTextItemResponse[]
  /** 외부 링크를 새 탭에서 열지 여부 (기본값: true) */
  openLinksInNewTab?: boolean
}

/**
 * RichText 배열을 React 요소로 렌더링
 *
 * @example
 * ```tsx
 * <RichText richText={block.paragraph.rich_text} />
 * ```
 */
export function RichText({
  richText,
  openLinksInNewTab = true,
}: RichTextProps) {
  if (!richText || richText.length === 0) {
    return null
  }

  return (
    <>
      {richText.map((text, index) => {
        const { annotations, plain_text, href } = text

        // 텍스트 스타일 클래스 생성
        let className = ''
        if (annotations.bold) className += 'font-bold '
        if (annotations.italic) className += 'italic '
        if (annotations.strikethrough) className += 'line-through '
        if (annotations.underline) className += 'underline '
        if (annotations.code)
          className +=
            'bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary '

        // 색상 처리 (Notion 색상 → Tailwind 색상)
        const colorClass = getColorClass(annotations.color)
        if (colorClass) className += colorClass

        // 텍스트 엘리먼트
        const textElement = (
          <span key={index} className={className.trim() || undefined}>
            {plain_text}
          </span>
        )

        // 링크가 있으면 Next.js Link 또는 <a>로 래핑
        if (href) {
          const isExternal = href.startsWith('http')
          const linkProps = openLinksInNewTab
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {}

          if (isExternal) {
            return (
              <a
                key={index}
                href={href}
                className="text-primary underline-offset-4 hover:underline"
                {...linkProps}
              >
                {textElement}
              </a>
            )
          } else {
            return (
              <Link
                key={index}
                href={href}
                className="text-primary underline-offset-4 hover:underline"
              >
                {textElement}
              </Link>
            )
          }
        }

        return textElement
      })}
    </>
  )
}

/**
 * Notion 색상을 Tailwind 클래스로 변환
 *
 * @param color - Notion 색상 (예: "red", "blue_background")
 * @returns Tailwind 색상 클래스
 */
function getColorClass(color: string): string {
  // 기본 색상 (텍스트)
  const textColors: Record<string, string> = {
    gray: 'text-gray-600 dark:text-gray-400',
    brown: 'text-amber-800 dark:text-amber-600',
    orange: 'text-orange-600 dark:text-orange-500',
    yellow: 'text-yellow-600 dark:text-yellow-500',
    green: 'text-green-600 dark:text-green-500',
    blue: 'text-blue-600 dark:text-blue-500',
    purple: 'text-purple-600 dark:text-purple-500',
    pink: 'text-pink-600 dark:text-pink-500',
    red: 'text-red-600 dark:text-red-500',
  }

  // 배경 색상
  const bgColors: Record<string, string> = {
    gray_background: 'bg-gray-100 dark:bg-gray-800',
    brown_background: 'bg-amber-100 dark:bg-amber-900',
    orange_background: 'bg-orange-100 dark:bg-orange-900',
    yellow_background: 'bg-yellow-100 dark:bg-yellow-900',
    green_background: 'bg-green-100 dark:bg-green-900',
    blue_background: 'bg-blue-100 dark:bg-blue-900',
    purple_background: 'bg-purple-100 dark:bg-purple-900',
    pink_background: 'bg-pink-100 dark:bg-pink-900',
    red_background: 'bg-red-100 dark:bg-red-900',
  }

  return textColors[color] || bgColors[color] || ''
}

/**
 * RichText 배열을 plain text로 변환
 *
 * @param richText - RichText 아이템 배열
 * @returns plain text 문자열
 *
 * @example
 * ```typescript
 * const title = richTextToPlainText(block.heading_1.rich_text)
 * // "Hello World"
 * ```
 */
export function richTextToPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join('')
}
