/**
 * Code 블록 컴포넌트 (Shiki 구문 강조)
 *
 * @module lib/notion/blocks/code
 */

import { codeToHtml } from 'shiki'
import type { CodeBlock } from '@/lib/notion/types'
import { richTextToPlainText } from './rich-text'

interface CodeBlockProps {
  block: CodeBlock
}

/**
 * Code 블록 렌더링
 *
 * Shiki를 사용하여 서버 컴포넌트에서 구문 강조를 수행합니다.
 * VS Code 테마를 사용하여 다크 모드 자동 지원합니다.
 */
export async function CodeBlockComponent({ block }: CodeBlockProps) {
  const { rich_text, language, caption } = block.code

  // 코드 텍스트 추출
  const code = richTextToPlainText(rich_text)

  // Shiki로 구문 강조된 HTML 생성
  let highlightedCode: string
  try {
    highlightedCode = await codeToHtml(code, {
      lang: mapNotionLanguageToShiki(language),
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
  } catch {
    // 지원하지 않는 언어인 경우 플레인 텍스트로 표시
    console.warn(
      `[CodeBlock] Unsupported language: ${language}. Falling back to plain text.`
    )
    highlightedCode = `<pre><code>${escapeHtml(code)}</code></pre>`
  }

  // 캡션 텍스트
  const captionText = caption.length > 0 ? richTextToPlainText(caption) : null

  return (
    <figure className="my-6">
      {/* Shiki 생성 HTML (dangerouslySetInnerHTML 사용) */}
      <div
        className="overflow-x-auto rounded-lg [&>pre]:!my-0 [&>pre]:!rounded-lg [&>pre]:!p-4"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />

      {/* 캡션 (있을 때만 표시) */}
      {captionText && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {captionText}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Notion 언어 식별자를 Shiki 언어로 매핑
 *
 * Notion과 Shiki의 언어 식별자가 다른 경우를 처리합니다.
 *
 * @param notionLang - Notion 언어 식별자
 * @returns Shiki 언어 식별자
 */
function mapNotionLanguageToShiki(notionLang: string): string {
  const languageMap: Record<string, string> = {
    'plain text': 'text',
    shell: 'bash',
    c_cpp: 'cpp',
    'c#': 'csharp',
    'f#': 'fsharp',
    'objective-c': 'objc',
  }

  return languageMap[notionLang.toLowerCase()] || notionLang.toLowerCase()
}

/**
 * HTML 특수 문자 이스케이프
 *
 * @param text - 이스케이프할 텍스트
 * @returns 이스케이프된 텍스트
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char])
}
