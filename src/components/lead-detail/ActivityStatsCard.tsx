import { CollapsibleCard } from './CollapsibleCard';
import { useVersion } from '@/contexts/VersionContext';

const stats = [
  { label: 'Searches', value: '3' },
  { label: 'Visits', value: '20' },
  { label: 'Prop Views', value: '10' },
  { label: 'Saved Searches', value: '10' },
  { label: 'Favorites', value: '5' },
  { label: 'Contact Emails', value: '6' },
];

export function ActivityStatsCard() {
  const { emptyMode } = useVersion();
  return (
    <CollapsibleCard data-component="ActivityStatsCard" title="Activity Stats">
      <div>
        {/* INTENTIONAL: rows are display-only. Do not add onClick, hover, or selected-state styling.
            Feed-filter coupling was explicitly removed. Use the feed toolbar filter pill instead. */}
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center py-spacing-2"
          >
            <span className="text-text-3 font-normal text-text-secondary flex-1">{s.label}</span>
            <span className="text-text-3 font-semibold text-text-muted min-w-0">{emptyMode ? '—' : s.value}</span>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}
