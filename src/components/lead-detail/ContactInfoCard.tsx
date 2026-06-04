import { Skeleton } from './Skeleton';

export function ContactInfoCard() {
  return (
    <div className="bg-white border border-[#E4E7EC] rounded-3 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr]">

        {/* COLUMN 1: Contact */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Primary */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-14 rounded-full" />
              <Skeleton className="h-3.5 w-28 rounded-full" />
            </div>
            {/* Alt */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-8 rounded-full" />
              <Skeleton className="h-3.5 w-28 rounded-full" />
            </div>
            {/* Email */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-12 rounded-full" />
              <Skeleton className="h-3.5 w-40 rounded-full" />
            </div>
            {/* Address */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-36 rounded-full" />
            </div>
          </div>
        </div>

        {/* Inset vertical divider */}
        <div className="hidden md:block my-spacing-3 w-px bg-[#E4E7EC]" />

        {/* COLUMN 2: About */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Urgency */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-9 w-[160px] rounded-2" />
            </div>
            {/* Status */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-14 rounded-full" />
              <Skeleton className="h-9 w-[160px] rounded-2" />
            </div>
            {/* Type */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-10 rounded-full" />
              <Skeleton className="h-9 w-[160px] rounded-2" />
            </div>
            {/* Timeframe */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-9 w-[160px] rounded-2" />
            </div>
          </div>
        </div>

        {/* Inset vertical divider */}
        <div className="hidden md:block my-spacing-3 w-px bg-[#E4E7EC]" />

        {/* COLUMN 3: Highlights */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Online */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-14 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            {/* Contacted */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-20 rounded-full" />
              <div className="flex items-center gap-spacing-2">
                <Skeleton className="h-3.5 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
              </div>
            </div>
            {/* Login */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-12 rounded-full" />
              <div className="flex items-center gap-spacing-2">
                <Skeleton className="h-3.5 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
              </div>
            </div>
            {/* IP */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <Skeleton className="h-3 w-6 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
