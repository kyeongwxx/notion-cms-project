import { Zap, Shield, Palette, Code2, Rocket, Users } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { FeatureCard } from "@/components/marketing/feature-card"

const features = [
  {
    icon: Zap,
    title: "초고속 성능",
    description: "Next.js 16 기반으로 최적화된 성능을 기본 제공합니다.",
  },
  {
    icon: Shield,
    title: "타입 안전성",
    description: "TypeScript strict 모드로 완벽한 타입 지원을 제공합니다.",
  },
  {
    icon: Palette,
    title: "아름다운 UI",
    description: "TailwindCSS v4와 세련된 UI 컴포넌트로 구동됩니다.",
  },
  {
    icon: Code2,
    title: "개발자 중심",
    description: "최고의 개발 경험을 위한 모던 툴링과 모범 사례를 제공합니다.",
  },
  {
    icon: Rocket,
    title: "프로덕션 준비 완료",
    description: "Vercel, Netlify 등 어디든 손쉽게 배포할 수 있습니다.",
  },
  {
    icon: Users,
    title: "접근성",
    description: "접근성을 고려하여 WCAG 표준을 준수하는 컴포넌트입니다.",
  },
]

export function FeatureGrid() {
  return (
    <Section spacing="lg" variant="muted">
      <Container>
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              시작하는 데 필요한 모든 것
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              모던 웹 개발에 필수적인 요소를 모두 갖춘 정성스럽게 만든 스타터킷입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
