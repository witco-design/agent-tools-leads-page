import { useState, useEffect, useRef } from 'react';
import { Expand, Pencil, StickyNote, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CollapsibleCard } from './CollapsibleCard';
import { SectionActionButton } from './SectionActionButton';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';
import { ImportantNotesModal } from './ImportantNotesModal';
import { PinnedFloatingDialog } from '@/components/PinnedFloatingDialog';

const NOTE_CONTENT = `Camille is a first-time buyer in California, pre-approved up to $750K. Spouse is in tech, looking for a 3-bedroom in the Bay Area within 30 miles of San Jose. Prefers move-in-ready, open to townhomes.

Background: rented in SF for 6 years, ready to put down roots. Strong communicator — responds quickly to texts.

Key priorities: walkable neighborhoods, good schools (no kids yet but planning), short commute to San Jose tech corridor. Open to slightly older homes if well-maintained.

Budget headroom up to $800K if exceptional property.`;

export function ImportantNotesCard() {
  const { emptyMode } = useVersion();
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState(NOTE_CONTENT);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsScrollable(el.scrollHeight > el.clientHeight);
  }, [noteText]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
    setAtBottom(nearBottom);
  };

  return (
    <>
      <CollapsibleCard
        data-component="ImportantNotesCard"
        title="Important Notes"
        rightAction={
          emptyMode ? undefined : (
            <SectionActionButton
              label="Edit"
              icon={Pencil}
              iconPosition="before"
              variant="link"
              onClick={() => setNotesModalOpen(true)}
            />
          )
        }
      >
        {emptyMode ? (
          <EmptyState
            icon={NotebookPen}
            title="No notes yet"
            subtitle="Jot down context so the team stays in sync."
            action={{ label: 'Add note', onClick: () => setNotesModalOpen(true) }}
          />
        ) : (
        <>
        {/**
         * PROTECTED — Standardized card layout for Notes + AI Insights.
         * Content area is a fixed 200px scrollable region with a fade gradient
         * at the bottom (only visible while scrollable + not scrolled to bottom).
         * Expand button is HOVER-ONLY, positioned bottom-right of the tinted area.
         *
         * If the 200px content height needs to change, change it in BOTH cards.
         * The whole point is visual parity between the two.
         */}
        <div className="relative rounded-1 bg-orange-10 p-spacing-3 group">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="max-h-[200px] overflow-y-auto pr-spacing-3 notes-scroll text-text-3 font-normal text-text-default whitespace-pre-line leading-relaxed"
            >
              {noteText}
            </div>
            {isScrollable && !atBottom && (
              <div
                className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #fef5dd, transparent)' }}
              />
            )}
          </div>
          {/**
           * PROTECTED — Hover Expand affordance.
           * Icon-only on hover (no text label). Native tooltip via title="Expand".
           * aria-label preserves accessibility for screen readers.
           *
           * Do NOT add a text label back — the pattern is intentionally minimal.
           * If discoverability becomes an issue in user testing, add a Radix Tooltip
           * with 400ms delay rather than an always-visible label.
           */}
          <div className="absolute bottom-spacing-2 right-spacing-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              title="Expand"
              aria-label="Expand"
              className={cn(
                'inline-flex items-center justify-center p-1 rounded-1 transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'text-blue-100 hover:text-blue-110 hover:bg-blue-10/50 focus-visible:ring-blue-60',
              )}
            >
              <Expand className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        </>
        )}
      </CollapsibleCard>

      {/* Pinned floating dialog — full notes view */}
      <PinnedFloatingDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Important Notes"
        icon={<StickyNote className="w-4 h-4 text-orange-100" aria-hidden="true" />}
        accentColor="orange"
      >
        <p className="whitespace-pre-line">{noteText}</p>
      </PinnedFloatingDialog>

      {/* Unified view/edit modal */}
      <ImportantNotesModal
        open={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        note={noteText}
        onSave={(newNote) => {
          setNoteText(newNote);
          toast.success('Notes saved');
        }}
        lastUpdatedBy="Jon Scharer"
        lastUpdatedAt="2 days ago"
      />
    </>
  );
}
