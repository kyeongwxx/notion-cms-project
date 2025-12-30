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
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <span className="text-4xl">📝</span>
              </div>
              <CardTitle className="text-2xl">글을 찾을 수 없습니다</CardTitle>
              <CardDescription className="mt-2">
                요청하신 블로그 글이 존재하지 않거나 삭제되었습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                URL을 다시 확인하시거나 홈페이지에서 다른 글을 탐색해보세요.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/">홈으로 가기</Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  이전 페이지로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
