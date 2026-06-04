import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { TagItem } from './TagOverflowList';
import { SIGNALS } from './LeadSignalsStrip';

const MAX_VISIBLE = 4;

export function LeadSignalTagsCard() {
  const visibleTags = SIGNALS.slice(0, MAX_VISIBLE);
  const overflowTags = SIGNALS.slice(MAX_VISIBLE);

  return (
    <div className="bg-white border border-border-default rounded-3 shadow-sm p-spacing-3">
      <div className="flex items-center gap-spacing-2 flex-wrap">
        {visibleTags.map((tag, i) => {
          const Icon = tag.icon;
          return (
            <div key={`${tag.label}-${i}`}>
              {tag.description ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge
                        variant={tag.variant}
                        className="whitespace-nowrap cursor-help"
                        tabIndex={0}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {tag.label}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {tag.description}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Badge variant={tag.variant} className="whitespace-nowrap">
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {tag.label}
                </Badge>
              )}
            </div>
          );
        })}

        {overflowTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`Show ${overflowTags.length} more tags`}
                className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E4E7EC] text-[#101828] transition shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-white border border-[#E4E7EC] rounded-2 shadow-md">
              <div className="flex flex-col gap-2">
                {overflowTags.map((tag, i) => {
                  const Icon = tag.icon;
                  return (
                    <div key={`overflow-${tag.label}-${i}`}>
                      {tag.description ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Badge
                                variant={tag.variant}
                                className="self-start whitespace-nowrap cursor-help"
                                tabIndex={0}
                              >
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                {tag.label}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {tag.description}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge
                          variant={tag.variant}
                          className="self-start whitespace-nowrap"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {tag.label}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
