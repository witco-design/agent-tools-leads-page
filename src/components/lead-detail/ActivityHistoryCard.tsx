import { Skeleton } from './Skeleton';

/** Reusable row: icon circle + text lines + timestamp */
function ActivityRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="px-spacing-5 py-spacing-3 flex items-start gap-spacing-3">
      {/* Icon circle */}
      <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
      {/* Text lines */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className={`h-3.5 ${wide ? 'w-3/4' : 'w-1/2'} rounded-full`} />
        <Skeleton className="h-3.5 w-2/5 rounded-full" />
      </div>
      {/* Timestamp */}
      <Skeleton className="h-3 w-16 rounded-full shrink-0 mt-0.5" />
    </div>
  );
}

export function ActivityHistoryCard() {
  return (
    <div className="bg-bg-card rounded-3 border border-border-default shadow-sm overflow-hidden">
      {/* Title bar */}
      <div className="px-spacing-5 py-spacing-3 flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-2" />
      </div>

      {/* Hairline */}
      <div className="border-t border-border-default" />

      {/* Toolbar row */}
      <div className="px-spacing-5 py-spacing-3 flex flex-wrap items-center gap-spacing-2">
        <Skeleton className="h-9 w-20 rounded-2" />
        <Skeleton className="h-9 w-28 rounded-2" />
        <Skeleton className="h-9 w-20 rounded-2" />
        {/* Search bar fills remaining width */}
        <Skeleton className="h-9 flex-1 min-w-[160px] rounded-2" />
      </div>

      {/* Hairline */}
      <div className="border-t border-border-default" />

      {/* Pinned section header */}
      <div className="px-spacing-5 py-spacing-3 border-b border-border-default flex items-center justify-between">
        <Skeleton className="h-3.5 w-16 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-2" />
      </div>

      {/* Pinned item */}
      <ActivityRow wide />

      {/* Upcoming Follow-ups section header */}
      <div className="border-t border-border-default" />
      <div className="px-spacing-5 py-spacing-3 border-b border-border-default flex items-center justify-between">
        <Skeleton className="h-3.5 w-36 rounded-full" />
        <Skeleton className="h-3.5 w-28 rounded-full" />
      </div>

      {/* Upcoming items */}
      <div className="border-b border-border-default">
        <ActivityRow />
        <div className="border-t border-border-default" />
        <ActivityRow wide />
      </div>

      {/* Date group heading */}
      <div className="px-spacing-5 py-spacing-3 border-b border-border-default">
        <Skeleton className="h-3 w-14 rounded-full" />
      </div>

      {/* Historical items */}
      <ActivityRow />
      <ActivityRow wide />
      <ActivityRow />
      <ActivityRow wide />
      <ActivityRow />

      {/* Load older */}
      <div className="p-spacing-5 flex items-center justify-center border-t border-border-default">
        <Skeleton className="h-3.5 w-32 rounded-full" />
      </div>
    </div>
  );
}
