import { useState } from 'react';
import { Pencil, AlarmClock, Video, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FollowUpItem {
  id: string;
  title: string;
  description: string;
  date: string;
  tagType: 'video' | 'email';
  hasAlarm: boolean;
  checked: boolean;
}

const initialFollowUps: FollowUpItem[] = [
  {
    id: '1',
    title: 'Call back',
    description: 'Discuss interest level on 2339 Shaughnessy and confirm pre-approval status with lender.',
    date: '11/9 · 10:37am',
    tagType: 'video',
    hasAlarm: true,
    checked: false,
  },
  {
    id: '2',
    title: 'Send listings',
    description: 'Email curated list of 3-bed townhomes in San Jose / Santa Clara area, $650K-$750K.',
    date: '11/12 · 9:00am',
    tagType: 'email',
    hasAlarm: false,
    checked: false,
  },
];

export function FollowUpsCard() {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(initialFollowUps);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addDate, setAddDate] = useState('');
  const [addTagType, setAddTagType] = useState<'video' | 'email'>('email');

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTagType, setEditTagType] = useState<'video' | 'email'>('email');

  const toggleChecked = (id: string) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    const item = followUps.find((f) => f.id === id);
    if (item) {
      toast.success(item.checked ? `"${item.title}" unmarked` : `"${item.title}" completed`);
    }
  };

  const handleAdd = () => {
    if (!addTitle.trim()) return;
    const newItem: FollowUpItem = {
      id: `fu-${Date.now()}`,
      title: addTitle.trim(),
      description: addDescription.trim(),
      date: addDate || 'TBD',
      tagType: addTagType,
      hasAlarm: false,
      checked: false,
    };
    setFollowUps((prev) => [...prev, newItem]);
    setAddOpen(false);
    setAddTitle('');
    setAddDescription('');
    setAddDate('');
    setAddTagType('email');
    toast.success('Follow-up added');
  };

  const openEdit = (item: FollowUpItem) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditDate(item.date);
    setEditTagType(item.tagType);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editId) return;
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === editId
          ? { ...item, title: editTitle, description: editDescription, date: editDate, tagType: editTagType }
          : item
      )
    );
    setEditOpen(false);
    toast.success('Follow-up updated');
  };

  return (
    <>
      <CollapsibleCard
        data-component="FollowUpItem"
        title="Follow Ups"
        infoTooltip="These are reminders for next step interactions that are important for nurturing the relationship with your lead."
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="text-text-4 font-medium text-text-link hover:underline cursor-pointer"
            >
              Add Followup
            </button>
            <button
              type="button"
              onClick={() => toast('Scrolling to follow-ups section…')}
              className="inline-flex items-center gap-1.5 text-text-4 font-medium text-text-link hover:underline cursor-pointer"
            >
              <span>See All Followups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      >
        <div>
          {followUps.map((item) => (
            <div
              key={item.id}
              className="relative flex gap-spacing-3 px-spacing-2 py-spacing-5 -mx-spacing-2 rounded-1 hover:bg-gray-30 transition-colors cursor-pointer after:absolute after:bottom-0 after:left-spacing-5 after:right-0 after:h-px after:bg-border-default last:after:hidden"
            >
              {/* Checkbox */}
              <div className="pt-0.5">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleChecked(item.id)}
                  className="cursor-pointer"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title row — clock badge before title */}
                <div className="flex items-center gap-spacing-2">
                  {item.hasAlarm && (
                    <div className="w-6 h-6 rounded-round bg-red-30 flex items-center justify-center flex-shrink-0">
                      <AlarmClock className="w-3.5 h-3.5 text-red-80" aria-label="Follow-up needed soon" />
                    </div>
                  )}
                  <span className="text-text-4 font-semibold text-text-default truncate flex-1 min-w-0">
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-1 text-text-4 font-medium text-text-link hover:underline cursor-pointer shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-text-4 font-normal text-text-secondary mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Bottom meta — date + tag inline, wraps if narrow */}
                <div className="flex flex-wrap items-center gap-spacing-2 mt-2">
                  <span className="text-xs text-[#475467] whitespace-nowrap">
                    {item.date}
                  </span>
                  <Badge variant="communication" className="self-start">
                    {item.tagType === 'video' ? (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        Video Message
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* Add Follow-up Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>Create a new follow-up task for this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Title</label>
              <input
                type="text"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="e.g., Call back"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Description</label>
              <textarea
                rows={3}
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Due Date</label>
              <input
                type="datetime-local"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Type</label>
              <Select value={addTagType} onValueChange={(v) => setAddTagType(v as 'video' | 'email')}>
                <SelectTrigger className="h-9 rounded-1 border-border-default bg-white text-text-4 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="video">Video Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-5 font-medium text-text-default hover:bg-bg-muted transition-colors cursor-pointer shadow-sm"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!addTitle.trim()}
              className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-5 font-medium shadow-sm hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdd}
            >
              Add
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Follow-up Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit Follow-up</DialogTitle>
            <DialogDescription>Update this follow-up task.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Description</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Due Date</label>
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Type</label>
              <Select value={editTagType} onValueChange={(v) => setEditTagType(v as 'video' | 'email')}>
                <SelectTrigger className="h-9 rounded-1 border-border-default bg-white text-text-4 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="video">Video Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-5 font-medium text-text-default hover:bg-bg-muted transition-colors cursor-pointer shadow-sm"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-5 font-medium shadow-sm hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer"
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
