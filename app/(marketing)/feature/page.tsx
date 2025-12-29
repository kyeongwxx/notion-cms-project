import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Palette, Code, Rocket, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "기능",
  description: "Next.js 스타터킷의 주요 기능을 알아보세요",
}

export default function FeaturePage() {
  const features = [
    {
      icon: Zap,
      title: "초고속 성능",
      description: "Next.js 16의 최신 최적화 기술로 빠른 로딩 속도를 제공합니다.",
    },
    {
      icon: Shield,
      title: "타입 안전성",
      description: "TypeScript strict 모드로 런타임 오류를 사전에 방지합니다.",
    },
    {
      icon: Palette,
      title: "아름다운 UI",
      description: "Tailwind CSS와 Shadcn/ui로 세련된 디자인을 구현합니다.",
    },
    {
      icon: Code,
      title: "개발자 중심",
      description: "모던 툴링과 개발 경험 최적화로 생산성을 극대화합니다.",
    },
    {
      icon: Rocket,
      title: "프로덕션 준비 완료",
      description: "검증된 아키텍처로 바로 서비스에 사용할 수 있습니다.",
    },
    {
      icon: Users,
      title: "접근성",
      description: "WCAG 표준을 준수하여 모든 사용자가 이용 가능합니다.",
    },
  ]

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            기능
          </h1>
          <p className="text-xl text-muted-foreground">
            프로젝트를 성공으로 이끄는 강력한 기능들
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">추가 기능</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                • <strong>반응형 디자인:</strong> 모바일부터 데스크톱까지 모든 기기에서 완벽하게 동작합니다.
              </p>
              <p>
                • <strong>다크 모드:</strong> 라이트/다크 테마를 손쉽게 전환할 수 있습니다.
              </p>
              <p>
                • <strong>SEO 최적화:</strong> 검색 엔진 최적화가 기본으로 적용되어 있습니다.
              </p>
              <p>
                • <strong>성능 모니터링:</strong> Core Web Vitals를 실시간으로 추적합니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
