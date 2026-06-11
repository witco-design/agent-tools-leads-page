import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-1 bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
