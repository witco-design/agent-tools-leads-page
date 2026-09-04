import { useState } from 'react';
import { ChevronDown, Info, GripVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDragHandle } from './DragHandleContext';

interface CollapsibleCardProps {
  id?: string;
  'data-component'?: string;
  title: string;
  countBadge?: number;
  showInfoIcon?: boolean;
  /** Tooltip text for a standalone (i) button next to the title. Takes precedence over showInfoIcon. */
  infoTooltip?: string;
  /** Custom info slot rendered after the title (e.g. a HoverCard trigger). Takes precedence over showInfoIcon and infoTooltip. */
  infoSlot?: React.ReactNode;
  rightAction?: React.ReactNode;
  /** Persistent action rendered right after the title/info cluster (always visible, like "Edit"). */
  titleAction?: React.ReactNode;
  /** Persistent action rendered just before the collapse chevron (always visible). */
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleCard({
  id,
  'data-component': dataComponent,
  title,
  countBadge,
  showInfoIcon,
  infoTooltip,
  infoSlot,
  rightAction,
  titleAction,
  headerAction,
  footer,
  defaultOpen = true,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { attributes, listeners } = useDragHandle();

  return (
    <TooltipProvider delayDuration={200}>
      <div id={id} data-component={dataComponent} className="bg-bg-card rounded-3 border border-border-default overflow-hidden group">
        {/* Header */}
        <div className={`w-full flex items-center px-spacing-5 py-spacing-3 hover:bg-bg-muted/50 transition-colors ${open ? 'border-b border-border-default' : ''}`}>
          {/* Drag handle — flush left by default, slides in on hover */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="inline-flex items-center justify-center w-0 mr-0 opacity-0 overflow-hidden cursor-grab
                           group-hover:w-4 group-hover:mr-spacing-2 group-hover:opacity-100
                           transition-all duration-200 ease-out shrink-0"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-4 h-4 text-gray-70 shrink-0" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>

          <button
            type="button"
            className="flex items-center cursor-pointer bg-transparent border-none p-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            <h3 className="text-text-4 font-semibold text-text-default">{title}</h3>
            {!infoSlot && !infoTooltip && showInfoIcon && (
              <Info className="w-3.5 h-3.5 ml-spacing-2 text-icon-default" />
            )}
            {countBadge !== undefined && countBadge > 0 && (
              <span className="ml-spacing-2 inline-flex items-center justify-center min-w-[20px] h-5 px-spacing-1 rounded-round bg-[#ebf8ff] text-[#3e60c9] text-xs font-semibold">
                {countBadge}
              </span>
            )}
          </button>
          {!infoSlot && infoTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${title}`}
                  className="ml-spacing-2 inline-flex items-center justify-center cursor-help bg-transparent border-none p-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-round"
                >
                  <Info className="w-3.5 h-3.5 text-icon-default" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {infoSlot && (
            <div className="ml-spacing-2 shrink-0">
              {infoSlot}
            </div>
          )}
          {titleAction && (
            <div className="ml-spacing-3 shrink-0">
              {titleAction}
            </div>
          )}
          {rightAction && (
            <div className="ml-spacing-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              {rightAction}
            </div>
          )}
          <div className="flex-1" />
          {headerAction && (
            <div className="mr-spacing-2 shrink-0">{headerAction}</div>
          )}
          <button
            type="button"
            data-collapse-toggle
            className="cursor-pointer bg-transparent border-none p-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            <ChevronDown
              className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Body */}
        {open && <div data-collapse-body className="px-spacing-5 py-spacing-4">{children}</div>}

        {/* Footer */}
        {open && footer && (
          <div className="px-spacing-5 py-spacing-4 border-t border-border-default">
            {footer}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
