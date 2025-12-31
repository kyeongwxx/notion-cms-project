/**
 * PostCard 컴포넌트
 *
 * 블로그 글 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * - 커버 이미지 (Next.js Image 최적화)
 * - 카테고리 뱃지
 * - 제목
 * - 설명 (요약)
 * - 태그 목록
 * - 발행일
 *
 * @example
 * ```tsx
 * <PostCard post={blogPost} />
 * <PostCard post={blogPost} variant="compact" />
 * ```
 */

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, Tag as TagIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import type { BlogPost } from '@/lib/notion/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * PostCard variant 정의
 */
const postCardVariants = cva('group transition-all duration-300', {
  variants: {
    variant: {
      default: 'hover:shadow-lg hover:-translate-y-1',
      compact: 'hover:shadow-md',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface PostCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof postCardVariants> {
  /** 블로그 글 데이터 */
  post: BlogPost
  /** 커버 이미지 우선 로딩 여부 */
  priority?: boolean
}

/**
 * PostCard 컴포넌트
 */
export function PostCard({
  post,
  variant,
  priority = false,
  className,
  ...props
}: PostCardProps) {
  const {
    slug,
    title,
    description,
    category,
    tags,
    published,
    cover,
  } = post

  // 발행일 포맷팅
  const formattedDate = published
    ? format(published, 'yyyy년 M월 d일', { locale: ko })
    : '날짜 미정'

  // 커버 이미지 URL (없으면 기본 이미지)
  const coverImage = cover || '/images/placeholder-cover.svg'

  // 첫 번째 카테고리 (주 카테고리)
  const primaryCategory = category[0] || '기타'

  return (
    <Link
      href={`/posts/${slug}`}
      className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      aria-label={`${title} 글 읽기`}
    >
      <Card
        className={cn(postCardVariants({ variant }), className)}
        {...props}
      >
        {/* 커버 이미지 */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* 카테고리 뱃지 (이미지 위 오버레이) */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="shadow-md">
              {primaryCategory}
            </Badge>
          </div>
        </div>

        {/* 카드 콘텐츠 */}
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        {/* 태그 및 날짜 */}
        <CardFooter className="flex flex-col items-start gap-3">
          {/* 태그 목록 */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <div className="flex gap-1.5 flex-wrap">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 발행일 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={published?.toISOString()}>{formattedDate}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
