import { CollapsibleCard } from './CollapsibleCard';

const stats = [
  { label: 'Searches', value: '3' },
  { label: 'Visits', value: '20' },
  { label: 'Prop Views', value: '10' },
  { label: 'Saved Searches', value: '10' },
  { label: 'Favorites', value: '5' },
  { label: 'Contact Emails', value: '6' },
];

export function ActivityStatsCard() {
  return (
    <CollapsibleCard data-component="ActivityStatsCard" title="Activity Stats">
      <div className="space-y-spacing-1">
        {/* INTENTIONAL: rows are display-only. Do not add onClick, hover, or selected-state styling.
            Feed-filter coupling was explicitly removed. Use the feed toolbar filter pill instead. */}
        {stats.map((s) => (
          <div
            key={s.label}
            className="w-full flex items-center justify-between py-spacing-1"
          >
            <span className="text-text-4 font-normal text-text-secondary">{s.label}</span>
            <span className="text-text-4 font-semibold text-text-default">{s.value}</span>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}
