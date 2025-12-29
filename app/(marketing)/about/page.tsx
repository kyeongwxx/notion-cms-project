import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "소개",
  description: "Next.js 스타터에 대해 알아보세요",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            소개
          </h1>
          <p className="text-xl text-muted-foreground">
            Next.js 16으로 구축된 모던 웹 애플리케이션 스타터킷
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">프로젝트 소개</h2>
            <p className="text-muted-foreground">
              이 프로젝트는 Next.js 16의 최신 기능을 활용하여 구축된 모던 웹 애플리케이션 스타터킷입니다.
              개발자들이 빠르게 프로젝트를 시작할 수 있도록 필수적인 기능들이 미리 구성되어 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">주요 기술 스택</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Next.js 16 - 최신 React 프레임워크</li>
              <li>TypeScript - 타입 안정성</li>
              <li>Tailwind CSS - 유틸리티 기반 스타일링</li>
              <li>Shadcn/ui - 재사용 가능한 컴포넌트</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">프로젝트 목표</h2>
            <p className="text-muted-foreground">
              개발자들이 프로젝트 초기 설정에 시간을 낭비하지 않고,
              비즈니스 로직 구현에 집중할 수 있도록 돕는 것이 이 스타터킷의 주요 목표입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
