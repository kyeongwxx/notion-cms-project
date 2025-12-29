import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { mainNav, siteConfig } from "@/lib/constants"

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
          <Button asChild variant="default" className="mt-4">
            <Link href="/contact" onClick={() => onOpenChange(false)}>시작하기</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
