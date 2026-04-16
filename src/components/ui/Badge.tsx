import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent)] text-[#16161D] hover:bg-[var(--accent-2)]",
        secondary:
          "border-transparent bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--surface-2)]/80",
        destructive:
          "border-transparent bg-[var(--danger)] text-white hover:bg-[var(--danger)]/80",
        outline: "text-[var(--foreground)] border-[var(--border)]",
        success: "border-transparent bg-[var(--success)] text-white hover:bg-[var(--success)]/80",
        warning: "border-transparent bg-[var(--warning)] text-[#16161D] hover:bg-[var(--warning)]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
