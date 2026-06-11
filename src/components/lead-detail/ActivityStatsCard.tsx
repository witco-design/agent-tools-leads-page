import { CollapsibleCard } from './CollapsibleCard';
import { useActivityFilter } from './ActivityFilterContext';

/** Each stat row maps to a content-filter category key */
const stats = [
  { label: 'Searches', value: '3', filterKey: 'searches' },
  { label: 'Visits', value: '20', filterKey: 'properties' },
  { label: 'Prop Views', value: '10', filterKey: 'properties' },
  { label: 'Saved Searches', value: '10', filterKey: 'searches' },
  { label: 'Favorites', value: '5', filterKey: 'favorites' },
  { label: 'Contact Emails', value: '6', filterKey: 'email' },
];

export function ActivityStatsCard() {
  const { activeFilter, toggleFilter } = useActivityFilter();

  return (
    <CollapsibleCard data-component="ActivityStatsCard" title="Activity Stats">
      <div className="space-y-spacing-1">
        {stats.map((s) => {
          const isActive = activeFilter === s.filterKey;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => toggleFilter(s.filterKey)}
              className={`w-full flex items-center justify-between py-spacing-1 rounded-1 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#ebf8ff] text-[#3E60C9]'
                  : 'hover:bg-[#f5fcff]'
              }`}
            >
              <span
                className={`text-text-4 ${
                  isActive ? 'font-semibold text-[#3E60C9]' : 'font-normal text-text-secondary'
                }`}
              >
                {s.label}
              </span>
              <span
                className={`text-text-4 font-semibold ${
                  isActive ? 'text-[#3E60C9]' : 'text-text-default'
                }`}
              >
                {s.value}
              </span>
            </button>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}
