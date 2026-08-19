import { CollapsibleCard } from './CollapsibleCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TruncatedText } from './TruncatedText';
import { ChannelIcon } from './ChannelIcon';
import { TIME_ZONE } from './leadConstants';

export function HighlightsCard() {
  return (
    <TooltipProvider delayDuration={200}>
      <CollapsibleCard id="highlights" data-component="HighlightsCard" title="Highlights">
        <div className="space-y-spacing-3">
          <div className="flex items-center justify-between py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary">
              Online Status
            </span>
            <span className="inline-flex items-center gap-spacing-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
              </span>
              <span className="text-text-3 font-normal text-success-text">Online Now</span>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Lead Created
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Aug 4, 10:46am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Contacted
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Nov 5, 2025</TruncatedText>
              <ChannelIcon channel="call" />
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Email Update
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>Dec 8, 11:49am</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Last Login
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>14 days ago</TruncatedText>
              <ChannelIcon channel="website" />
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Location
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>California</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Avg. Price
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>$750,000</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              IP Location
            </span>
            <span className="text-text-3 font-normal text-text-secondary min-w-0">
              <TruncatedText>San Jose, CA</TruncatedText>
            </span>
          </div>
          <div className="flex items-center py-spacing-1">
            <span className="text-text-3 font-normal text-text-secondary flex-1">
              Time Zone
            </span>
            <span className="text-text-3 font-normal text-text-default min-w-0">
              <TruncatedText>{TIME_ZONE}</TruncatedText>
            </span>
          </div>
        </div>
      </CollapsibleCard>
    </TooltipProvider>
  );
}
