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
}

export function ImportantDatesCard() {
  const [dates, setDates] = useState<DateItem[]>([
    { id: '1', label: 'Anniversary', date: '2025-12-08' },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDate, setNewDate] = useState('');

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const item: DateItem = {
      id: `date-${Date.now()}`,
      label: newLabel.trim(),
      date: newDate || new Date().toISOString().slice(0, 10),
    };
    setDates((prev) => [...prev, item]);
    setAddOpen(false);
    setNewLabel('');
    setNewDate('');
    toast.success('Date added');
  };

  const handleDelete = (id: string) => {
    setDates((prev) => prev.filter((d) => d.id !== id));
    toast('Date removed');
  };

  return (
    <>
      <CollapsibleCard title="Important Dates" countBadge={dates.length}>
        <div className="space-y-spacing-3">
          {dates.map((item) => (
            <div key={item.id} className="group flex items-center gap-spacing-2">
              <span className="text-text-3 font-normal text-text-secondary w-[100px] shrink-0">
                {item.label}
              </span>
              <span className="text-text-3 font-normal text-text-default flex-1">
                {formatDate(item.date)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-2 hover:bg-gray-30 cursor-pointer shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-gray-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[100px]">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => toast('Edit date — coming soon')}>
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
          <div className="mt-spacing-3">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="text-text-3 font-semibold text-text-link hover:underline cursor-pointer"
            >
              + Add Date
            </button>
          </div>
        </div>
      </CollapsibleCard>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Important Date</DialogTitle>
            <DialogDescription>Add a memorable date for this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Anniversary, Birthday, Closing Date"
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={handleAdd}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
