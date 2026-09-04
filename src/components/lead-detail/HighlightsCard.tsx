import { CollapsibleCard } from './CollapsibleCard';
import { useVersion } from '@/contexts/VersionContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TruncatedText } from './TruncatedText';


export function HighlightsCard() {
  const { emptyMode } = useVersion();
  const rows = [
    { label: 'Last Email Update', value: 'Dec 8, 11:49am' },
    { label: 'Avg. Price', value: '$750,000' },
    { label: 'Area', value: 'San Jose, CA' },
  ];
  return (
    <TooltipProvider delayDuration={200}>
      <CollapsibleCard id="highlights" data-component="HighlightsCard" title="Search Insights">
        <div>
          {rows.map((r) => (
            <div key={r.label} className="flex items-center py-spacing-2">
              <span className="text-text-3 font-normal text-text-secondary flex-1">
                {r.label}
              </span>
              <span className="text-text-3 font-normal text-text-muted min-w-0">
                {emptyMode ? '—' : <TruncatedText>{r.value}</TruncatedText>}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleCard>
    </TooltipProvider>
  );
}
