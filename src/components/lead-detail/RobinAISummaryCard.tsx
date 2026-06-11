import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Loader2, RotateCw, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTypewriter } from '@/hooks/useTypewriter';

/* ── Static content (prototype) ── */
const SUMMARY_TEXT =
  'Camille has been actively searching for properties with 14 visits over the past 2 weeks.';
const NEXT_STEP_TEXT =
  "Consider sending a personalized text within the next 24 hours. Camille's recent engagement (14 visits, 3 favorited properties) suggests strong interest worth nurturing before momentum fades.";

/** Simulated delay before the typewriter kicks in (ms) */
const GENERATION_LEAD_TIME = 1200;

/** Format a Date as relative-to-now string */
function formatRelativeTime(date: Date | null): string {
  if (!date) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

/* ── Typewriter body (keyed separately so it remounts on regeneration) ── */
function TypewriterBody({ onComplete }: { onComplete: () => void }) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), GENERATION_LEAD_TIME);
    return () => clearTimeout(timer);
  }, []);

  const summary = useTypewriter({
    text: SUMMARY_TEXT,
    speed: 25,
    enabled: !showSkeleton,
  });

  const nextStep = useTypewriter({
    text: NEXT_STEP_TEXT,
    speed: 25,
    startDelay: 300,
    enabled: summary.isComplete,
  });

  useEffect(() => {
    if (nextStep.isComplete) {
      onComplete();
    }
  }, [nextStep.isComplete, onComplete]);

  if (showSkeleton) {
    return (
      <div className="space-y-spacing-3">
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-purple-20 rounded animate-pulse" />
          <div className="h-3.5 w-[85%] bg-purple-20 rounded animate-pulse" />
          <div className="h-3.5 w-[60%] bg-purple-20 rounded animate-pulse" />
        </div>
        <div>
          <div className="h-3.5 w-28 bg-purple-20 rounded animate-pulse mb-1.5" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-purple-20 rounded animate-pulse" />
            <div className="h-3.5 w-[75%] bg-purple-20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text-4 text-text-default leading-relaxed space-y-spacing-3">
      <p>
        {summary.displayed}
        {!summary.isComplete && (
          <span className="inline-block w-[2px] h-3.5 bg-purple-60 ml-0.5 align-middle animate-blink" />
        )}
      </p>

      {summary.isComplete && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-60 mb-spacing-2">
            Next Suggested Step
          </p>
          <p>
            {nextStep.displayed}
            {!nextStep.isComplete && (
              <span className="inline-block w-[2px] h-3.5 bg-purple-60 ml-0.5 align-middle animate-blink" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Static body (after generation complete) ── */
function StaticBody() {
  return (
    <div className="text-text-4 text-text-default leading-relaxed space-y-spacing-3">
      <p>{SUMMARY_TEXT}</p>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-60 mb-spacing-2">
          Next Suggested Step
        </p>
        <p>{NEXT_STEP_TEXT}</p>
      </div>
    </div>
  );
}

/* ── Main card ── */
export function RobinAISummaryCard() {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState('');

  /** Bumped each time we (re)generate — used as key on TypewriterBody to remount it fresh */
  const [genKey, setGenKey] = useState(0);

  /** One-time shimmer on viewport entry */
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const [hasShimmered, setHasShimmered] = useState(false);
  const observerFiredRef = useRef(false);

  /* ── Refresh the relative timestamp every 30s ── */
  useEffect(() => {
    if (!generatedAt) return;
    setRelativeTime(formatRelativeTime(generatedAt));
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(generatedAt));
    }, 30_000);
    return () => clearInterval(interval);
  }, [generatedAt]);

  /* ── Shimmer on viewport entry (one-time, pure gradient overlay) ── */
  useEffect(() => {
    if (!generateBtnRef.current || observerFiredRef.current) return;
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
    observer.observe(generateBtnRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  /* ── Generation complete callback (called by TypewriterBody) ── */
  const handleGenerationComplete = useCallback(() => {
    setIsGenerating(false);
    setHasGenerated(true);
    setGeneratedAt(new Date());
  }, []);

  /* ── Generate / Regenerate handler ── */
  const handleGenerate = useCallback(() => {
    setGenKey((k) => k + 1);
    setIsGenerating(true);
    setIsExpanded(true);
    setHasGenerated(false);
  }, []);

  /* ── Collapsible open state ── */
  const isOpen = isGenerating || isExpanded;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        if (!isGenerating) setIsExpanded(open);
      }}
    >
      <div data-component="RobinAISummaryCard" className="bg-[#dedcff] border border-[#c3c0f1] rounded-3 shadow-[0_4px_12px_rgba(116,110,192,0.10)] overflow-hidden">

        {/* ── Header ── */}
        <div className="pl-spacing-5 pr-spacing-2 py-spacing-2 flex items-center justify-between gap-spacing-3">

          {/* Left: icon + title */}
          <div className="flex items-center gap-spacing-2 min-w-0">
            <Sparkles className="w-5 h-5 text-[#746ec0] shrink-0" />
            <h2 className="text-base font-semibold text-text-default truncate">
              Robin AI Summary
            </h2>
          </div>

          {/* Right: variable affordances per state */}
          <div className="flex items-center gap-spacing-3 shrink-0">

            {/* STATE A: Not generated → Generate button */}
            {!hasGenerated && !isGenerating && (
              <button
                ref={generateBtnRef}
                type="button"
                onClick={handleGenerate}
                className={`relative overflow-hidden h-9 px-spacing-4 inline-flex items-center bg-[#ebeaff] hover:bg-[#ebeaff]/60 border border-[#c3c0f1] text-[#2d2684] rounded-1 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2${hasShimmered ? ' shimmer-active' : ''}`}
              >
                Generate Summary
              </button>
            )}

            {/* STATE B: Generating → disabled spinner button */}
            {isGenerating && (
              <button
                type="button"
                disabled
                className="h-9 px-spacing-4 inline-flex items-center gap-spacing-2 bg-[#746ec0] opacity-60 text-white rounded-1 text-sm font-medium cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </button>
            )}

            {/* STATE C / D: Generated → timestamp + Regenerate + chevron */}
            {hasGenerated && !isGenerating && (
              <>
                <time
                  dateTime={generatedAt?.toISOString()}
                  className="text-sm text-[#344054] hidden sm:inline"
                >
                  Generated {relativeTime}
                </time>
                <button
                  type="button"
                  onClick={handleGenerate}
                  aria-label="Regenerate summary"
                  className="text-sm font-medium text-[#322b95] hover:text-[#2d2684] transition inline-flex items-center gap-spacing-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1"
                >
                  <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                  Regenerate
                </button>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse summary' : 'Expand summary'}
                    className="text-[#475467] hover:text-[#101828] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </>
            )}

          </div>
        </div>

        {/* ── Body — collapsible ── */}
        <CollapsibleContent>
          <div className="border-t border-purple-30 opacity-50" />
          <div className="px-spacing-5 py-spacing-4" aria-live="polite">
            {isGenerating && (
              <TypewriterBody key={genKey} onComplete={handleGenerationComplete} />
            )}
            {hasGenerated && !isGenerating && <StaticBody />}
          </div>
        </CollapsibleContent>

      </div>
    </Collapsible>
  );
}
