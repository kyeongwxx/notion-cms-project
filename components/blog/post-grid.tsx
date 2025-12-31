/**
 * PostGrid 컴포넌트
 *
 * 블로그 글 목록을 반응형 그리드 레이아웃으로 표시합니다.
 * - 모바일: 1열
 * - 태블릿: 2열
 * - 데스크톱: 3열
 * - 빈 상태 처리 (글이 없을 때)
 *
 * @example
 * ```tsx
 * <PostGrid posts={publishedPosts} />
 * <PostGrid posts={publishedPosts} emptyMessage="검색 결과가 없습니다." />
 * ```
 */

import type { BlogPost } from '@/lib/notion/types'
import { cn } from '@/lib/utils'
import { PostCard } from './post-card'
import { FileQuestion } from 'lucide-react'

export interface PostGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 블로그 글 목록 */
  posts: BlogPost[]
  /** 빈 상태 메시지 */
  emptyMessage?: string
  /** 첫 번째 카드 이미지 우선 로딩 여부 */
  prioritizeFirstImage?: boolean
}

/**
 * PostGrid 컴포넌트
 */
export function PostGrid({
  posts,
  emptyMessage = '아직 작성된 글이 없습니다.',
  prioritizeFirstImage = false,
  className,
  ...props
}: PostGridProps) {
  // 빈 상태 처리
  if (posts.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        role="status"
        aria-live="polite"
      >
        <FileQuestion
          className="h-16 w-16 text-muted-foreground mb-4"
          aria-hidden="true"
        />
        <p className="text-lg font-medium text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
      {...props}
    >
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          priority={prioritizeFirstImage && index === 0}
        />
      ))}
    </div>
  )
}
