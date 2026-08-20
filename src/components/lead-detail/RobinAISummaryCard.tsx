import { useState, useEffect, useRef } from 'react';
import { Sparkles, Expand, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PinnedFloatingDialog } from '@/components/PinnedFloatingDialog';
import { useLeadActions } from './LeadActionsContext';

const SUMMARY_TEXT =
  'Camille is a high-intent first-time buyer: 14 visits and 3 favorites in 2 weeks, with a lender Letter of Intent in hand. Her spouse\'s new Google role adds urgency to close before year-end.';
const NEXT_STEPS_TEXT =
  "She's online right now and has asked for curated 3BR townhomes and Saturday showings. Engagement is peaking, so reach out today while she's active, lead with listings that match her criteria, and lock in showings before momentum fades.";

interface InsightPair {
  why: string;
  action: { label: string; detail: string; timing: string; now?: boolean };
}

const INSIGHT_PAIRS: InsightPair[] = [
  {
    why: "She's online right now",
    action: { label: 'Chat', detail: ' with Camille', timing: 'Now', now: true },
  },
  {
    why: 'Keeps momentum before it fades',
    action: { label: 'Text', detail: ' a personalized note', timing: '24h' },
  },
  {
    why: 'She asked for 3BR townhomes in her budget',
    action: { label: 'Email', detail: ' curated listings, $650-750K', timing: 'Today' },
  },
  {
    why: 'She wants Saturday showings',
    action: { label: 'Call', detail: ' to schedule showings', timing: 'This week' },
  },
];

const RECOMMENDED_ACTIONS = INSIGHT_PAIRS.map((p) => ({ ...p.action }));

const LINK_CLASS =
  'text-blue-100 underline hover:no-underline font-medium cursor-pointer bg-transparent border-none p-0';
const LABEL_CLASS =
  'text-text-2 font-semibold uppercase tracking-wide text-purple-100';

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

  const [collapsed, setCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const { openAction } = useLeadActions();

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
      {/**
       * PROTECTED — Geek AI Insights card structure.
       *
       * Matches Important Notes card pattern:
       *   - White outer card (bg-white, border, rounded)
       *   - Header (white bg, sparkle icon + title + collapse chevron)
       *   - Tinted inner content area (bg-purple-10, rounded, padded)
       *   - Shimmer skeleton renders inside the tinted area while isGenerating
       *   - Real content replaces shimmer after generation completes
       *   - Fade gradient at bottom of scroll (only when scrollable + not at bottom)
       *   - Expand button in bottom-right, HOVER-ONLY visibility (opacity-0 group-hover:opacity-100)
       *
       * Do NOT put purple background on the outer card — the whole point is that
       * chrome stays neutral (white) and color lives inside the tinted area.
       *
       * Do NOT add an Edit button to the header — AI content is not user-editable.
       * Only the collapse chevron sits on the right side of the header.
       *
       * Do NOT make Expand always-visible — hover-only matches Important Notes.
       */}
      <div data-component="GeekAIInsightsCard" className="bg-white border border-border-default rounded-3 overflow-hidden">
        {/* Header — matches CollapsibleCard header padding/height */}
        <div className={`flex items-center justify-between px-spacing-5 py-spacing-3 ${!collapsed ? 'border-b border-border-default' : ''}`}>
          <div className="flex items-center gap-spacing-2">
            <Sparkles className="w-4 h-4 text-purple-100 shrink-0" aria-hidden="true" />
            <h3 className="text-text-4 font-semibold text-text-default">Geek AI Insights</h3>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand card' : 'Collapse card'}
            className="cursor-pointer bg-transparent border-none p-0"
          >
            <ChevronDown
              className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${!collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Collapsible content */}
        {!collapsed && (
          <div className="px-spacing-5 py-spacing-4">
            {/* Tinted inner content area — purple bg */}
            <div className="relative rounded-1 bg-purple-10 p-spacing-3 group">
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
                  ref={scrollRef}
                  className="text-text-3 text-text-default leading-relaxed animate-fade-in"
                >
                  {/* Full-width summary lead */}
                  <p>{SUMMARY_TEXT}</p>

                  {/* Paired two-column grid — each row = one reason + its action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-spacing-4 gap-y-spacing-2 items-start pt-spacing-3">
                    <div className={`${LABEL_CLASS} hidden md:block`}>WHY</div>
                    <div className={`${LABEL_CLASS} hidden md:block`}>RECOMMENDED ACTIONS</div>

                    {INSIGHT_PAIRS.map((pair) => (
                      <div key={pair.action.label} className="contents">
                        {/* Why */}
                        <div className="flex items-start gap-spacing-2 text-text-3 text-text-default">
                          <span className="w-1.5 h-1.5 rounded-round bg-purple-100 shrink-0 mt-[7px]" />
                          {pair.why}
                        </div>

                        {/* Action */}
                        <div className="flex items-start justify-between gap-spacing-2">
                          <span className="flex items-start gap-spacing-2 text-text-3 text-text-default">
                            <Check className="w-4 h-4 text-green-100 shrink-0 mt-[2px]" aria-hidden="true" />
                            <span>
                              <button
                                type="button"
                                onClick={() => openAction(pair.action.label)}
                                className={LINK_CLASS}
                              >
                                {pair.action.label}
                              </button>
                              {pair.action.detail}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'shrink-0 text-text-1 font-medium px-spacing-2 py-[2px] rounded-round',
                              pair.action.now ? 'bg-green-20 text-green-110' : 'bg-purple-20 text-purple-120',
                            )}
                          >
                            {pair.action.timing}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/**
               * PROTECTED — Hover Expand affordance.
               * Icon-only on hover (no text label). Native tooltip via title="Expand".
               * aria-label preserves accessibility for screen readers.
               *
               * Do NOT add a text label back — the pattern is intentionally minimal.
               * If discoverability becomes an issue in user testing, add a Radix Tooltip
               * with 400ms delay rather than an always-visible label.
               */}
              {!isGenerating && (
                <div className="absolute bottom-spacing-2 right-spacing-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    title="Expand"
                    aria-label="Expand"
                    className={cn(
                      'inline-flex items-center justify-center p-1 rounded-1 transition',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      'text-purple-110 hover:text-purple-120 hover:bg-purple-20/50 focus-visible:ring-purple-60',
                    )}
                  >
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
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
          NEXT STEPS
        </p>
        <p className="mt-spacing-2">{NEXT_STEPS_TEXT}</p>
        <p className="mt-spacing-4 text-text-2 font-semibold text-purple-110 uppercase tracking-wide">
          RECOMMENDED ACTIONS
        </p>
        <ul className="mt-spacing-2 space-y-spacing-2">
          {RECOMMENDED_ACTIONS.map((action) => (
            <li key={action.label} className="flex items-start gap-spacing-2">
              <Check className="w-4 h-4 text-green-100 shrink-0 mt-[2px]" aria-hidden="true" />
              <span>
                <button
                  type="button"
                  onClick={() => openAction(action.label)}
                  className={LINK_CLASS}
                >
                  {action.label}
                </button>
                {action.detail}
              </span>
            </li>
          ))}
        </ul>
      </PinnedFloatingDialog>
    </>
  );
}
