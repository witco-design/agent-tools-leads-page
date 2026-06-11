import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface DateItem {
  id: string;
  label: string;
  date: string;
  note?: string;
}

export function ImportantDatesCard() {
  const [dates, setDates] = useState<DateItem[]>([
    {
      id: '1',
      label: 'Anniversary',
      date: '2025-12-08',
      note: 'Camille mentioned wanting to celebrate with a private chef dinner at home — Tom is allergic to shellfish so consider sourcing from a coastal vineyard tour instead.',
    },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const item: DateItem = {
      id: `date-${Date.now()}`,
      label: newLabel.trim(),
      date: newDate || new Date().toISOString().slice(0, 10),
      note: newNote.trim() || undefined,
    };
    setDates((prev) => [...prev, item]);
    setAddOpen(false);
    setNewLabel('');
    setNewDate('');
    setNewNote('');
    toast.success('Date added');
  };

  const handleDelete = (id: string) => {
    setDates((prev) => prev.filter((d) => d.id !== id));
    toast('Date removed');
  };

  const openEdit = (item: DateItem) => {
    setEditId(item.id);
    setEditLabel(item.label);
    setEditDate(item.date);
    setEditNote(item.note || '');
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editId || !editLabel.trim()) return;
    setDates((prev) =>
      prev.map((d) =>
        d.id === editId
          ? { ...d, label: editLabel.trim(), date: editDate, note: editNote.trim() || undefined }
          : d,
      ),
    );
    setEditOpen(false);
    setEditId(null);
    toast.success('Date updated');
  };

  return (
    <>
      <CollapsibleCard
        title="Important Dates"
        countBadge={dates.length}
        footer={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
          >
            + Add Date
          </button>
        }
      >
        <div className="space-y-spacing-3">
          {dates.map((item) => (
            <div key={item.id} className="group grid grid-cols-[100px_1fr_auto] gap-x-spacing-2 items-start">
              <span className="text-text-4 font-normal text-text-secondary pt-px">
                {item.label}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-text-4 font-normal text-text-default">
                  {formatDate(item.date)}
                </span>
                {item.note && (
                  <p className="text-xs italic text-[#475467]">
                    {item.note}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-1 hover:bg-gray-30 cursor-pointer shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[100px]">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-90 cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* Add Date Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Important Date</DialogTitle>
            <DialogDescription>Add a memorable date for this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Anniversary, Birthday, Closing Date"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Note <span className="font-normal text-text-muted">(optional)</span>
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value.slice(0, 200))}
                placeholder="Add a note about this date..."
                rows={2}
                maxLength={200}
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-[#344054]">{newNote.length} / 200</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => { setAddOpen(false); setNewLabel(''); setNewDate(''); setNewNote(''); }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={handleAdd}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Date Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Important Date</DialogTitle>
            <DialogDescription>Update the details for this date.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">Label</label>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Note <span className="font-normal text-text-muted">(optional)</span>
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value.slice(0, 200))}
                placeholder="Add a note about this date..."
                rows={2}
                maxLength={200}
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-[#344054]">{editNote.length} / 200</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
