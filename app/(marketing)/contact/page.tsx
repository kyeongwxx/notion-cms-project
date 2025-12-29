import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Github } from "lucide-react"
import { ContactForm } from "@/components/marketing/contact-form"

export const metadata: Metadata = {
  title: "연락처",
  description: "문의사항이 있으시면 연락주세요",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            연락처
          </h1>
          <p className="text-xl text-muted-foreground">
            문의사항이 있으시면 언제든지 연락주세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>이메일</CardTitle>
              </div>
              <CardDescription>
                이메일로 문의하시면 빠르게 답변드리겠습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:contact@example.com"
                className="text-primary hover:underline"
              >
                contact@example.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                <CardTitle>GitHub</CardTitle>
              </div>
              <CardDescription>
                GitHub에서 이슈를 등록하거나 기여해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/yourusername
              </a>
            </CardContent>
          </Card>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
