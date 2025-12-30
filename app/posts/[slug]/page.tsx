import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <Section>
      <Container size="lg">
        <div className="mx-auto max-w-3xl py-12">
          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                카테고리
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              글 제목 (슬러그: {slug})
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime="2025-01-15">2025년 1월 15일</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          {/* Article Content Placeholder */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              이곳에 Notion 블록 콘텐츠가 렌더링됩니다.
            </p>
            <p>
              현재는 플레이스홀더 페이지입니다. Task 010에서 Notion API를 연동하여 실제 콘텐츠를 표시할 예정입니다.
            </p>
          </article>
        </div>
      </Container>
    </Section>
  )
}
