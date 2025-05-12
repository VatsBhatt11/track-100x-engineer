'use client'
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"
import '@/styles/sonner.css'
type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "toast",
          description: "toast-description",
          actionButton: "toast-action-button",
          cancelButton: "toast-cancel-button",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
