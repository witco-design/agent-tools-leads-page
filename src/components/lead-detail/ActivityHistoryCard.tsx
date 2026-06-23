import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Phone,
  MessageSquare,
  MessagesSquare,
  Mail,
  FileText,
  Heart,
  Home,
  Activity,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
// Activity timeline card with content-type filtering
import { ActivityItem, ActivityItemData } from './ActivityItem';
import {
  page1Items,
  page2Items,
  pinnedItem,
} from './activityData';
import { useActivityFilter } from './ActivityFilterContext';
import { LogActivityDialog } from './LogActivityDialog';

// ── Content-type filter categories ─────────────────────────────
const CONTENT_FILTER_CATEGORIES = [
  { key: 'all', label: 'All', icon: Activity, types: null },
  { key: 'phone', label: 'Phone', icon: Phone, types: ['call', 'called_contact_made', 'called_no_answer', 'called_left_voicemail', 'follow_up', 'follow_up_completed'] },
  { key: 'email', label: 'Email', icon: Mail, types: ['email', 'email_sent', 'email_opened', 'email_clicked', 'email_bounced', 'shared_property_via_email'] },
  { key: 'sms', label: 'SMS', icon: MessageSquare, types: ['sms', 'text', 'sent_text_message_to', 'received_text_message_from', 'opted_in_to_texting'] },
  { key: 'chats', label: 'Chats', icon: MessagesSquare, types: ['chat', 'assistant_conversation_started', 'received_chat_message_from'] },
  { key: 'notes', label: 'Notes', icon: FileText, types: ['note', 'created_a_followup_for', 'completed_a_followup_for', 'important_date_added'] },
  { key: 'searches', label: 'Searches', icon: Search, types: ['search', 'search_performed', 'saved_search', 'saved_search_added'] },
  { key: 'favorites', label: 'Favorites', icon: Heart, types: ['favorited', 'favorite_property_added'] },
  { key: 'properties', label: 'Properties', icon: Home, types: ['view', 'viewed', 'property_viewed', 'visited', 'video_played', 'market_report_viewed', 'tour_requested', 'valuation_inquired', 'opted_in_lender_tcpa'] },
] as const;

// (Log activity types moved into LogActivityDialog)

// (Filter type mapping removed — unified into CONTENT_FILTER_CATEGORIES via shared context)

// ── Date grouping helper ───────────────────────────────────────
function getDateLabel(dateStr: string): string {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const d = new Date(dateStr + 'T12:00:00');
  const currentYear = today.getFullYear();
  const itemYear = d.getFullYear();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  if (itemYear === currentYear) {
    return `${monthNames[d.getMonth()]} ${d.getDate()}`;
  }
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${itemYear}`;
}

interface DateGroup {
  label: string;
  date: string;
  items: ActivityItemData[];
}

function groupByDate(items: ActivityItemData[]): DateGroup[] {
  const groups: DateGroup[] = [];
  const map = new Map<string, ActivityItemData[]>();

  for (const item of items) {
    const existing = map.get(item.date);
    if (existing) {
      existing.push(item);
    } else {
      const arr = [item];
      map.set(item.date, arr);
      groups.push({ label: getDateLabel(item.date), date: item.date, items: arr });
    }
  }

  return groups;
}

// ── Progressive disclosure constants ──────────────────────────
const INITIAL_VISIBLE = 20;
const INCREMENT = 20;
const DATE_JUMPER_THRESHOLD = 100;

// ── Main component ─────────────────────────────────────────────
export function ActivityHistoryCard() {
  const [activityOpen, setActivityOpen] = useState(true);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [pinnedItems, setPinnedItems] = useState<ActivityItemData[]>([
    pinnedItem,
  ]);
  const [historyItems, setHistoryItems] = useState<ActivityItemData[]>([
    ...page1Items,
    ...page2Items,
  ]);
  // Log Activity dialog
  const [logDialogOpen, setLogDialogOpen] = useState(false);

  // Note dialog
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Progressive disclosure
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const showMoreRef = useRef<HTMLButtonElement>(null);

  // Unified filter from shared context (used by both dropdown and Activity Stats)
  const { activeFilter, setActiveFilter } = useActivityFilter();

  // Reset visibleCount when filter or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeFilter, searchQuery]);

  // ── Search filter helper ──────────────────────────────────────
  const searchFilter = useCallback(
    (items: ActivityItemData[]) => {
      if (!searchQuery.trim()) return items;
      const q = searchQuery.toLowerCase();
      return items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.note?.toLowerCase().includes(q) ||
          item.actor.name.toLowerCase().includes(q) ||
          item.typeLabel.toLowerCase().includes(q),
      );
    },
    [searchQuery],
  );

  // ── Content-type filter helper (reads from shared context) ────
  const contentTypeFilter = useCallback(
    (items: ActivityItemData[]) => {
      if (!activeFilter || activeFilter === 'all') return items;
      const category = CONTENT_FILTER_CATEGORIES.find((c) => c.key === activeFilter);
      if (!category || !category.types) return items;
      return items.filter((item) => (category.types as readonly string[]).includes(item.type));
    },
    [activeFilter],
  );

  // Apply filter chain to historical items
  const filteredPinnedItems = useMemo(
    () => searchFilter(contentTypeFilter(pinnedItems)),
    [pinnedItems, searchFilter, contentTypeFilter],
  );
  const filteredHistoryItems = useMemo(
    () => searchFilter(contentTypeFilter(historyItems)),
    [historyItems, searchFilter, contentTypeFilter],
  );

  // Progressive disclosure — slice to visible count
  const visibleHistoryItems = useMemo(
    () => filteredHistoryItems.slice(0, visibleCount),
    [filteredHistoryItems, visibleCount],
  );
  const remainingCount = Math.max(0, filteredHistoryItems.length - visibleCount);
  const hasMore = remainingCount > 0;

  // ── Category counts (computed from all items, ignoring other filters) ──
  const allItemsFlat = useMemo(
    () => [...pinnedItems, ...historyItems],
    [pinnedItems, historyItems],
  );
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CONTENT_FILTER_CATEGORIES) {
      if (!cat.types) {
        counts[cat.key] = allItemsFlat.length;
      } else {
        counts[cat.key] = allItemsFlat.filter((item) =>
          (cat.types as readonly string[]).includes(item.type),
        ).length;
      }
    }
    return counts;
  }, [allItemsFlat]);

  const hasNoHistoricalResults =
    filteredPinnedItems.length === 0 && filteredHistoryItems.length === 0;

  // Group visible historical items by date
  const dateGroups = useMemo(
    () => groupByDate(visibleHistoryItems),
    [visibleHistoryItems],
  );

  // ── Pin toggle ───────────────────────────────────────────────
  const handleTogglePin = useCallback(
    (id: string) => {
      const alreadyPinned = pinnedItems.find((item) => item.id === id);

      if (alreadyPinned) {
        setPinnedItems((prev) => prev.filter((item) => item.id !== id));
        const unpinnedItem = { ...alreadyPinned, pinned: false };
        setHistoryItems((prev) => [unpinnedItem, ...prev]);
      } else {
        const foundItem = historyItems.find((item) => item.id === id);

        if (foundItem) {
          setHistoryItems((prev) => prev.filter((item) => item.id !== id));
          setPinnedItems((prev) => [
            ...prev,
            { ...foundItem, pinned: true },
          ]);
        }
      }
    },
    [pinnedItems, historyItems],
  );

  // ── Completion toggle ────────────────────────────────────────
  const handleToggleComplete = useCallback(
    (id: string) => {
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isCompleted: !item.isCompleted }
            : item,
        ),
      );
    },
    [],
  );

  // Log Activity save handler
  const handleLogActivitySave = useCallback(
    (activity: { type: string; direction: string; timestamp: Date; notes: string; notifyRecipient: string }) => {
      const today = activity.timestamp.toISOString().slice(0, 10);
      const nowTime = activity.timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const typeLabel =
        activity.type === 'other'
          ? `logged ${activity.direction || 'an activity'}`
          : `logged a ${activity.type}`;
      const newItem: ActivityItemData = {
        id: `log-${Date.now()}`,
        type: activity.type === 'call' ? 'call' : activity.type === 'text' ? 'sms' : activity.type === 'email' ? 'email' : activity.type === 'note' ? 'note' : 'note',
        title:
          activity.notes?.slice(0, 80) ||
          `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} activity`,
        timestamp: `${format(activity.timestamp, 'MMM d, yyyy')} at ${nowTime}`,
        date: today,
        time: nowTime,
        actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
        typeLabel,
        note: activity.notes || undefined,
      };
      setHistoryItems((prev) => [newItem, ...prev]);
      toast.success(`${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} activity logged`);
    },
    [],
  );

  // ── Delete handler ────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    setPinnedItems((prev) => prev.filter((item) => item.id !== id));
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ── Edit handler ──────────────────────────────────────────────
  const handleEdit = useCallback(
    (id: string) => {
      const allItems = [...pinnedItems, ...historyItems];
      const found = allItems.find((item) => item.id === id);
      if (found) {
        setEditItemId(id);
        setEditTitle(found.title);
        setEditNote(found.note || '');
        setEditDialogOpen(true);
      }
    },
    [pinnedItems, historyItems],
  );

  const handleSaveEdit = () => {
    if (!editItemId) return;
    const updater = (items: ActivityItemData[]) =>
      items.map((item) =>
        item.id === editItemId ? { ...item, title: editTitle, note: editNote || undefined } : item,
      );
    setPinnedItems(updater);
    setHistoryItems(updater);
    setEditDialogOpen(false);
    toast.success('Activity updated');
  };

  // ── Save Note handler ─────────────────────────────────────────
  const handleSaveNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const newNote: ActivityItemData = {
      id: `note-${Date.now()}`,
      type: 'note',
      title: trimmed.slice(0, 80) + (trimmed.length > 80 ? '…' : ''),
      timestamp: `Today at ${nowTime}`,
      date: today,
      time: nowTime,
      actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
      typeLabel: 'added a note',
      note: trimmed,
    };
    setHistoryItems((prev) => [newNote, ...prev]);
    setNoteText('');
    setNoteDialogOpen(false);
    toast.success('Note added');
  };

  return (
    <>
      <div data-component="ActivityHistoryCard" className="bg-bg-card rounded-3 border border-border-default overflow-hidden">
        {/* ── BAR 1: Title bar ─────────────────────────────────── */}
        <div className="px-spacing-5 py-spacing-3 flex items-center justify-between">
          <h3 className="text-text-5 font-semibold text-text-default">
            Activity History
          </h3>
          <button
            type="button"
            aria-label={activityOpen ? 'Collapse Activity History' : 'Expand Activity History'}
            className="p-spacing-1 hover:bg-bg-muted rounded-1 transition-colors cursor-pointer"
            onClick={() => setActivityOpen((prev) => !prev)}
          >
            <ChevronDown
              className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${activityOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {activityOpen && (
          <>
        {/* Hairline between title and toolbar */}
        <div className="border-t border-border-default" />

        {/* ── BAR 2: Toolbar ──────────────────────────────────── */}
        <div className="px-spacing-5 py-spacing-3 flex flex-wrap items-center gap-spacing-2">
          {/* Add Note button */}
          <button
            onClick={() => setNoteDialogOpen(true)}
            className="inline-flex items-center gap-1 h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>

          {/* Log Activity button (opens unified dialog) */}
          <button
            onClick={() => setLogDialogOpen(true)}
            className="inline-flex items-center gap-1 h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity</span>
          </button>

          {/* Content-type filter (reads/writes shared context) */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer">
                {(() => {
                  const filterKey = activeFilter ?? 'all';
                  const active = CONTENT_FILTER_CATEGORIES.find((c) => c.key === filterKey);
                  const Icon = active?.icon ?? Activity;
                  return (
                    <>
                      <Icon className="w-4 h-4 text-text-secondary" />
                      <span>{active?.label ?? 'All'}</span>
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-spacing-1 rounded-round bg-[#ebf8ff] text-[#3e60c9] text-xs font-semibold">{categoryCounts[filterKey] ?? 0}</span>
                    </>
                  );
                })()}
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              {CONTENT_FILTER_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                const count = categoryCounts[cat.key] ?? 0;
                const isActive = (activeFilter ?? 'all') === cat.key;
                return (
                  <DropdownMenuItem
                    key={cat.key}
                    className={`flex items-center gap-spacing-2 py-spacing-2 px-spacing-3 cursor-pointer text-text-4 ${
                      isActive
                        ? 'bg-blue-30 text-blue-100 font-semibold'
                        : 'text-text-default hover:bg-gray-30'
                    }`}
                    onClick={() => setActiveFilter(cat.key === 'all' ? null : cat.key)}
                  >
                    <CatIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-100' : 'text-text-secondary'}`} />
                    <span className="flex-1">{cat.label}</span>
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-spacing-1 rounded-round bg-[#ebf8ff] text-[#3e60c9] text-xs font-semibold">
                      {count}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search — fills remaining width */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Activity"
              className="w-full h-8 pl-spacing-8 pr-spacing-3 bg-white rounded-1 text-text-3 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-40 focus:border-blue-100 border border-border-default"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-50 rounded-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-text-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Hairline between toolbar and content */}
        <div className="border-t border-border-default" />

        {/* ── Pinned Section ──────────────────────────────────── */}
        <div className="mt-0">
          <button
            type="button"
            className="w-full flex items-center px-spacing-5 py-spacing-3 border-b border-border-default cursor-pointer hover:bg-bg-muted/50 transition-colors"
            onClick={() => setPinnedOpen((prev) => !prev)}
          >
            <span className="text-text-4 font-semibold text-text-default">
              Pinned
            </span>
            <div className="flex-1" />
            <ChevronDown
              className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                pinnedOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {pinnedOpen && filteredPinnedItems.length > 0 && (
            <div>
              {filteredPinnedItems.map((item) => (
                <ActivityItem
                  key={item.id}
                  item={item}
                  onTogglePin={handleTogglePin}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  showTimeOnly
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Historical Timeline (date-grouped) ──────────────── */}
        {!hasNoHistoricalResults ? (
          <div role="region" aria-label="Activity history" aria-live="polite">
            {dateGroups.map((group) => (
              <div key={group.date}>
                {/* Date heading */}
                <div className="px-spacing-5 py-spacing-3 border-b border-border-default">
                  <span className="text-text-4 font-semibold text-text-secondary uppercase tracking-wide">
                    {group.label}
                  </span>
                </div>
                {/* Items in this group */}
                {group.items.map((item) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    onTogglePin={handleTogglePin}
                    onToggleComplete={handleToggleComplete}
                    showTimeOnly
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-spacing-10 flex flex-col items-center justify-center gap-spacing-2">
            <p className="text-text-4 text-text-muted">
              No activity matches the current filter
            </p>
            <div className="flex items-center gap-spacing-3">
              {(activeFilter || searchQuery) && (
                <button
                  type="button"
                  className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
                  onClick={() => { setActiveFilter(null); setSearchQuery(''); }}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Show more / Date jumper ──────────────────────────── */}
        {!hasNoHistoricalResults && hasMore && (
          <div className="px-spacing-5 py-spacing-4 border-t border-border-default">
            {visibleCount < DATE_JUMPER_THRESHOLD ? (
              <button
                ref={showMoreRef}
                type="button"
                onClick={() => setVisibleCount((c) => c + INCREMENT)}
                className="w-full h-10 inline-flex items-center justify-center gap-spacing-2 bg-white border border-border-default rounded-1 text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              >
                Show more activity
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-spacing-1 rounded-round bg-[#ebf8ff] text-[#3e60c9] text-xs font-semibold">
                  {remainingCount}
                </span>
              </button>
            ) : (
              <div className="space-y-spacing-3">
                <p className="text-text-4 text-text-muted">
                  You&apos;ve reviewed the last {visibleCount} activities. Jump to a specific date to see older activity.
                </p>
                <div className="flex items-center gap-spacing-2">
                  <label className="text-text-4 font-medium text-text-default">Jump to date:</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const targetDate = e.target.value;
                      const idx = filteredHistoryItems.findIndex((a) => a.date <= targetDate);
                      if (idx !== -1) {
                        setVisibleCount(idx + INCREMENT);
                      }
                    }}
                    className="h-9 px-spacing-3 border border-border-default rounded-1 text-text-4 text-text-default focus:outline-none focus:border-blue-100 focus:ring-1 focus:ring-blue-40"
                  />
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-spacing-1 rounded-round bg-[#ebf8ff] text-[#3e60c9] text-xs font-semibold">
                    {remainingCount} remaining
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>

      {/* ── Log Activity Dialog (unified with tabs) ──────── */}
      <LogActivityDialog
        open={logDialogOpen}
        onOpenChange={setLogDialogOpen}
        leadName="Camille Dubois"
        currentUserName="Jon Scharer"
        onSave={handleLogActivitySave}
      />

      {/* ── Add Note Dialog ──────────────────────────────────── */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to this lead&apos;s activity timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <textarea
              rows={5}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note…"
              className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setNoteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteText.trim()}
              className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveNote}
            >
              Save Note
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Activity Dialog ─────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the title or notes for this activity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Notes
              </label>
              <textarea
                rows={4}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Add notes…"
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer"
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
