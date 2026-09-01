import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';
import { ChartBar as BarChart3 } from 'lucide-react';

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
      {emptyMode ? (
        <EmptyState
          icon={BarChart3}
          title="No activity stats yet"
          subtitle="Searches, visits, and property views will appear here as the lead engages with the website."
        />
      ) : (
      <div className="space-y-spacing-1">
        {/* INTENTIONAL: rows are display-only. Do not add onClick, hover, or selected-state styling.
            Feed-filter coupling was explicitly removed. Use the feed toolbar filter pill instead. */}
        {stats.map((s) => (
          <div
            key={s.label}
            className="w-full flex items-center justify-between py-spacing-1"
          >
            <span className="text-text-3 font-normal text-text-secondary">{s.label}</span>
            <span className="text-text-3 font-semibold text-text-default">{s.value}</span>
          </div>
        ))}
      </div>
      )}
    </CollapsibleCard>
  );
}
