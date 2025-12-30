'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러를 콘솔에 로깅 (프로덕션에서는 에러 리포팅 서비스로 전송)
    console.error('Category page error:', error)
  }, [error])

  return (
    <Section>
      <Container size="md">
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
          <Alert variant="destructive" className="mb-6 max-w-2xl">
            <AlertTitle className="text-lg font-semibold">카테고리를 불러올 수 없습니다</AlertTitle>
            <AlertDescription className="mt-2">
              요청하신 카테고리의 글 목록을 불러오는 중 문제가 발생했습니다.
              {error.digest && (
                <span className="mt-2 block text-sm text-muted-foreground">
                  오류 ID: {error.digest}
                </span>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button onClick={reset} variant="default">
              다시 시도
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              이전 페이지로
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
