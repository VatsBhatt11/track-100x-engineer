import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "@/lib/utils"
import '@/styles/hover-card.css'

// Wrapping HoverCard primitive to align with the project structure
const HoverCard = HoverCardPrimitive.Root

// Trigger component to open the hover card
const HoverCardTrigger = HoverCardPrimitive.Trigger

// Content component for the hover card, with default styles and customizations
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "hover-card-content",
      className
    )}
    {...props}
  />
))

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

// Exporting the components for usage in the application
export { HoverCard, HoverCardTrigger, HoverCardContent }
