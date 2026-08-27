import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, ChevronDown, Check } from 'lucide-react';
import { useLeadActions } from './LeadActionsContext';
import { useVersion } from '@/contexts/VersionContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const SUMMARY_TEXT =
  'Camille is a high-intent first-time buyer: 14 visits and 3 favorites in 2 weeks, with a lender Letter of Intent in hand. Her spouse\'s new Google role adds urgency to close before year-end.';

const NEXT_STEP_FIRST_LINE =
  'In 2 days, Geek AI will email Camille a curated list of 3BR townhomes in her budget ($650-750K).';

const NEXT_STEP_REASONS: string[] = [
  'She asked for curated listings and is browsing actively',
  'Email suits a detailed list she can review on her own time',
  'Timed before the weekend so she\'s ready for Saturday showings',
];

const LABEL_CLASS =
  'text-text-2 font-semibold uppercase tracking-wide text-purple-100';

type FeedbackChoice = 'love' | 'needs-work' | null;

function FeedbackModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [choice, setChoice] = useState<FeedbackChoice>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!open) {
      setChoice(null);
      setText('');
    }
  }, [open]);

  const handleSubmit = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How are you enjoying Geek AI Insights?</DialogTitle>
        </DialogHeader>

        <div className="space-y-spacing-4 py-spacing-1">
          <div className="flex gap-spacing-3">
            <button
              type="button"
              onClick={() => setChoice('love')}
              className={`flex-1 h-10 rounded-1 px-spacing-3 text-text-3 font-medium transition-colors cursor-pointer ${
                choice === 'love'
                  ? 'border border-purple-100 bg-purple-10 text-purple-120'
                  : 'border border-border-default text-text-default hover:bg-bg-muted'
              }`}
            >
              <span className="mr-spacing-1">&#128515;</span> Love it
            </button>
            <button
              type="button"
              onClick={() => setChoice('needs-work')}
              className={`flex-1 h-10 rounded-1 px-spacing-3 text-text-3 font-medium transition-colors cursor-pointer ${
                choice === 'needs-work'
                  ? 'border border-purple-100 bg-purple-10 text-purple-120'
                  : 'border border-border-default text-text-default hover:bg-bg-muted'
              }`}
            >
              <span className="mr-spacing-1">&#128533;</span> Needs work
            </button>
          </div>

          <div className="space-y-spacing-1">
            <label
              htmlFor="geek-ai-feedback-text"
              className="text-text-3 text-text-muted"
            >
              Tell us more (optional)
            </label>
            <textarea
              id="geek-ai-feedback-text"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-border-default rounded-1 p-spacing-2 text-text-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-40 focus:border-purple-100"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-8 px-spacing-4 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-8 px-spacing-4 rounded-1 bg-purple-110 text-white text-text-3 font-semibold hover:bg-purple-120 active:bg-purple-120 transition-colors cursor-pointer"
          >
            Submit
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { openAction } = useLeadActions();
  const { version } = useVersion();

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
            <div className="relative rounded-1 bg-purple-10 p-spacing-3">
              {isGenerating ? (
                <div className="text-text-3 leading-relaxed">
                  {/* Summary — 2 lines */}
                  <div className="space-y-2 mb-spacing-3">
                    <div className="h-4 w-full rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
                    <div className="h-4 w-[65%] rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
                  </div>

                  {/* NEXT STEPS label */}
                  <div className="h-3 w-[90px] rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />

                  {/* Action line */}
                  <div className="h-4 w-[85%] rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer mt-spacing-2" />

                  {/* Three checklist rows */}
                  <ul className="space-y-spacing-1 pt-spacing-2">
                    {[['70%'], ['58%'], ['64%']].map(([w], i) => (
                      <li key={i} className="flex items-center gap-spacing-2">
                        <div className="w-4 h-4 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer shrink-0" />
                        <div
                          className="h-3 rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer"
                          style={{ width: w }}
                        />
                      </li>
                    ))}
                  </ul>

                  {/* Feedback link */}
                  <div className="pt-spacing-3">
                    <div className="h-3 w-[170px] rounded-1 bg-gradient-to-r from-purple-20 via-purple-30 to-purple-20 bg-[length:200%_100%] animate-shimmer" />
                  </div>
                </div>
              ) : (
                <div className="text-text-3 text-text-default leading-relaxed animate-fade-in">
                  {/* Full-width summary lead */}
                  <p>{SUMMARY_TEXT}</p>

                  {/* Next Steps — the AI's single next lead touch */}
                  <div className="pt-spacing-3">
                    <div className={LABEL_CLASS}>NEXT STEPS</div>

                    {/* First line + (V2 only) inline Take over link */}
                    <p className="text-text-3 text-text-default leading-relaxed pt-spacing-2">
                      {NEXT_STEP_FIRST_LINE}
                      {version === 'V2' && (
                        <>
                          {' '}
                          <button
                            type="button"
                            onClick={() => openAction('Email')}
                            className="inline font-semibold text-purple-110 hover:text-purple-120 underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-40 rounded-[2px]"
                          >
                            Take over
                          </button>
                        </>
                      )}
                    </p>

                    {/* Three "why" checklist items */}
                    <ul className="space-y-spacing-1 pt-spacing-2">
                      {NEXT_STEP_REASONS.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-spacing-2 text-text-3 text-text-default"
                        >
                          <Check
                            className="w-4 h-4 text-purple-110 shrink-0 mt-[2px]"
                            aria-hidden="true"
                          />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feedback link */}
                  <div className="pt-spacing-3">
                    <button
                      type="button"
                      onClick={() => setFeedbackOpen(true)}
                      className="text-text-2 text-text-muted underline hover:text-text-default cursor-pointer"
                    >
                      How are you enjoying this feature?
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {createPortal(
        <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />,
        document.body,
      )}
    </>
  );
}
