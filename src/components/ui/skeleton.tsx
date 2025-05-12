import { cn } from "@/lib/utils"
import '@/styles/skeleton.css'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

export { Skeleton }
