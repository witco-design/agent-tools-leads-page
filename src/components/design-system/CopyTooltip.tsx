import { useState, useRef, useEffect } from 'react';

interface CopyTooltipProps {
  tokenPath: string;
  resolvedValue: string;
  tailwindClass: string;
  children: React.ReactNode;
  onCopy: (text: string) => void;
}

export function CopyTooltip({ tokenPath, resolvedValue, tailwindClass, children, onCopy }: CopyTooltipProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [show]);

  const handleCopy = () => {
    onCopy(tailwindClass);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => { setShow(false); setCopied(false); }}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-bg-canvas rounded-2 shadow-lg border border-border-default px-spacing-3 py-spacing-2 pointer-events-auto"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)',
          }}
          onClick={handleCopy}
        >
          <div className="text-text-2 font-semibold text-text-default whitespace-nowrap">{tokenPath}</div>
          <div className="text-text-1 text-text-muted whitespace-nowrap">{resolvedValue}</div>
          <button
            className="mt-1 text-text-1 font-semibold text-brand-primary hover:text-brand-primary-hover cursor-pointer whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
          >
            {copied ? 'Copied!' : `Copy: ${tailwindClass}`}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-bg-canvas" />
        </div>
      )}
    </div>
  );
}
