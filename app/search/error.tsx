/**
 * 검색 페이지 에러 UI
 */

'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SearchError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error('Search page error:', error)
  }, [error])

  return (
    <Section>
      <Container size="lg">
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
          <Alert variant="destructive" className="mb-6 max-w-md">
            <AlertDescription>
              검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button onClick={reset} variant="default">
              다시 시도
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="outline">
              홈으로 이동
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 max-w-2xl">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                에러 세부 정보 (개발 모드)
              </summary>
              <pre className="mt-4 rounded-lg bg-muted p-4 text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </Container>
    </Section>
  )
}
