'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <Section>
      <Container size="md">
        <div className="flex min-h-[70vh] flex-col items-center justify-center py-12">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <span className="text-5xl">🔍</span>
              </div>
              <CardTitle className="text-3xl">404</CardTitle>
              <CardTitle className="mt-2 text-2xl">페이지를 찾을 수 없습니다</CardTitle>
              <CardDescription className="mt-3">
                요청하신 페이지가 존재하지 않거나 이동되었습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                URL을 다시 확인하시거나 홈페이지에서 원하시는 콘텐츠를 찾아보세요.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/">홈으로 가기</Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                  이전 페이지로
                </Button>
              </div>

              {/* 인기 링크 (선택 사항) */}
              <div className="mt-8 border-t pt-6">
                <p className="mb-4 text-sm font-medium">인기 페이지</p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/category/맛집" className="text-primary hover:underline">
                    맛집
                  </Link>
                  <Link href="/category/여행" className="text-primary hover:underline">
                    여행
                  </Link>
                  <Link href="/category/기술" className="text-primary hover:underline">
                    기술
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
