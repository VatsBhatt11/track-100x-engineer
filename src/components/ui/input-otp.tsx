import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"
import '@/styles/input-otp.css'
import { cn } from "@/lib/utils"

// Wrapper for OTPInput with className and containerClassName customization
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "input-otp-container",
      containerClassName
    )}
    className={cn("input-otp", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

// Wrapper for OTP Input Group with customizable className
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("input-otp-group", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

// Slot component for individual OTP characters
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "input-otp-slot",
        isActive && "active",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="input-otp-caret-container">
          <div className="input-otp-caret" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

// Separator between OTP slots
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

// Exporting all components for usage
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
