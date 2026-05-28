import { CollapsibleCard } from './CollapsibleCard';
import { useActivityFilter } from './ActivityFilterContext';

const stats = [
  { label: 'Searches', value: '3' },
  { label: 'Visits', value: '20' },
  { label: 'Prop Views', value: '10' },
  { label: 'Saved Searches', value: '10' },
  { label: 'Favorites', value: '5' },
  { label: 'Contact Emails', value: '6' },
  { label: 'Email Updates', value: '4' },
];

export function ActivityStatsCard() {
  const { activeFilter, toggleFilter } = useActivityFilter();

  return (
    <CollapsibleCard title="Activity Stats">
      <div className="space-y-spacing-1">
        {stats.map((s) => {
          const isActive = activeFilter === s.label;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => toggleFilter(s.label)}
              className={`w-full flex items-center justify-between py-spacing-1 px-spacing-3 -mx-spacing-3 rounded-2 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-30 border-l-2 border-blue-110 -ml-spacing-3 pl-spacing-3'
                  : 'hover:bg-gray-30'
              }`}
            >
              <span
                className={`text-text-3 font-normal ${
                  isActive ? 'text-blue-110' : 'text-text-secondary'
                }`}
              >
                {s.label}
              </span>
              <span
                className={`text-text-3 font-semibold ${
                  isActive ? 'text-blue-110' : 'text-text-default'
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
