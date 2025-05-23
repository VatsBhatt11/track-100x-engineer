import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    style={{
      position: "relative",
      height: "0.5rem",         // h-4
      width: "100%",          // w-full
      overflow: "hidden",
      borderRadius: "9999px", // rounded-full
      backgroundColor: "hsl(220 ,33% ,20%)", // fallback for `bg-secondary` (light gray)
      ...props.style
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      // style={{ transform: `translateX(-${100 - value}%)` }}
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
        backgroundColor: "hsl(25 ,95% ,53%)", // fallback for `bg-primary` (blue-500)
        transform: `translateX(-${100 - (value ?? 0)}%)`,
        transition: "transform 0.2s ease"
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
