import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import '@/styles/checkbox.css'
import { cn } from "@/lib/utils" // Import utility function from your project

// ForwardRef component for Checkbox
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "custom-checkbox",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("custom-checkbox__indicator")}
    >
      <Check className="custom-checkbox__check-icon" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

// Set displayName for debugging purposes
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Export the Checkbox component for use in other parts of the app
export { Checkbox }
