import { useState, useEffect, useRef } from 'react';
import { Sparkles, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PinnedFloatingDialog } from '@/components/PinnedFloatingDialog';

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

  const [dialogOpen, setDialogOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  /**
   * PROTECTED — Measures whether the AI insight content overflows 200px
   * to decide whether the fade gradient renders.
   *
   * Must run AFTER isGenerating flips to false — otherwise the ref
   * measures the skeleton, not the real content.
   */
  useEffect(() => {
    if (!scrollRef.current || isGenerating) return;
    const el = scrollRef.current;
    setIsScrollable(el.scrollHeight > el.clientHeight);
  }, [isGenerating]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
    setAtBottom(nearBottom);
  };

  return (
    <>
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

        {/**
         * PROTECTED — Standardized card layout for Notes + AI Insights.
         * Content area is a fixed 200px scrollable region with a fade gradient
         * at the bottom (only visible while scrollable + not scrolled to bottom).
         * Expand button sits in a footer strip below the scroll area, aligned right.
         *
         * If the 200px content height needs to change, change it in BOTH cards.
         * The whole point is visual parity between the two.
         */}
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
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="max-h-[200px] overflow-y-auto pr-spacing-3 text-text-3 text-text-default leading-relaxed animate-fade-in"
              >
                <p>{SUMMARY_TEXT}</p>
                <p className="mt-spacing-3 text-xs font-semibold uppercase tracking-wide text-purple-60">
                  Your Next Step
                </p>
                <p className="mt-spacing-2">{NEXT_STEP_TEXT}</p>
              </div>
              {isScrollable && !atBottom && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, #f6f6ff, transparent)' }}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer with Expand */}
        {!isGenerating && (
          <div className="flex justify-end px-spacing-5 pb-spacing-4 pt-spacing-2">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className={cn(
                'inline-flex items-center gap-spacing-1 text-text-3 font-normal underline hover:no-underline transition rounded-1',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'text-purple-110 hover:text-purple-120 focus-visible:ring-purple-60',
              )}
            >
              <Expand className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Expand</span>
            </button>
          </div>
        )}
      </div>

      {/* Pinned floating dialog — full AI insights view */}
      <PinnedFloatingDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Geek AI Insights"
        icon={<Sparkles className="w-4 h-4 text-purple-100" aria-hidden="true" />}
        accentColor="purple"
      >
        <p>{SUMMARY_TEXT}</p>
        <p className="mt-spacing-4 text-text-2 font-semibold text-purple-110 uppercase tracking-wide">
          YOUR NEXT STEP
        </p>
        <p className="mt-spacing-2">{NEXT_STEP_TEXT}</p>
      </PinnedFloatingDialog>
    </>
  );
}
