import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <Section>
      <Container size="xl">
        <div className="py-12">
          {/* Hero Section Skeleton */}
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-96" /> {/* 제목 */}
            <Skeleton className="mx-auto mb-8 h-6 w-[600px]" /> {/* 부제목 */}
            <Skeleton className="mx-auto h-12 w-80" /> {/* 검색창 */}
          </div>

          {/* Category Filter Skeleton */}
          <div className="mb-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </div>

          {/* Posts Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full" /> {/* 커버 이미지 */}
                  <Skeleton className="h-5 w-20" /> {/* 카테고리 뱃지 */}
                  <Skeleton className="h-7 w-full" /> {/* 제목 */}
                  <Skeleton className="h-7 w-3/4" /> {/* 제목 2번째 줄 */}
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" /> {/* 설명 1줄 */}
                    <Skeleton className="h-4 w-full" /> {/* 설명 2줄 */}
                    <Skeleton className="h-4 w-2/3" /> {/* 설명 3줄 */}
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Skeleton className="h-3 w-24" /> {/* 날짜 */}
                    <Skeleton className="h-3 w-16" /> {/* 태그 */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
