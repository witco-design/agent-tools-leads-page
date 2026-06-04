import { Skeleton } from './Skeleton';

export function RobinAISummaryCard() {
  return (
    <div className="bg-gradient-to-br from-purple-10 to-bg-card border border-purple-30 rounded-3 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-spacing-5 py-spacing-2 flex items-center justify-between gap-spacing-3">
        {/* Left: icon + title */}
        <div className="flex items-center gap-spacing-2 min-w-0">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>
        {/* Right: Generate button placeholder */}
        <Skeleton className="h-9 w-24 rounded-2" />
      </div>
    </div>
  );
}
