import { Skeleton } from './Skeleton';

export function LeadSignalTagsCard() {
  return (
    <div className="bg-white border border-border-default rounded-3 shadow-sm p-spacing-3">
      <div className="flex items-center gap-spacing-2 flex-wrap">
        {/* 4 tag pill placeholders */}
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        {/* Overflow circle */}
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
}
