import { Skeleton } from '@/components/ui/skeleton';

export function LeadDetailPageSkeleton() {
  return (
    <>
      {/* === FLOATING LEAD HEADER === */}
      <div className="py-spacing-2 flex items-center justify-between gap-spacing-4">
        {/* Left: lock icon + name */}
        <div className="flex items-center gap-spacing-3">
          <Skeleton className="w-4 h-4 rounded-1" />
          <Skeleton className="h-7 w-[200px] rounded-1" />
        </div>

        {/* Right: action pills + More + nav cluster */}
        <div className="flex items-center gap-spacing-2">
          <Skeleton className="h-9 w-16 rounded-1" />
          <Skeleton className="h-9 w-16 rounded-1" />
          <Skeleton className="h-9 w-20 rounded-1" />
          <Skeleton className="h-9 w-16 rounded-1" />
          <Skeleton className="h-9 w-28 rounded-1" />
          <Skeleton className="h-9 w-9 rounded-round" />
          <Skeleton className="h-6 w-px" />
          <Skeleton className="h-9 w-9 rounded-1" />
          <Skeleton className="h-9 w-24 rounded-1" />
          <Skeleton className="h-9 w-9 rounded-1" />
        </div>
      </div>

      {/* === BOTTOM 2-COLUMN GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-spacing-4 mt-spacing-10">
        {/* ============ LEFT COLUMN ============ */}
        <div className="flex flex-col gap-spacing-4">
          {/* Tags container skeleton */}
          <div className="bg-white border border-[#E4E7EC] rounded-3 p-spacing-3">
            <div className="flex items-center gap-spacing-2">
              <Skeleton className="h-7 w-24 rounded-round" />
              <Skeleton className="h-7 w-32 rounded-round" />
              <Skeleton className="h-7 w-28 rounded-round" />
              <Skeleton className="h-7 w-24 rounded-round" />
            </div>
          </div>

          {/* Data container skeleton (3 columns) */}
          <div className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden">
            <div className="flex flex-col xl:grid xl:grid-cols-[minmax(180px,1fr)_1px_minmax(200px,1fr)_1px_minmax(220px,1fr)]">
              {/* Contact column */}
              <div className="p-spacing-5 space-y-spacing-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between min-h-9">
                    <Skeleton className="h-4 w-16 rounded-1" />
                    <Skeleton className="h-4 w-28 rounded-1" />
                  </div>
                ))}
              </div>

              {/* Horizontal divider — visible below xl only */}
              <div className="xl:hidden mx-spacing-5 h-px bg-[#E4E7EC]" />

              {/* Vertical divider — visible at xl+ only */}
              <div className="hidden xl:block my-spacing-3 w-px bg-[#E4E7EC]" />

              {/* About column */}
              <div className="p-spacing-5 space-y-spacing-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between min-h-9">
                    <Skeleton className="h-4 w-20 rounded-1" />
                    <Skeleton className="h-9 w-[160px] rounded-1" />
                  </div>
                ))}
              </div>

              {/* Horizontal divider — visible below xl only */}
              <div className="xl:hidden mx-spacing-5 h-px bg-[#E4E7EC]" />

              {/* Vertical divider — visible at xl+ only */}
              <div className="hidden xl:block my-spacing-3 w-px bg-[#E4E7EC]" />

              {/* Highlights column */}
              <div className="p-spacing-5 space-y-spacing-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between min-h-9">
                    <Skeleton className="h-4 w-16 rounded-1" />
                    <Skeleton className="h-4 w-24 rounded-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Robin AI Summary skeleton (collapsed) */}
          <div className="bg-white border border-[#c3c0f1] rounded-3">
            <div className="px-spacing-5 py-spacing-2 flex items-center justify-between">
              <div className="flex items-center gap-spacing-2">
                <Skeleton className="w-5 h-5 rounded-1" />
                <Skeleton className="h-5 w-36 rounded-1" />
              </div>
              <Skeleton className="h-9 w-28 rounded-1" />
            </div>
          </div>

          {/* Activity History skeleton */}
          <div className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden">
            {/* Header */}
            <div className="px-spacing-5 py-spacing-3 flex items-center justify-between">
              <Skeleton className="h-5 w-32 rounded-1" />
              <Skeleton className="w-5 h-5 rounded-1" />
            </div>

            <div className="border-t border-[#E4E7EC]" />

            {/* Toolbar */}
            <div className="px-spacing-5 py-spacing-3 flex items-center gap-spacing-2">
              <Skeleton className="h-9 w-20 rounded-1" />
              <Skeleton className="h-9 w-28 rounded-1" />
              <Skeleton className="h-9 w-28 rounded-1" />
              <Skeleton className="h-9 flex-1 rounded-1" />
            </div>

            <div className="border-t border-[#E4E7EC]" />

            {/* Activity items (5 stub rows) */}
            <div className="px-spacing-5 py-spacing-4 space-y-spacing-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-spacing-3">
                  <Skeleton className="w-8 h-8 rounded-round flex-shrink-0" />
                  <div className="flex-1 space-y-spacing-2">
                    <Skeleton className="h-4 w-3/4 rounded-1" />
                    {i % 2 === 0 && (
                      <Skeleton className="h-4 w-full rounded-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ RIGHT COLUMN ============ */}
        <div className="flex flex-col gap-spacing-4">
          {/* Tabs strip skeleton */}
          <div className="border-b border-[#E4E7EC] pb-spacing-2 flex items-center gap-spacing-4">
            <Skeleton className="h-6 w-12 rounded-1" />
            <Skeleton className="h-6 w-20 rounded-1" />
          </div>

          {/* Section card stubs (4 cards) */}
          {[
            { headerWidth: 'w-32', bodyRows: 1, bodyType: 'note' as const },
            { headerWidth: 'w-28', bodyRows: 7, bodyType: 'rows' as const },
            { headerWidth: 'w-24', bodyRows: 6, bodyType: 'rows' as const },
            { headerWidth: 'w-28', bodyRows: 4, bodyType: 'rows' as const },
          ].map((section, i) => (
            <div key={i} className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden">
              <div className="px-spacing-5 py-spacing-3 flex items-center justify-between">
                <Skeleton className={`h-5 ${section.headerWidth} rounded-1`} />
                <Skeleton className="w-5 h-5 rounded-1" />
              </div>

              <div className="border-t border-[#E4E7EC]" />

              <div className="px-spacing-5 py-spacing-4 space-y-spacing-3">
                {section.bodyType === 'note' ? (
                  <div className="bg-[#FEF6EE] rounded-1 p-spacing-4 space-y-spacing-2">
                    <Skeleton className="h-4 w-full rounded-1 bg-[#fbe4ab]" />
                    <Skeleton className="h-4 w-5/6 rounded-1 bg-[#fbe4ab]" />
                    <Skeleton className="h-4 w-3/4 rounded-1 bg-[#fbe4ab]" />
                  </div>
                ) : (
                  Array.from({ length: section.bodyRows }).map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24 rounded-1" />
                      <Skeleton className="h-4 w-10 rounded-1" />
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
