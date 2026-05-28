import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  MoreHorizontal,
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
// Select removed — time range now uses DropdownMenu
import { ActivityItem, ActivityItemData } from './ActivityItem';
import {
  page1Items,
  page2Items,
  pinnedItem,
  upcomingItems,
} from './activityData';
import { useActivityFilter } from './ActivityFilterContext';

const TIME_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

// ── Log Activity dropdown types ────────────────────────────────
const logActivityTypes = [
  { label: 'Call', icon: Phone, color: 'text-green-90' },
  { label: 'Text', icon: MessageSquare, color: 'text-orange-80' },
  { label: 'Email', icon: Mail, color: 'text-blue-110' },
  { label: 'Note', icon: FileText, color: 'text-gray-80' },
  { label: 'Other', icon: MoreHorizontal, color: 'text-gray-80' },
];

// ── Filter type mapping ────────────────────────────────────────
const FILTER_TYPE_MAP: Record<string, string[]> = {
  Searches: ['search'],
  Visits: ['viewed', 'view'],
  'Prop Views': ['viewed', 'view'],
  'Saved Searches': ['search'],
  Favorites: ['favorited'],
  'Contact Emails': ['email'],
  'Email Updates': ['drip', 'drip_started', 'drip_ended', 'drip_terminated'],
};

function filterItems(
  items: ActivityItemData[],
  filterLabel: string | null,
): ActivityItemData[] {
  if (!filterLabel) return items;
  const types = FILTER_TYPE_MAP[filterLabel];
  if (!types) return items;
  return items.filter((item) => types.includes(item.type));
}

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
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [pinnedItems, setPinnedItems] = useState<ActivityItemData[]>([
    pinnedItem,
  ]);
  const [p1Items, setP1Items] = useState<ActivityItemData[]>(page1Items);
  const [p2Items, setP2Items] = useState<ActivityItemData[]>(page2Items);
  const [olderLoaded, setOlderLoaded] = useState(false);
  const [upcoming, setUpcoming] = useState<ActivityItemData[]>(upcomingItems);

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

  // Search & time range
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  // Filter from shared context
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

  // ── Time range filter helper ──────────────────────────────────
  const timeRangeFilter = useCallback(
    (items: ActivityItemData[]) => {
      if (timeRange === 'all') return items;
      const now = new Date();
      const msMap: Record<string, number> = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now.getTime() - (msMap[timeRange] || 0);
      return items.filter((item) => new Date(item.date + 'T12:00:00').getTime() >= cutoff);
    },
    [timeRange],
  );

  // Apply filter chain to historical items (NOT upcoming)
  const filteredPinnedItems = useMemo(
    () => searchFilter(timeRangeFilter(filterItems(pinnedItems, activeFilter))),
    [pinnedItems, activeFilter, searchFilter, timeRangeFilter],
  );
  const filteredCurrentItems = useMemo(
    () => searchFilter(timeRangeFilter(filterItems(currentItems, activeFilter))),
    [currentItems, activeFilter, searchFilter, timeRangeFilter],
  );

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
        if (id.startsWith('p1') || id === 'pinned-1') {
          setP1Items((prev) => [unpinnedItem, ...prev]);
        } else {
          setP2Items((prev) => [unpinnedItem, ...prev]);
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

  // ── Upcoming completion toggle ───────────────────────────────
  const handleToggleComplete = useCallback(
    (id: string) => {
      // Check if it's an upcoming item
      const upcomingItem = upcoming.find((item) => item.id === id);
      if (upcomingItem) {
        // Mark as completed in upcoming
        setUpcoming((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isCompleted: true } : item,
          ),
        );

        // After 1 second, move it to page 1 as follow_up_completed
        setTimeout(() => {
          setUpcoming((prev) => prev.filter((item) => item.id !== id));
          const today = new Date().toISOString().slice(0, 10);
          const nowTime = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          const completedItem: ActivityItemData = {
            ...upcomingItem,
            type: 'follow_up_completed',
            typeLabel: 'completed a follow-up',
            isCompleted: true,
            isCompletable: false,
            date: today,
            time: nowTime,
            timestamp: `Today at ${nowTime}`,
          };
          setP1Items((prev) => [completedItem, ...prev]);
        }, 1000);
        return;
      }

      // For historical items, just toggle
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
    [upcoming],
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
    setUpcoming((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ── Edit handler ──────────────────────────────────────────────
  const handleEdit = useCallback(
    (id: string) => {
      const allItems = [...pinnedItems, ...p1Items, ...p2Items, ...upcoming];
      const found = allItems.find((item) => item.id === id);
      if (found) {
        setEditItemId(id);
        setEditTitle(found.title);
        setEditNote(found.note || '');
        setEditDialogOpen(true);
      }
    },
    [pinnedItems, p1Items, p2Items, upcoming],
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
    setUpcoming(updater);
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
      <div className="bg-white rounded-3 border border-border-default shadow-sm overflow-hidden">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="p-spacing-5 flex flex-wrap items-center gap-spacing-2">
          <h3 className="text-text-4 font-semibold text-text-default whitespace-nowrap">
            Activity History
          </h3>
          <div className="flex-1 min-w-0" />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-spacing-2">
            {/* + Note button */}
            <button
              onClick={() => setNoteDialogOpen(true)}
              className="inline-flex items-center gap-1 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Note</span>
            </button>

            {/* + Log Activity split-button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-link hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer">
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
                      className="flex items-center gap-spacing-2 py-spacing-2 px-spacing-3 cursor-pointer hover:bg-gray-30 text-text-3 text-text-default"
                      onClick={() => openLogDialog(item.label)}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Time range */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer">
                  <span>{TIME_RANGE_OPTIONS.find((o) => o.value === timeRange)?.label ?? 'All Time'}</span>
                  {timeRange !== 'all' ? (
                    <button
                      type="button"
                      className="ml-0.5 p-0.5 hover:bg-gray-50 rounded-full cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setTimeRange('all'); }}
                    >
                      <X className="w-3 h-3 text-text-muted" />
                    </button>
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                {TIME_RANGE_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    className="cursor-pointer"
                    onClick={() => setTimeRange(opt.value)}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="relative w-full md:w-[280px] order-2 md:order-none flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Activity"
                className="w-full h-9 pl-9 pr-3 bg-white rounded-2 text-text-3 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-40 focus:border-blue-110 border border-gray-50"
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
        </div>

        {/* ── Filter pill ─────────────────────────────────────── */}
        {activeFilter && (
          <div className="px-spacing-5 pb-spacing-3">
            <span className="inline-flex items-center gap-spacing-2 h-7 px-3 bg-blue-30 rounded-round">
              <span className="text-text-2 font-semibold text-blue-110">
                Filtering by: {activeFilter}
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center cursor-pointer hover:bg-blue-40 rounded-full p-0.5 transition-colors"
                onClick={() => setActiveFilter(null)}
              >
                <X className="w-3 h-3 text-blue-110" />
              </button>
            </span>
          </div>
        )}

        {/* ── Pinned Section ──────────────────────────────────── */}
        <div className="border-t border-border-default mt-0">
          <button
            type="button"
            className="w-full flex items-center p-spacing-5 border-b border-border-default cursor-pointer hover:bg-bg-muted/50 transition-colors"
            onClick={() => setPinnedOpen((prev) => !prev)}
          >
            <span className="text-text-3 font-semibold text-text-default">
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

        {/* ── Upcoming Section ────────────────────────────────── */}
        <div className="border-b border-border-default">
          <div className="flex items-center px-spacing-5 py-spacing-3">
            <span className="text-text-3 font-semibold text-text-default">
              Upcoming
            </span>
            <div className="flex-1" />
            <a
              href="#"
              className="text-text-2 font-semibold text-text-link hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              See all follow-ups &rarr;
            </a>
          </div>

          {upcoming.length > 0 ? (
            <div>
              {upcoming.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`transition-opacity duration-300 ${
                    item.isCompleted ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <ActivityItem
                    item={item}
                    onTogglePin={handleTogglePin}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    showTimeOnly
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-spacing-4 flex items-center justify-center">
              <p className="text-text-3 text-text-muted">
                No upcoming follow-ups
              </p>
            </div>
          )}
        </div>

        {/* ── Historical Timeline (date-grouped) ──────────────── */}
        {!hasNoHistoricalResults ? (
          <div>
            {dateGroups.map((group) => (
              <div key={group.date}>
                {/* Date heading */}
                <div className="px-spacing-5 py-spacing-3 border-b border-gray-50">
                  <span className="text-text-2 font-semibold text-text-secondary uppercase tracking-wide">
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
            <p className="text-text-3 text-text-muted">
              No activity of this type yet
            </p>
            <button
              type="button"
              className="text-text-3 font-semibold text-text-link hover:underline cursor-pointer"
              onClick={() => setActiveFilter(null)}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ── Load older activity ───────────────────────────────── */}
        {!hasNoHistoricalResults && !olderLoaded && (
          <div className="p-spacing-5 flex items-center justify-center border-t border-border-default">
            <button
              type="button"
              onClick={() => setOlderLoaded(true)}
              className="text-text-3 font-semibold text-text-link hover:underline cursor-pointer"
            >
              Load older activity
            </button>
          </div>
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
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Add notes about this activity..."
                className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setLogDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
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
              className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setNoteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteText.trim()}
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-2">
                Notes
              </label>
              <textarea
                rows={4}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Add notes…"
                className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
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
