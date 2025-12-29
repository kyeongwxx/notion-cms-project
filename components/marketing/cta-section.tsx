import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

export function CtaSection() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              멋진 것을 만들 준비가 되셨나요?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              프로덕션 레디 스타터킷으로 다음 프로젝트를 시작하세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/contact">
                지금 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">더 알아보기</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
