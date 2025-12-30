import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <Section>
      <Container size="lg">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">최신 블로그 글</h1>
          <p className="text-lg text-muted-foreground">
            Notion CMS로 관리되는 개인 블로그입니다. 맛집, 여행, 기술 등 다양한 주제를 다룹니다.
          </p>
        </div>

        {/* Placeholder for blog post list - Will be replaced with Notion API integration */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Badge>카테고리 예시</Badge>
              </div>
              <CardTitle>블로그 글 제목</CardTitle>
              <CardDescription>2025년 1월 1일</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                여기에 Notion API로 가져온 블로그 글 목록이 표시됩니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Badge>카테고리 예시</Badge>
              </div>
              <CardTitle>블로그 글 제목</CardTitle>
              <CardDescription>2025년 1월 1일</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notion 데이터베이스 연동 후 실제 콘텐츠로 대체됩니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Badge>카테고리 예시</Badge>
              </div>
              <CardTitle>블로그 글 제목</CardTitle>
              <CardDescription>2025년 1월 1일</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Phase 2: API 연동 단계에서 구현 예정입니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
