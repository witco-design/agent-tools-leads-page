import { useState } from 'react';
import { Maximize2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import { ImportantNotesModal } from './ImportantNotesModal';

const NOTE_CONTENT = `Camille is a first-time buyer in California, pre-approved up to $750K. Spouse is in tech, looking for a 3-bedroom in the Bay Area within 30 miles of San Jose. Prefers move-in-ready, open to townhomes.

Background: rented in SF for 6 years, ready to put down roots. Strong communicator — responds quickly to texts.

Key priorities: walkable neighborhoods, good schools (no kids yet but planning), short commute to San Jose tech corridor. Open to slightly older homes if well-maintained.

Budget headroom up to $800K if exceptional property.`;

export function ImportantNotesCard() {
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [noteText, setNoteText] = useState(NOTE_CONTENT);

  return (
    <>
      <CollapsibleCard
        data-component="ImportantNotesCard"
        title="Important Notes"
        rightAction={
          <button
            type="button"
            onClick={() => setNotesModalOpen(true)}
            className="inline-flex items-center gap-1 text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        }
      >
        <div className="rounded-1 bg-orange-10 p-spacing-3">
          <p className="text-text-4 font-normal text-text-default whitespace-pre-line line-clamp-8">
            {noteText}
          </p>
          <div className="flex justify-end mt-spacing-2">
            <button
              type="button"
              onClick={() => setNotesModalOpen(true)}
              className="inline-flex items-center gap-1 text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand</span>
            </button>
          </div>
        </div>
      </CollapsibleCard>

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
