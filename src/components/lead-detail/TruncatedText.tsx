import { useRef, useState, useEffect, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TruncatedTextProps {
  children: ReactNode;
  /** The full text to show in the tooltip. If omitted, falls back to children. */
  fullText?: string;
  className?: string;
  /** Number of lines before truncating. 1 = single-line with ellipsis. >1 = line-clamp. */
  lines?: number;
}

export function TruncatedText({
  children,
  fullText,
  className = '',
  lines = 1,
}: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      if (lines === 1) {
        setIsTruncated(el.scrollWidth > el.clientWidth + 1);
      } else {
        setIsTruncated(el.scrollHeight > el.clientHeight + 1);
      }
    };
    check();
    const ro = new ResizeObserver(check);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', check);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', check);
    };
  }, [children, lines]);

  const truncateClasses =
    lines === 1 ? 'truncate block' : 'block overflow-hidden';
  const lineClampStyle =
    lines > 1
      ? ({
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical' as const,
        } as React.CSSProperties)
      : undefined;

  const content = (
    <span
      ref={ref}
      className={`${truncateClasses} ${className}`}
      style={lineClampStyle}
    >
      {children}
    </span>
  );

  if (!isTruncated) return content;

  const tip = fullText ?? (typeof children === 'string' ? children : '');

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="max-w-xs">{tip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
