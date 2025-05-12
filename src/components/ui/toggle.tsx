import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import '@/styles/toggle.css'
import { cn } from "@/lib/utils"

// Toggle style variants
const toggleVariants = cva(
  "toggle",
  {
    variants: {
      variant: {
        default: "default",
        outline: "outline",
      },
      size: {
        default: "default-size",
        sm: "sm",
        lg: "lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Toggle component wrapper around Radix Toggle
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
