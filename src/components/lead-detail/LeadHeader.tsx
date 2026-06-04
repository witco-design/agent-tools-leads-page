import { Skeleton } from './Skeleton';

export function LeadHeader() {
  return (
    <div className="py-spacing-2 flex flex-wrap items-center gap-x-spacing-4 gap-y-spacing-3">
      {/* Lock icon placeholder */}
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="w-6 h-6 rounded-full" />
        {/* Lead name placeholder */}
        <Skeleton className="h-5 w-48 rounded-full" />
      </div>

      {/* Spacer - only shows at xl */}
      <div className="hidden xl:block flex-1" />

      {/* Action pill placeholders */}
      <div className="flex items-center gap-spacing-2">
        {/* 5 action buttons */}
        <Skeleton className="h-9 w-9 xl:w-20 rounded-full" />
        <Skeleton className="h-9 w-9 xl:w-16 rounded-full" />
        <Skeleton className="h-9 w-9 xl:w-20 rounded-full" />
        <Skeleton className="h-9 w-9 xl:w-16 rounded-full" />
        <Skeleton className="h-9 w-9 xl:w-28 rounded-full" />

        {/* More button */}
        <Skeleton className="w-9 h-9 rounded-full" />

        {/* Vertical separator */}
        <div className="h-6 w-px bg-border-default mx-spacing-1" />

        {/* Nav cluster — prev / back-to-list / next */}
        <div className="inline-flex items-center gap-spacing-1">
          <Skeleton className="h-9 w-9 rounded-2" />
          <Skeleton className="h-9 w-9 xl:w-24 rounded-2" />
          <Skeleton className="h-9 w-9 rounded-2" />
        </div>
      </div>
    </div>
  );
}
