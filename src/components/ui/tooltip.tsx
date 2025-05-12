import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import '@/styles/tooltip.css'
import { cn } from "@/lib/utils"

// TooltipProvider wraps app sections where tooltips are used
const TooltipProvider = TooltipPrimitive.Provider

// Core tooltip root
const Tooltip = TooltipPrimitive.Root

// Tooltip trigger (usually wraps a button, icon, etc.)
const TooltipTrigger = TooltipPrimitive.Trigger

// Tooltip content box
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "tooltip-content",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
