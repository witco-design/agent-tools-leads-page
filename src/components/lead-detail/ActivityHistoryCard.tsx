import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Phone,
  MessageSquare,
  MessagesSquare,
  Mail,
  FileText,
  MoreHorizontal,
  Heart,
  Home,
  Activity,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
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

// ── Log Activity dropdown types ────────────────────────────────
const logActivityTypes = [
  { label: 'Call', icon: Phone, color: 'text-green-100' },
  { label: 'Text', icon: MessageSquare, color: 'text-orange-110' },
  { label: 'Email', icon: Mail, color: 'text-blue-110' },
  { label: 'Note', icon: FileText, color: 'text-gray-80' },
  { label: 'Other', icon: MoreHorizontal, color: 'text-gray-80' },
];

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

// ── Main component ─────────────────────────────────────────────
export function ActivityHistoryCard() {
  const [activityOpen, setActivityOpen] = useState(true);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [pinnedItems, setPinnedItems] = useState<ActivityItemData[]>([
    pinnedItem,
  ]);
  const [p1Items, setP1Items] = useState<ActivityItemData[]>(page1Items);
  const [p2Items, setP2Items] = useState<ActivityItemData[]>(page2Items);
  const [olderLoaded, setOlderLoaded] = useState(false);
  // Log Activity dialog
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logDialogType, setLogDialogType] = useState('');

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

  // Unified filter from shared context (used by both dropdown and Activity Stats)
  const { activeFilter, setActiveFilter } = useActivityFilter();

  const currentItems = olderLoaded ? [...p1Items, ...p2Items] : p1Items;

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
  const filteredCurrentItems = useMemo(
    () => searchFilter(contentTypeFilter(currentItems)),
    [currentItems, searchFilter, contentTypeFilter],
  );

  // ── Category counts (computed from all items, ignoring other filters) ──
  const allItemsFlat = useMemo(
    () => [...pinnedItems, ...currentItems],
    [pinnedItems, currentItems],
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
    filteredPinnedItems.length === 0 && filteredCurrentItems.length === 0;

  // Group filtered historical items by date
  const dateGroups = useMemo(
    () => groupByDate(filteredCurrentItems),
    [filteredCurrentItems],
  );

  // ── Pin toggle ───────────────────────────────────────────────
  const handleTogglePin = useCallback(
    (id: string) => {
      const alreadyPinned = pinnedItems.find((item) => item.id === id);

      if (alreadyPinned) {
        setPinnedItems((prev) => prev.filter((item) => item.id !== id));
        const unpinnedItem = { ...alreadyPinned, pinned: false };
        // Route unpinned items back to the appropriate list
        if (id.startsWith('p2')) {
          setP2Items((prev) => [unpinnedItem, ...prev]);
        } else {
          setP1Items((prev) => [unpinnedItem, ...prev]);
        }
      } else {
        let foundItem: ActivityItemData | undefined;

        const inP1 = p1Items.find((item) => item.id === id);
        const inP2 = p2Items.find((item) => item.id === id);

        if (inP1) {
          foundItem = inP1;
          setP1Items((prev) => prev.filter((item) => item.id !== id));
        } else if (inP2) {
          foundItem = inP2;
          setP2Items((prev) => prev.filter((item) => item.id !== id));
        }

        if (foundItem) {
          setPinnedItems((prev) => [
            ...prev,
            { ...foundItem!, pinned: true },
          ]);
        }
      }
    },
    [pinnedItems, p1Items, p2Items],
  );

  // ── Completion toggle ────────────────────────────────────────
  const handleToggleComplete = useCallback(
    (id: string) => {
      setP1Items((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isCompleted: !item.isCompleted }
            : item,
        ),
      );
      setP2Items((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isCompleted: !item.isCompleted }
            : item,
        ),
      );
    },
    [],
  );

  const openLogDialog = (type: string) => {
    setLogDialogType(type);
    setLogDialogOpen(true);
  };

  // ── Delete handler ────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    setPinnedItems((prev) => prev.filter((item) => item.id !== id));
    setP1Items((prev) => prev.filter((item) => item.id !== id));
    setP2Items((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ── Edit handler ──────────────────────────────────────────────
  const handleEdit = useCallback(
    (id: string) => {
      const allItems = [...pinnedItems, ...p1Items, ...p2Items];
      const found = allItems.find((item) => item.id === id);
      if (found) {
        setEditItemId(id);
        setEditTitle(found.title);
        setEditNote(found.note || '');
        setEditDialogOpen(true);
      }
    },
    [pinnedItems, p1Items, p2Items],
  );

  const handleSaveEdit = () => {
    if (!editItemId) return;
    const updater = (items: ActivityItemData[]) =>
      items.map((item) =>
        item.id === editItemId ? { ...item, title: editTitle, note: editNote || undefined } : item,
      );
    setPinnedItems(updater);
    setP1Items(updater);
    setP2Items(updater);
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
    setP1Items((prev) => [newNote, ...prev]);
    setNoteText('');
    setNoteDialogOpen(false);
    toast.success('Note added');
  };

  return (
    <>
      <div data-component="ActivityHistoryCard" className="bg-bg-card rounded-3 border border-border-default shadow-sm overflow-hidden">
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
          {/* + Note button */}
          <button
            onClick={() => setNoteDialogOpen(true)}
            className="inline-flex items-center gap-1 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Note</span>
          </button>

          {/* + Log Activity split-button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Log Activity</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              {logActivityTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.label}
                    className="flex items-center gap-spacing-2 py-spacing-2 px-spacing-3 cursor-pointer hover:bg-gray-30 text-text-4 text-text-default"
                    onClick={() => openLogDialog(item.label)}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Content-type filter (reads/writes shared context) */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer">
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
                {activeFilter && activeFilter !== 'all' ? (
                  <button
                    type="button"
                    className="ml-0.5 p-0.5 hover:bg-gray-50 rounded-full cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setActiveFilter(null); }}
                  >
                    <X className="w-3 h-3 text-text-muted" />
                  </button>
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                )}
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
                        ? 'bg-blue-30 text-blue-110 font-semibold'
                        : 'text-text-default hover:bg-gray-30'
                    }`}
                    onClick={() => setActiveFilter(cat.key === 'all' ? null : cat.key)}
                  >
                    <CatIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-110' : 'text-text-secondary'}`} />
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
              className="w-full h-9 pl-9 pr-3 bg-white rounded-2 text-text-4 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-40 focus:border-blue-110 border border-border-default"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-50 rounded-full cursor-pointer"
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
          <div>
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
              {activeFilter && (
                <button
                  type="button"
                  className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
                  onClick={() => setActiveFilter(null)}
                >
                  Reset filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Load older activity ───────────────────────────────── */}
        {!hasNoHistoricalResults && !olderLoaded && (
          <div className="p-spacing-5 flex items-center justify-center border-t border-border-default">
            <button
              type="button"
              onClick={() => setOlderLoaded(true)}
              className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
            >
              Load older activity
            </button>
          </div>
        )}
          </>
        )}
      </div>

      {/* ── Log Activity Dialog ─────────────────────────────── */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Log {logDialogType}</DialogTitle>
            <DialogDescription>
              Record a {logDialogType.toLowerCase()} activity for this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-2">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Add notes about this activity..."
                className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setLogDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => {
                setLogDialogOpen(false);
                toast.success(`${logDialogType} activity logged`);
              }}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setNoteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteText.trim()}
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
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
                className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
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
