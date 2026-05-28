import { useState } from 'react';
import { Maximize2, Pencil, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const NOTE_CONTENT = `Camille is a first-time buyer in California, pre-approved up to $750K. Spouse is in tech, looking for a 3-bedroom in the Bay Area within 30 miles of San Jose. Prefers move-in-ready, open to townhomes.

Background: rented in SF for 6 years, ready to put down roots. Strong communicator — responds quickly to texts.`;

export function ImportantNotesCard() {
  const [editOpen, setEditOpen] = useState(false);
  const [expandOpen, setExpandOpen] = useState(false);
  const [noteText, setNoteText] = useState(NOTE_CONTENT);
  const [editText, setEditText] = useState(NOTE_CONTENT);

  return (
    <>
      <CollapsibleCard
        title="Important Notes"
        rightAction={
          <button
            type="button"
            onClick={() => { setEditText(noteText); setEditOpen(true); }}
            className="inline-flex items-center gap-1 text-text-2 font-semibold text-text-link hover:underline cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        }
      >
        <div className="rounded-2 bg-orange-10 border-l-4 border-orange-100 p-spacing-3">
          <div className="flex items-center gap-spacing-2 mb-spacing-2">
            <FileText className="w-4 h-4 text-orange-100 shrink-0" />
            <span className="text-text-2 font-bold text-orange-110 uppercase tracking-wide">Note</span>
          </div>
          <p className="text-text-3 font-normal text-text-default whitespace-pre-line line-clamp-4">
            {noteText}
          </p>
          <div className="flex justify-end mt-spacing-2">
            <button
              type="button"
              onClick={() => setExpandOpen(true)}
              className="inline-flex items-center gap-1 text-text-2 font-semibold text-text-link hover:underline cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand</span>
            </button>
          </div>
        </div>
      </CollapsibleCard>

      {/* Edit Notes Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Lead Notes</DialogTitle>
            <DialogDescription>Update the important notes for this lead.</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <textarea
              rows={8}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full min-h-[200px] px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => {
                setNoteText(editText);
                setEditOpen(false);
                toast.success('Notes saved');
              }}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expand Notes Dialog */}
      <Dialog open={expandOpen} onOpenChange={setExpandOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Important Notes</DialogTitle>
            <DialogDescription>Full lead notes.</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2 max-h-[400px] overflow-y-auto">
            <p className="text-text-3 font-normal text-text-default whitespace-pre-line">
              {noteText}
            </p>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setExpandOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
