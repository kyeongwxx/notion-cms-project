import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function HeroSection() {
  return (
    <Section spacing="xl" className="relative overflow-hidden">
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-1.5">
            🚀 Now available for Next.js 16
          </Badge>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              당신의 다음{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                멋진 아이디어
              </span>
              를 구현하세요
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-2xl mx-auto">
              빠르게 출시하는 데 필요한 모든 것을 갖춘 모던하고 프로덕션 레디
              Next.js 스타터킷입니다.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/contact">
                시작하기
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
  );
}
