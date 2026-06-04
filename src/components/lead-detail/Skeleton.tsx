import { cn } from '@/lib/utils';

/**
 * Static skeleton placeholder shape.
 * Fill: #EAECF0 — one step lighter than #E4E7EC borders.
 * No animation (no pulse, no shimmer).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-[#EAECF0]', className)}
      {...props}
    />
  );
}
