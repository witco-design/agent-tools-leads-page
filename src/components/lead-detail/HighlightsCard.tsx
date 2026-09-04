import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';
import { Star } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TruncatedText } from './TruncatedText';


export function HighlightsCard() {
  const { emptyMode } = useVersion();
  return (
    <TooltipProvider delayDuration={200}>
      <CollapsibleCard id="highlights" data-component="HighlightsCard" title="Search Insights">
        {emptyMode ? (
          <EmptyState
            icon={Star}
            title="Nothing to highlight yet"
            subtitle="Key milestones and lead details will surface here."
          />
        ) : (
        <div>
          <div className="flex items-center py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Lead Created
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Aug 4, 10:46am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Email Update
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Dec 8, 11:49am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Avg. Price
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>$750,000</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Saved Search
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Nov 10</TruncatedText>
            </span>
          </div>

        </div>
        )}
      </CollapsibleCard>
    </TooltipProvider>
  );
}
