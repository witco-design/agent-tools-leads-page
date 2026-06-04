import { Skeleton } from '@/components/ui/skeleton';

export function LeadHeaderSkeleton() {
  return (
    <div className="bg-white rounded-3 border border-border-default shadow-sm px-spacing-5 py-spacing-3 flex flex-wrap items-center gap-x-spacing-4 gap-y-spacing-3">
      {/* Avatar */}
      <Skeleton className="w-12 h-12 rounded-full" />
      {/* Name */}
      <Skeleton className="h-7 w-48" />
      <div className="flex-1" />
      {/* Action pill placeholders */}
      <div className="flex items-center gap-spacing-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="w-px h-9 bg-border-default hidden xl:block" />
      <div className="flex items-center gap-spacing-2">
        <Skeleton className="h-9 w-24 rounded-2" />
        <Skeleton className="h-9 w-24 rounded-2" />
        <Skeleton className="h-9 w-24 rounded-2" />
      </div>
    </div>
  );
}

export function ContactInfoCardSkeleton() {
  return (
    <div className="bg-white rounded-3 border border-border-default shadow-sm p-spacing-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-spacing-4">
        {[...Array(3)].map((_, col) => (
          <div key={col} className="space-y-spacing-3">
            {[...Array(4)].map((_, row) => (
              <div key={row} className="flex items-center gap-spacing-3">
                <Skeleton className="h-4 w-16 shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityHistoryCardSkeleton() {
  return (
    <div className="bg-white rounded-3 border border-border-default shadow-sm">
      {/* Toolbar */}
      <div className="p-spacing-5 flex items-center gap-spacing-2">
        <Skeleton className="h-7 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-20 rounded-2" />
        <Skeleton className="h-9 w-32 rounded-2" />
        <Skeleton className="h-9 w-24 rounded-2" />
        <Skeleton className="h-9 w-[200px] rounded-full" />
      </div>
      {/* Pinned bar */}
      <div className="p-spacing-5 border-y border-border-default">
        <Skeleton className="h-5 w-20" />
      </div>
      {/* Activity item placeholders */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-spacing-5 border-b border-border-default last:border-b-0 space-y-spacing-2">
          <div className="flex items-center gap-spacing-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
          <Skeleton className="h-4 w-3/4 ml-11" />
          <Skeleton className="h-12 w-full ml-11" />
        </div>
      ))}
    </div>
  );
}

export function RightColumnSkeleton() {
  return (
    <div className="bg-white rounded-3 border border-border-default shadow-sm overflow-hidden">
      {/* Tab strip */}
      <div className="flex border-b border-border-default">
        <div className="flex-1 py-3 flex justify-center">
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex-1 py-3 flex justify-center">
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      {/* Content area with inner-card placeholders */}
      <div className="p-spacing-4 space-y-spacing-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3 border border-border-default shadow-sm p-spacing-5 space-y-spacing-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
