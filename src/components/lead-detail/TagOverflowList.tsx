import { useState, useRef, useLayoutEffect } from 'react';
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

export type TagVariant = 'communication' | 'behavior' | 'live';

export interface TagItem {
  label: string;
  icon?: React.ElementType;
  variant: TagVariant;
  description?: string;
}

interface TagOverflowListProps {
  tags: TagItem[];
}

export function TagOverflowList({ tags }: TagOverflowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureFit = () => {
      const containerWidth = container.offsetWidth;
      // Reserve space for the overflow button + gap
      const reservedForOverflow = 44; // w-7 (28px) + gap (8px) + buffer
      const availableWidth = containerWidth - reservedForOverflow;

      const tagElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-tag]')
      );
      let totalWidth = 0;
      let count = 0;
      const gap = 8; // gap-spacing-2

      for (let i = 0; i < tagElements.length; i++) {
        const width = tagElements[i].offsetWidth;
        totalWidth += width + (i > 0 ? gap : 0);
        if (totalWidth > availableWidth) break;
        count++;
      }

      // If all tags fit without the overflow button, show all
      const totalWithoutReserve =
        tagElements.reduce((sum, el, i) => sum + el.offsetWidth + (i > 0 ? gap : 0), 0);
      if (totalWithoutReserve <= containerWidth) {
        setVisibleCount(tagElements.length);
      } else {
        setVisibleCount(count);
      }
    };

    measureFit();

    const ro = new ResizeObserver(measureFit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [tags]);

  const overflowTags = tags.slice(visibleCount);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-spacing-2 flex-nowrap overflow-hidden"
    >
      {tags.map((tag, i) => {
        const Icon = tag.icon;
        const isHidden = i >= visibleCount;
        return (
          <div
            key={`${tag.label}-${i}`}
            data-tag
            style={isHidden ? { visibility: 'hidden', position: 'absolute', pointerEvents: 'none' } : undefined}
          >
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
              className="h-7 w-7 inline-flex items-center justify-center rounded-1 bg-[#F2F4F7] hover:bg-[#E4E7EC] text-[#101828] transition shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 bg-white border border-[#E4E7EC] rounded-1 shadow-md">
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
  );
}
