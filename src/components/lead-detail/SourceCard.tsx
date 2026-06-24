import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const SOURCE_OPTIONS = [
  { value: 'listings', label: 'Listings' },
  { value: 'website-property-valuation', label: 'Website Property Valuation' },
  { value: 'direct-inquiry', label: 'Direct Inquiry' },
  { value: 'realtor-com', label: 'Realtor.com' },
  { value: 'zillow', label: 'Zillow' },
  { value: 'facebook-ad', label: 'Facebook Ad' },
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
];

export function SourceCard() {
  const [source, setSource] = useState('listings');
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <CollapsibleCard
        title="Source"
        rightAction={
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1 text-text-3 font-semibold text-text-link hover:underline cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        }
      >
        <div className="flex items-center gap-spacing-2">
          <span className="text-text-3 font-normal text-text-secondary w-[60px] shrink-0">
            Source
          </span>
          <div className="flex-1">
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="h-8 rounded-1 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleCard>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Source</DialogTitle>
            <DialogDescription>Update the lead source information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Source</label>
              <select
                defaultValue={source}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Sub-source (optional)</label>
              <input
                type="text"
                placeholder="e.g., Landing page A"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Campaign (optional)</label>
              <input
                type="text"
                placeholder="e.g., Spring 2025"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-4 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-8 px-spacing-4 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => {
                setEditOpen(false);
                toast.success('Source updated');
              }}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
