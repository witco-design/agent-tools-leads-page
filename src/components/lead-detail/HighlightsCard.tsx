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
      <CollapsibleCard id="highlights" data-component="HighlightsCard" title="Highlights">
        {emptyMode ? (
          <EmptyState
            icon={Star}
            title="Nothing to highlight yet"
            subtitle="Key milestones and lead details will surface here."
          />
        ) : (
        <div>
          <div className="flex items-center px-spacing-5 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Lead Created
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Aug 4, 10:46am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center px-spacing-5 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Email Update
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Dec 8, 11:49am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center px-spacing-5 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Login
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>14 days ago</TruncatedText>
              <ChannelIcon channel="website" />
            </span>
          </div>
          <div className="flex items-center px-spacing-5 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              IP Location
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>San Jose, CA</TruncatedText>
            </span>
          </div>
          <div className="flex items-center px-spacing-5 py-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Avg. Price
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>$750,000</TruncatedText>
            </span>
          </div>
        </div>
        )}
      </CollapsibleCard>
    </TooltipProvider>
  );
}
