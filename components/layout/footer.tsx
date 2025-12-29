import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{siteConfig.name}</h3>
              <p className="text-sm text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>

            {/* Links columns */}
            <div>
              <h4 className="mb-4 text-sm font-semibold">회사</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">소개</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">연락처</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <Link href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
