import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PostCard } from '@/components/blog/post-card'
import { getPostBySlug, getPostsByCategory } from '@/lib/mock/posts'
import { NotionRenderer } from '@/lib/notion/renderer'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * 읽기 시간 추정 (단어 수 기반)
 * @param text - 텍스트 내용
 * @returns 예상 읽기 시간 (분)
 */
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, minutes) // 최소 1분
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: '글을 찾을 수 없습니다',
      description: '요청하신 블로그 글이 존재하지 않습니다.',
    }
  }

  return {
    title: post.title,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      type: 'article',
      publishedTime: post.published?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['블로그 운영자'],
      tags: post.tags,
      images: post.cover
        ? [
            {
              url: post.cover,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  // 글을 찾을 수 없으면 404 페이지 표시
  if (!post) {
    notFound()
  }

  // 발행일 포맷팅
  const formattedDate = post.published
    ? format(post.published, 'yyyy년 M월 d일', { locale: ko })
    : '날짜 미정'

  // 읽기 시간 추정
  const readingTime = estimateReadingTime(post.description || '')

  // 첫 번째 카테고리 (주 카테고리)
  const primaryCategory = post.category[0] || '기타'

  // 관련 글 (같은 카테고리의 다른 글 3개)
  const relatedPosts = getPostsByCategory(primaryCategory)
    .filter((p) => p.slug !== post.slug) // 현재 글 제외
    .slice(0, 3) // 최대 3개

  return (
    <Section>
      <Container size="lg">
        <div className="mx-auto max-w-4xl py-8 lg:py-12">
          {/* Article Header */}
          <header className="mb-8 space-y-6">
            {/* 커버 이미지 (있을 때만 표시) */}
            {post.cover && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}

            {/* 카테고리 뱃지 */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {primaryCategory}
              </Badge>
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              {post.title}
            </h1>

            {/* 메타 정보 (발행일, 읽기 시간) */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <time dateTime={post.published?.toISOString()}>
                  {formattedDate}
                </time>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{readingTime}분 읽기</span>
              </div>
            </div>

            {/* 태그 목록 */}
            {post.tags.length > 0 && (
              <div className="flex items-start gap-2 flex-wrap">
                <TagIcon
                  className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mt-6" />
          </header>

          {/* Article Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
            {/* 설명 (Lead Paragraph) */}
            {post.description && (
              <p className="text-lg leading-8 text-muted-foreground">
                {post.description}
              </p>
            )}

            {/* Notion 블록 렌더러 (Task 011) */}
            {post.content && post.content.length > 0 ? (
              // @ts-expect-error - NotionRenderer는 서버 컴포넌트 (async)
              <NotionRenderer blocks={post.content} />
            ) : (
              // 콘텐츠가 없을 때 플레이스홀더
              <div className="my-12 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center">
                <p className="text-base font-medium text-muted-foreground">
                  📝 본문 내용이 없습니다.
                </p>
                <p className="mt-2 text-sm text-muted-foreground/70">
                  Notion 페이지에 콘텐츠를 추가해주세요.
                </p>
              </div>
            )}
          </article>

          {/* 관련 글 섹션 */}
          {relatedPosts.length > 0 && (
            <>
              <Separator className="my-12" />
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  이런 글은 어때요?
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <PostCard
                      key={relatedPost.slug}
                      post={relatedPost}
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
