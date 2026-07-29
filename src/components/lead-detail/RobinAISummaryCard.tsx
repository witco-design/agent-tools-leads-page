import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUMMARY_TEXT =
  'Camille has been actively searching for properties with 14 visits over the past 2 weeks.';
const NEXT_STEP_TEXT =
  "Consider sending a personalized text within the next 24 hours. Camille's recent engagement (14 visits, 3 favorited properties) suggests strong interest worth nurturing before momentum fades.";

export function RobinAISummaryCard() {
  /**
   * PROTECTED — AI insight generation shimmer.
   * The 600ms delay simulates the "generating" state so the shimmer registers
   * visually before the content reveals. In production, this state should
   * flip from the actual API response (isLoading from useQuery, etc.),
   * NOT from a setTimeout.
   *
   * Do not remove the shimmer skeleton — it's a signature moment for the
   * Geek AI feature. If you want to reduce the delay, tune the setTimeout
   * duration, don't skip the state.
   */
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * PROTECTED — Measures whether the AI insight content overflows 4 lines
   * to decide whether the Read more link renders. If the content is short
   * enough to fit naturally, isTruncated is false and the link is hidden.
   *
   * Must run AFTER isGenerating flips to false — otherwise the ref
   * measures the skeleton, not the real content.
   */
  useEffect(() => {
    if (!contentRef.current || isGenerating) return;
    const el = contentRef.current;
    setIsTruncated(el.scrollHeight > el.clientHeight);
  }, [isGenerating]);

  return (
    <div data-component="GeekAIInsightsCard" className="bg-[#f6f6ff] border border-[#c3c0f1] rounded-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-spacing-2 px-spacing-5 py-spacing-2">
        <Sparkles className="w-5 h-5 text-[#746ec0] shrink-0" aria-hidden="true" />
        <h2 className="text-base font-semibold text-text-default">
          Geek AI Insights
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-30 opacity-50" />

      {/* Body */}
      <div className="px-spacing-5 py-spacing-4">
        {isGenerating ? (
          <div className="space-y-spacing-3">
            {/* First paragraph — 3 lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-4 w-11/12 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-4 w-3/4 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
            </div>

            {/* YOUR NEXT STEP heading placeholder — narrower bar */}
            <div className="h-3 w-32 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />

            {/* Second paragraph — 2 lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-4 w-4/5 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
            </div>
          </div>
        ) : (
          <div
            ref={contentRef}
            className={cn(
              'text-text-3 text-text-default leading-relaxed animate-fade-in',
              !expanded && 'line-clamp-4',
            )}
          >
            <p>{SUMMARY_TEXT}</p>
            <p className="mt-spacing-3 text-xs font-semibold uppercase tracking-wide text-purple-60">
              Your Next Step
            </p>
            <p className="mt-spacing-2">{NEXT_STEP_TEXT}</p>
          </div>
        )}

        {isTruncated && !isGenerating && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-spacing-2 text-text-3 font-normal text-purple-110 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}
