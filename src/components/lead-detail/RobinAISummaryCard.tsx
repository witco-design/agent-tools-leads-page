import { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const SUMMARY_TEXT =
  'Camille has been actively searching for properties with 14 visits over the past 2 weeks.';
const NEXT_STEP_TEXT =
  "Consider sending a personalized text within the next 24 hours. Camille's recent engagement (14 visits, 3 favorited properties) suggests strong interest worth nurturing before momentum fades.";

export function RobinAISummaryCard() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayBtnRef = useRef<HTMLButtonElement>(null);
  const [hasShimmered, setHasShimmered] = useState(false);
  const observerFiredRef = useRef(false);

  useEffect(() => {
    if (!displayBtnRef.current || observerFiredRef.current) return;
    let delayTimer: ReturnType<typeof setTimeout>;
    let cleanupTimer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observerFiredRef.current) {
          observerFiredRef.current = true;
          delayTimer = setTimeout(() => {
            setHasShimmered(true);
            cleanupTimer = setTimeout(() => setHasShimmered(false), 1400);
          }, 400);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(displayBtnRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  const handleDisplayClick = () => {
    setHasRevealed(true);
    setIsExpanded(true);
  };

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
    >
      <div data-component="GeekAIInsightsCard" className="bg-[#ebeaff] border border-[#c3c0f1] rounded-3 shadow-[0_4px_12px_rgba(116,110,192,0.10)] overflow-hidden">

        {/* Header */}
        <div className="pl-spacing-5 pr-spacing-2 py-spacing-2 flex items-center justify-between gap-spacing-3">
          <div className="flex items-center gap-spacing-2 min-w-0">
            <Sparkles className="w-5 h-5 text-[#746ec0] shrink-0" />
            <h2 className="text-base font-semibold text-text-default truncate">
              Geek AI Insights
            </h2>
          </div>

          <div className="flex items-center gap-spacing-3 shrink-0">
            {!hasRevealed && (
              <button
                ref={displayBtnRef}
                type="button"
                onClick={handleDisplayClick}
                className={`relative overflow-hidden h-8 px-spacing-3 inline-flex items-center bg-[#ebeaff] hover:bg-[#ebeaff]/60 border border-[#c3c0f1] text-[#2d2684] rounded-1 text-text-3 font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2${hasShimmered ? ' shimmer-active' : ''}`}
              >
                Display Summary
              </button>
            )}

            {hasRevealed && (
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  aria-label={isExpanded ? 'Collapse insights' : 'Expand insights'}
                  className="text-[#475467] hover:text-[#101828] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>

        {/* Body */}
        {hasRevealed && (
          <CollapsibleContent>
            <div className="border-t border-purple-30 opacity-50" />
            <div className="px-spacing-5 py-spacing-4">
              <div className="text-text-4 text-text-default leading-relaxed space-y-spacing-3">
                <p>{SUMMARY_TEXT}</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-60 mb-spacing-2">
                    Your Next Step
                  </p>
                  <p>{NEXT_STEP_TEXT}</p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        )}

      </div>
    </Collapsible>
  );
}
