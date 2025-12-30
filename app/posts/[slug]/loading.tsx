import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section>
      <Container size="lg">
        <div className="mx-auto max-w-3xl py-12">
          {/* Header Skeleton */}
          <header className="mb-8 space-y-4">
            <Skeleton className="h-6 w-24" /> {/* 카테고리 뱃지 */}
            <Skeleton className="h-12 w-full" /> {/* 제목 */}
            <Skeleton className="h-12 w-3/4" /> {/* 제목 2번째 줄 */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" /> {/* 발행일 */}
              <Skeleton className="h-4 w-4" /> {/* 구분점 */}
              <Skeleton className="h-4 w-20" /> {/* 읽기 시간 */}
            </div>
          </header>

          {/* Content Skeleton */}
          <article className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />

            <div className="py-4">
              <Skeleton className="h-64 w-full" /> {/* 이미지 */}
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </article>
        </div>
      </Container>
    </Section>
  )
}
