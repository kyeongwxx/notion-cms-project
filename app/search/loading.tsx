/**
 * 검색 페이지 로딩 UI
 */

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export default function SearchLoading() {
  return (
    <Section>
      <Container size="lg">
        <div className="py-12">
          {/* 헤더 스켈레톤 */}
          <header className="mb-12 text-center">
            <div className="h-10 w-32 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-64 bg-muted rounded mx-auto mb-8 animate-pulse" />
            <div className="max-w-2xl mx-auto">
              <div className="h-12 bg-muted rounded animate-pulse" />
            </div>
          </header>

          {/* 결과 개수 스켈레톤 */}
          <div className="mb-4">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>

          {/* 글 목록 그리드 스켈레톤 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
