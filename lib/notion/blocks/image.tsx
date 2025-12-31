/**
 * Image 블록 컴포넌트 (Next.js Image 최적화)
 *
 * @module lib/notion/blocks/image
 */

import Image from 'next/image'
import type { ImageBlock } from '@/lib/notion/types'
import { richTextToPlainText } from './rich-text'

interface ImageBlockProps {
  block: ImageBlock
}

/**
 * Image 블록 렌더링
 *
 * Next.js Image 컴포넌트를 사용하여 이미지를 최적화합니다.
 * Notion의 External 및 File 이미지를 모두 지원합니다.
 */
export function ImageBlockComponent({ block }: ImageBlockProps) {
  const { image } = block

  // 이미지 URL 추출
  const imageUrl =
    image.type === 'external'
      ? image.external?.url
      : image.file?.url || null

  if (!imageUrl) {
    return (
      <div className="my-6 flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-8">
        <p className="text-sm text-muted-foreground">
          ⚠️ 이미지 URL을 찾을 수 없습니다.
        </p>
      </div>
    )
  }

  // 캡션 텍스트
  const caption =
    image.caption.length > 0 ? richTextToPlainText(image.caption) : null

  return (
    <figure className="my-6">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={caption || '이미지'}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
          loading="lazy"
        />
      </div>

      {/* 캡션 (있을 때만 표시) */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
