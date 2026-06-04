import { Skeleton } from './Skeleton';

/* ── Skeleton wrappers for each card section ──────────────────── */

/** CollapsibleCard skeleton shell: title bar + content rows */
function SkeletonCard({
  titleWidth = 'w-28',
  children,
}: {
  titleWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E4E7EC] rounded-3 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-spacing-4 py-spacing-3 flex items-center justify-between">
        <Skeleton className={`h-4 ${titleWidth} rounded-full`} />
        <Skeleton className="h-5 w-5 rounded-2" />
      </div>
      {/* Body */}
      <div className="border-t border-[#E4E7EC]" />
      <div className="px-spacing-4 py-spacing-3">{children}</div>
    </div>
  );
}

/** Label + value row used in many cards */
function LabelValueRow({
  labelW = 'w-20',
  valueW = 'w-28',
}: {
  labelW?: string;
  valueW?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-spacing-2 min-h-[28px]">
      <Skeleton className={`h-3 ${labelW} rounded-full`} />
      <Skeleton className={`h-3.5 ${valueW} rounded-full`} />
    </div>
  );
}

/* ── Important Notes ────────────────────────────────────────────── */
function ImportantNotesSkeleton() {
  return (
    <SkeletonCard titleWidth="w-32">
      <div className="border-l-2 border-[#EAECF0] pl-spacing-3 space-y-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-3.5 w-full rounded-full" />
        <Skeleton className="h-3.5 w-4/5 rounded-full" />
        <Skeleton className="h-3.5 w-3/5 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Activity Stats ─────────────────────────────────────────────── */
function ActivityStatsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-28">
      <div className="space-y-spacing-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <LabelValueRow
            key={i}
            labelW={i % 2 === 0 ? 'w-20' : 'w-24'}
            valueW="w-8"
          />
        ))}
      </div>
    </SkeletonCard>
  );
}

/* ── Highlights ─────────────────────────────────────────────────── */
function HighlightsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-24">
      <div className="space-y-spacing-2">
        {/* Online Status row with badge */}
        <div className="flex items-center justify-between gap-spacing-2 min-h-[28px]">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <LabelValueRow labelW="w-24" valueW="w-24" />
        <LabelValueRow labelW="w-28" valueW="w-20" />
        <LabelValueRow labelW="w-28" valueW="w-24" />
        <LabelValueRow labelW="w-20" valueW="w-20" />
        <LabelValueRow labelW="w-16" valueW="w-28" />
        <LabelValueRow labelW="w-20" valueW="w-24" />
        <LabelValueRow labelW="w-20" valueW="w-24" />
      </div>
    </SkeletonCard>
  );
}

/* ── Contact Info Section ──────────────────────────────────────── */
function ContactInfoSkeleton() {
  return (
    <SkeletonCard titleWidth="w-24">
      <div className="space-y-spacing-3 divide-y divide-[#E4E7EC]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-spacing-3 ${i > 0 ? 'pt-spacing-3' : ''}`}
          >
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-32 rounded-full flex-1" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

/* ── Search Criteria ───────────────────────────────────────────── */
function SearchCriteriaSkeleton() {
  return (
    <SkeletonCard titleWidth="w-28">
      <div className="space-y-spacing-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <LabelValueRow
            key={i}
            labelW={i % 2 === 0 ? 'w-16' : 'w-20'}
            valueW="w-24"
          />
        ))}
      </div>
      {/* Footer: Run search button */}
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-9 w-24 rounded-2" />
      </div>
    </SkeletonCard>
  );
}

/* ── Important Dates ───────────────────────────────────────────── */
function ImportantDatesSkeleton() {
  return (
    <SkeletonCard titleWidth="w-28">
      <div className="space-y-spacing-2">
        <LabelValueRow labelW="w-20" valueW="w-28" />
      </div>
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-3.5 w-20 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Tags ──────────────────────────────────────────────────────── */
function TagsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-12">
      <div className="flex flex-wrap gap-spacing-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-spacing-3">
        <Skeleton className="h-9 w-full rounded-2" />
      </div>
    </SkeletonCard>
  );
}

/* ── Secondary Contact ─────────────────────────────────────────── */
function SecondaryContactSkeleton() {
  return (
    <SkeletonCard titleWidth="w-36">
      <div className="space-y-spacing-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-28 rounded-full" />
        <Skeleton className="h-3.5 w-36 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Lead Assignment ───────────────────────────────────────────── */
function LeadAssignmentSkeleton() {
  return (
    <SkeletonCard titleWidth="w-32">
      <div className="space-y-spacing-3">
        <div className="flex items-center justify-between gap-spacing-2 min-h-9">
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-2" />
        </div>
        <div className="flex items-center justify-between gap-spacing-2 min-h-9">
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-2" />
        </div>
      </div>
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-9 w-28 rounded-2" />
      </div>
    </SkeletonCard>
  );
}

/* ── Source ─────────────────────────────────────────────────────── */
function SourceSkeleton() {
  return (
    <SkeletonCard titleWidth="w-16">
      <LabelValueRow labelW="w-14" valueW="w-32" />
    </SkeletonCard>
  );
}

/* ── Follow-Ups ────────────────────────────────────────────────── */
function FollowUpsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-24">
      <div className="space-y-spacing-3 divide-y divide-[#E4E7EC]">
        {[0, 1].map((i) => (
          <div key={i} className={`space-y-2 ${i > 0 ? 'pt-spacing-3' : ''}`}>
            <div className="flex items-start gap-spacing-2">
              <Skeleton className="h-4 w-4 rounded-2 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-spacing-2 pl-6">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC] flex items-center justify-between">
        <Skeleton className="h-3.5 w-24 rounded-full" />
        <Skeleton className="h-3.5 w-28 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Workflows ─────────────────────────────────────────────────── */
function WorkflowsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-24">
      <div className="space-y-spacing-2">
        <Skeleton className="h-3.5 w-40 rounded-full" />
        <Skeleton className="h-3.5 w-36 rounded-full" />
      </div>
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC] flex items-center gap-spacing-2">
        <Skeleton className="h-9 flex-1 rounded-2" />
        <Skeleton className="h-9 w-16 rounded-2" />
      </div>
    </SkeletonCard>
  );
}

/* ── Saved Searches ────────────────────────────────────────────── */
function SavedSearchesSkeleton() {
  return (
    <SkeletonCard titleWidth="w-28">
      <div className="space-y-spacing-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-36 rounded-full" />
          <Skeleton className="h-3.5 w-3.5 rounded-2" />
        </div>
      </div>
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-3.5 w-32 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Market Reports ────────────────────────────────────────────── */
function MarketReportsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-28">
      <Skeleton className="h-3.5 w-40 rounded-full" />
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-3.5 w-24 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── Home Valuation Reports ─────────────────────────────────────── */
function HomeValuationReportsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-44">
      <Skeleton className="h-3.5 w-40 rounded-full" />
      <div className="mt-spacing-3 pt-spacing-3 border-t border-[#E4E7EC]">
        <Skeleton className="h-3.5 w-24 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

/* ── SMS/Email Opt-Outs ─────────────────────────────────────────── */
function SmsEmailOptOutsSkeleton() {
  return (
    <SkeletonCard titleWidth="w-36">
      <div className="space-y-spacing-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-spacing-3">
            <Skeleton className="h-5 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3.5 w-32 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

/* ── Main RightColumn ──────────────────────────────────────────── */
export function RightColumn() {
  return (
    <div className="space-y-spacing-4">
      {/* Tab bar */}
      <div className="w-full border-b border-border-default flex">
        <div className="flex-1 py-4 flex justify-center">
          <Skeleton className="h-3.5 w-10 rounded-full" />
        </div>
        <div className="flex-1 py-4 flex justify-center">
          <Skeleton className="h-3.5 w-24 rounded-full" />
        </div>
      </div>

      {/* Info tab cards (default view) */}
      <div className="space-y-spacing-4">
        <ImportantNotesSkeleton />
        <ActivityStatsSkeleton />
        <HighlightsSkeleton />
        <ContactInfoSkeleton />
        <SearchCriteriaSkeleton />
        <ImportantDatesSkeleton />
        <TagsSkeleton />
        <SecondaryContactSkeleton />
        <LeadAssignmentSkeleton />
        <SourceSkeleton />
      </div>
    </div>
  );
}
