import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-32",
    },
    variant: {
      default: "bg-background",
      muted: "bg-muted/30",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: {
    spacing: "md",
    variant: "default",
  },
})

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode
}

export function Section({ children, className, spacing, variant, ...props }: SectionProps) {
  return (
    <section className={cn(sectionVariants({ spacing, variant }), className)} {...props}>
      {children}
    </section>
  )
}
