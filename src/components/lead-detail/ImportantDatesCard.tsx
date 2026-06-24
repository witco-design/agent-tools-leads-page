import { useState, useEffect } from 'react';
import { Ellipsis as MoreHorizontal } from 'lucide-react';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface DateItem {
  id: string;
  label: string;
  month: number;
  day: number;
  note?: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatMonthDay(month: number, day: number): string {
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

function maxDayForMonth(month: number): number {
  if (month === 2) return 29;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

const INITIAL_DATES: DateItem[] = [
  {
    id: '1',
    label: 'Anniversary',
    month: 12,
    day: 8,
    note: 'Camille mentioned wanting to celebrate with a private chef dinner at home — Tom is allergic to shellfish so consider sourcing from a coastal vineyard tour instead.',
  },
];

function DateDialog({
  open,
  onOpenChange,
  title,
  description,
  initialLabel = '',
  initialMonth = 0,
  initialDay = null as number | null,
  initialNote = '',
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  initialLabel?: string;
  initialMonth?: number;
  initialDay?: number | null;
  initialNote?: string;
  onSave: (label: string, month: number, day: number, note: string) => void;
}) {
  const [label, setLabel] = useState(initialLabel);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState<number | null>(initialDay);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (open) {
      setLabel(initialLabel);
      setMonth(initialMonth);
      setDay(initialDay);
      setNote(initialNote);
    }
  }, [open]);

  useEffect(() => {
    if (day !== null && day > maxDayForMonth(month)) {
      setDay(maxDayForMonth(month));
    }
  }, [month]);

  const canSave =
    label.trim().length > 0 &&
    month >= 1 &&
    month <= 12 &&
    day !== null &&
    day >= 1 &&
    day <= maxDayForMonth(month);

  const handleSave = () => {
    if (!canSave) return;
    onSave(label.trim(), month, day!, note.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-spacing-4 py-spacing-2">
          <div>
            <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Anniversary, Birthday, Closing Date"
              className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>
          <div>
            <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">Date</label>
            <div className="grid grid-cols-[1fr_120px] gap-spacing-3">
              <Select
                value={month > 0 ? String(month) : ''}
                onValueChange={(v) => setMonth(parseInt(v, 10))}
              >
                <SelectTrigger aria-label="Month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_LABELS.map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={month > 0 ? maxDayForMonth(month) : 31}
                value={day ?? ''}
                onChange={(e) => {
                  const raw = parseInt(e.target.value, 10);
                  if (Number.isNaN(raw)) { setDay(null); return; }
                  const clamped = Math.max(1, Math.min(maxDayForMonth(month > 0 ? month : 12), raw));
                  setDay(clamped);
                }}
                placeholder="Day"
                aria-label="Day"
                className="h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">
              Note <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              placeholder="Add a note about this date..."
              rows={2}
              maxLength={200}
              className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-[#344054]">{note.length} / 200</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ImportantDatesCard() {
  const [dates, setDates] = useState<DateItem[]>(INITIAL_DATES);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<DateItem | null>(null);

  const sorted = [...dates].sort((a, b) => a.month - b.month || a.day - b.day);

  const handleAdd = (label: string, month: number, day: number, note: string) => {
    setDates((prev) => [
      ...prev,
      { id: `date-${Date.now()}`, label, month, day, note: note || undefined },
    ]);
    setAddOpen(false);
    toast.success('Date added');
  };

  const handleSaveEdit = (label: string, month: number, day: number, note: string) => {
    if (!editItem) return;
    setDates((prev) =>
      prev.map((d) =>
        d.id === editItem.id
          ? { ...d, label, month, day, note: note || undefined }
          : d,
      ),
    );
    setEditOpen(false);
    setEditItem(null);
    toast.success('Date updated');
  };

  const handleDelete = (id: string) => {
    setDates((prev) => prev.filter((d) => d.id !== id));
    toast('Date removed');
  };

  const openEdit = (item: DateItem) => {
    setEditItem(item);
    setEditOpen(true);
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
            className="text-text-3 font-semibold text-text-link hover:underline cursor-pointer"
          >
            Add Date
          </button>
        }
      >
        <div className="space-y-spacing-3">
          {sorted.map((item) => (
            <div key={item.id} className="group grid grid-cols-[100px_1fr_auto] gap-x-spacing-2 items-start">
              <span className="text-text-3 font-normal text-text-secondary pt-px">
                {item.label}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-text-3 font-normal text-text-default">
                  {formatMonthDay(item.month, item.day)}
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
                  <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(item)}>
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

      <DateDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Important Date"
        description="Add a memorable date for this lead."
        onSave={handleAdd}
      />

      {editItem && (
        <DateDialog
          open={editOpen}
          onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}
          title="Edit Important Date"
          description="Update the details for this date."
          initialLabel={editItem.label}
          initialMonth={editItem.month}
          initialDay={editItem.day}
          initialNote={editItem.note ?? ''}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
