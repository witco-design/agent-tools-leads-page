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
  title: string;
  countBadge?: number;
  showInfoIcon?: boolean;
  rightAction?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleCard({
  title,
  countBadge,
  showInfoIcon,
  rightAction,
  defaultOpen = true,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { attributes, listeners } = useDragHandle();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-white rounded-3 border border-border-default shadow-sm overflow-hidden group">
        {/* Header */}
        <div className="w-full flex items-center p-spacing-5 hover:bg-bg-muted/50 transition-colors">
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
            {showInfoIcon && (
              <Info className="w-3.5 h-3.5 ml-spacing-2 text-icon-default" />
            )}
            {countBadge !== undefined && (
              <span className="ml-spacing-2 inline-flex items-center px-2 py-0.5 rounded-round bg-gray-40 text-gray-90 text-text-2 font-semibold">
                {countBadge}
              </span>
            )}
          </button>
          {rightAction && (
            <div className="ml-spacing-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              {rightAction}
            </div>
          )}
          <div className="flex-1" />
          <button
            type="button"
            className="cursor-pointer bg-transparent border-none p-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            <ChevronDown
              className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Body */}
        {open && <div className="p-spacing-5 pt-0">{children}</div>}
      </div>
    </TooltipProvider>
  );
}
