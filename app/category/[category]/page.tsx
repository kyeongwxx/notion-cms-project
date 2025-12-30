import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params

  // 카테고리 이름 포맷팅 (URL 디코딩 및 첫 글자 대문자)
  const categoryName = decodeURIComponent(category)
  const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

  return (
    <Section>
      <Container size="xl">
        <div className="py-12">
          {/* Category Header */}
          <header className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              카테고리
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              {displayName}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {displayName} 카테고리의 모든 글을 확인하세요
            </p>
          </header>

          {/* Posts Grid Placeholder */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-6 text-card-foreground"
              >
                <div className="space-y-2">
                  <Badge variant="outline">카테고리</Badge>
                  <h3 className="text-xl font-semibold">글 제목 {i}</h3>
                  <p className="text-sm text-muted-foreground">
                    이곳에 글 요약이 표시됩니다. Task 012에서 실제 Notion 데이터로 교체됩니다.
                  </p>
                  <div className="pt-4 text-xs text-muted-foreground">
                    2025년 1월 15일
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (주석 처리) */}
          {/* <div className="flex min-h-[40vh] flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              이 카테고리에는 아직 글이 없습니다.
            </p>
          </div> */}
        </div>
      </Container>
    </Section>
  )
}
