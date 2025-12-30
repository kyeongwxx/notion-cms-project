import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section>
      <Container size="xl">
        <div className="py-12">
          {/* Header Skeleton */}
          <header className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-6 w-24" /> {/* 카테고리 뱃지 */}
            <Skeleton className="mx-auto mb-4 h-12 w-64" /> {/* 제목 */}
            <Skeleton className="mx-auto h-6 w-96" /> {/* 설명 */}
          </header>

          {/* Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-20" /> {/* 카테고리 뱃지 */}
                  <Skeleton className="h-6 w-full" /> {/* 제목 */}
                  <Skeleton className="h-6 w-3/4" /> {/* 제목 2번째 줄 */}
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" /> {/* 설명 1줄 */}
                    <Skeleton className="h-4 w-full" /> {/* 설명 2줄 */}
                    <Skeleton className="h-4 w-2/3" /> {/* 설명 3줄 */}
                  </div>
                  <Skeleton className="h-3 w-32" /> {/* 날짜 */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
