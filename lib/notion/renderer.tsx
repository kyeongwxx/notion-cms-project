/**
 * Notion 블록 렌더러
 *
 * Notion 블록을 React 컴포넌트로 변환하여 렌더링합니다.
 * Map Lookup 패턴을 사용하여 확장성과 타입 안전성을 보장합니다.
 *
 * @module lib/notion/renderer
 */

import type {
  NotionBlockWithChildren,
  RenderableBlock,
  BlockObjectResponse,
} from '@/lib/notion/types'
import { ParagraphBlockComponent } from './blocks/paragraph'
import { HeadingBlockComponent } from './blocks/heading'
import {
  BulletedListItemBlockComponent,
  NumberedListItemBlockComponent,
} from './blocks/list'
import { CodeBlockComponent } from './blocks/code'
import { QuoteBlockComponent } from './blocks/quote'
import { CalloutBlockComponent } from './blocks/callout'
import { DividerBlockComponent } from './blocks/divider'
import { ImageBlockComponent } from './blocks/image'
import { ToggleBlockComponent } from './blocks/toggle'

/**
 * 블록 렌더러 컴포넌트 맵
 *
 * 각 블록 타입에 대응하는 React 컴포넌트를 매핑합니다.
 * any 타입을 사용하여 각 블록 컴포넌트의 고유한 props 타입을 허용합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockRenderers: Record<string, React.ComponentType<any>> = {
  paragraph: ParagraphBlockComponent,
  heading_1: HeadingBlockComponent,
  heading_2: HeadingBlockComponent,
  heading_3: HeadingBlockComponent,
  bulleted_list_item: BulletedListItemBlockComponent,
  numbered_list_item: NumberedListItemBlockComponent,
  code: CodeBlockComponent,
  quote: QuoteBlockComponent,
  callout: CalloutBlockComponent,
  divider: DividerBlockComponent,
  image: ImageBlockComponent,
  toggle: ToggleBlockComponent,
}

/**
 * Notion 블록 배열을 React 요소로 렌더링
 *
 * @param blocks - Notion 블록 배열
 * @returns React 요소
 *
 * @example
 * ```tsx
 * <NotionRenderer blocks={pageBlocks} />
 * ```
 */
export async function NotionRenderer({
  blocks,
}: {
  blocks: NotionBlockWithChildren[]
}) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="my-12 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center">
        <p className="text-base font-medium text-muted-foreground">
          📝 콘텐츠가 없습니다.
        </p>
      </div>
    )
  }

  // 리스트 블록 그룹화 (bulleted_list_item, numbered_list_item)
  const groupedBlocks = groupListBlocks(blocks)

  return (
    <>
      {groupedBlocks.map((item, index) => {
        if (item.type === 'bulleted_list') {
          // Bulleted List 그룹
          return (
            <ul key={`bulleted-list-${index}`}>
              {item.blocks.map((block) =>
                renderBlock(block as NotionBlockWithChildren)
              )}
            </ul>
          )
        } else if (item.type === 'numbered_list') {
          // Numbered List 그룹
          return (
            <ol key={`numbered-list-${index}`}>
              {item.blocks.map((block) =>
                renderBlock(block as NotionBlockWithChildren)
              )}
            </ol>
          )
        } else {
          // 일반 블록
          return renderBlock(item.blocks[0] as NotionBlockWithChildren)
        }
      })}
    </>
  )
}

/**
 * 단일 Notion 블록을 React 요소로 렌더링
 *
 * @param block - Notion 블록
 * @returns React 요소
 */
function renderBlock(block: NotionBlockWithChildren): React.ReactNode {
  const { type, id } = block

  // 블록 타입에 대응하는 컴포넌트 찾기
  const Component = blockRenderers[type]

  if (!Component) {
    // Graceful Degradation: 지원하지 않는 블록 타입
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[NotionRenderer] Unsupported block type: ${type}`)
    }

    return (
      <div
        key={id}
        className="my-4 rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-4"
      >
        <p className="text-sm text-muted-foreground">
          ⚠️ 지원하지 않는 블록 타입: <code className="text-xs">{type}</code>
        </p>
      </div>
    )
  }

  // 자식 블록 렌더링 (재귀적)
  const children =
    block.children && block.children.length > 0
      ? block.children.map((child) => renderBlock(child))
      : undefined

  // 블록 렌더링
  return (
    <Component key={id} block={block as RenderableBlock}>
      {children}
    </Component>
  )
}

/**
 * 리스트 아이템 블록을 그룹화
 *
 * Notion API는 리스트 아이템을 개별 블록으로 반환하므로,
 * 연속된 리스트 아이템을 <ul> 또는 <ol>로 그룹화해야 합니다.
 *
 * @param blocks - Notion 블록 배열
 * @returns 그룹화된 블록 배열
 */
function groupListBlocks(blocks: NotionBlockWithChildren[]): Array<{
  type: 'bulleted_list' | 'numbered_list' | 'other'
  blocks: BlockObjectResponse[]
}> {
  const grouped: Array<{
    type: 'bulleted_list' | 'numbered_list' | 'other'
    blocks: BlockObjectResponse[]
  }> = []

  let currentListType: 'bulleted_list' | 'numbered_list' | null = null
  let currentListBlocks: BlockObjectResponse[] = []

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item') {
      if (currentListType === 'bulleted_list') {
        // 현재 리스트에 추가
        currentListBlocks.push(block)
      } else {
        // 이전 리스트 종료 및 새 리스트 시작
        if (currentListBlocks.length > 0) {
          grouped.push({
            type: currentListType || 'other',
            blocks: currentListBlocks,
          })
        }
        currentListType = 'bulleted_list'
        currentListBlocks = [block]
      }
    } else if (block.type === 'numbered_list_item') {
      if (currentListType === 'numbered_list') {
        // 현재 리스트에 추가
        currentListBlocks.push(block)
      } else {
        // 이전 리스트 종료 및 새 리스트 시작
        if (currentListBlocks.length > 0) {
          grouped.push({
            type: currentListType || 'other',
            blocks: currentListBlocks,
          })
        }
        currentListType = 'numbered_list'
        currentListBlocks = [block]
      }
    } else {
      // 리스트 아이템이 아닌 블록
      if (currentListBlocks.length > 0) {
        grouped.push({
          type: currentListType || 'other',
          blocks: currentListBlocks,
        })
        currentListType = null
        currentListBlocks = []
      }
      grouped.push({ type: 'other', blocks: [block] })
    }
  }

  // 마지막 리스트 처리
  if (currentListBlocks.length > 0) {
    grouped.push({
      type: currentListType || 'other',
      blocks: currentListBlocks,
    })
  }

  return grouped
}
