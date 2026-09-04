import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';
import { Star } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TruncatedText } from './TruncatedText';
import { ChannelIcon } from './ChannelIcon';

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
              Last Login
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>14 days ago</TruncatedText>
              <ChannelIcon channel="website" />
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
          <div className="grid grid-cols-[100px_1fr] gap-spacing-2 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary">
              Last Saved Search
            </span>
            <div className="min-w-0">
              <p className="text-text-3 font-normal text-text-default">
                3BR townhomes · San Jose · $650–750K
              </p>
              <p className="text-text-3 font-normal text-text-secondary mt-0.5">
                Saved Nov 10
              </p>
            </div>
          </div>

        </div>
        )}
      </CollapsibleCard>
    </TooltipProvider>
  );
}
