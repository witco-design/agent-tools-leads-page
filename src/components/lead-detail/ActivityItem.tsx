import { useState } from 'react';
import {
  Phone,
  Search,
  Heart,
  Eye,
  Pin,
  Mail,
  CalendarCheck,
  CalendarClock,
  PencilLine,
  Droplets,
  FileText,
  Clipboard,
  Calendar,
  BookmarkPlus,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { TruncatedText } from './TruncatedText';

// ── Types ──────────────────────────────────────────────────────
export type ActivityType =
  | 'call'
  | 'text'
  | 'email'
  | 'search'
  | 'saved_search'
  | 'favorited'
  | 'drip'
  | 'drip_started'
  | 'drip_ended'
  | 'drip_terminated'
  | 'view'
  | 'viewed'
  | 'note'
  | 'follow_up'
  | 'follow_up_completed'
  | 'task'
  | 'meeting'
  | 'edited';

export interface PropertyData {
  address: string;
  mls: string;
  price: string;
  beds: string;
  baths: string;
  type: string;
  year?: string;
  image?: string;
}

export interface ActorData {
  name: string;
  avatarInitials: string;
}

export interface InsetData {
  kind: 'task' | 'meeting';
  fields: Record<string, string>;
}

export interface ActivityItemData {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  date: string; // ISO date string for grouping, e.g. "2025-11-05"
  time: string; // Display time, e.g. "2:17 PM"
  actor: ActorData;
  typeLabel: string;
  note?: string;
  searchCriteria?: string[];
  properties?: PropertyData[];
  pinned?: boolean;
  addNoteLink?: boolean;
  isCompletable?: boolean;
  isCompleted?: boolean;
  inset?: InsetData;
  createdAt?: string; // Relative creation time for follow-ups, e.g. "2 days ago"
}

// ── Icon config ────────────────────────────────────────────────
function getIconConfig(type: ActivityType) {
  switch (type) {
    case 'call':
      return { bg: 'bg-green-30', icon: Phone, color: 'text-green-90' };
    case 'text':
      return { bg: 'bg-orange-20', icon: MessageSquare, color: 'text-orange-100' };
    case 'email':
      return { bg: 'bg-blue-30', icon: Mail, color: 'text-blue-110' };
    case 'drip':
    case 'drip_started':
    case 'drip_ended':
    case 'drip_terminated':
      return { bg: 'bg-green-20', icon: Droplets, color: 'text-green-80' };
    case 'note':
      return { bg: 'bg-gray-40', icon: FileText, color: 'text-gray-90' };
    case 'follow_up':
      return { bg: 'bg-purple-30', icon: CalendarClock, color: 'text-purple-110' };
    case 'follow_up_completed':
      return { bg: 'bg-purple-30', icon: CalendarCheck, color: 'text-purple-110' };
    case 'task':
      return { bg: 'bg-purple-30', icon: Clipboard, color: 'text-purple-110' };
    case 'meeting':
      return { bg: 'bg-orange-30', icon: Calendar, color: 'text-orange-100' };
    case 'search':
      return { bg: 'bg-blue-30', icon: Search, color: 'text-blue-110' };
    case 'saved_search':
      return { bg: 'bg-blue-30', icon: BookmarkPlus, color: 'text-blue-110' };
    case 'view':
    case 'viewed':
      return { bg: 'bg-blue-20', icon: Eye, color: 'text-blue-90' };
    case 'favorited':
      return { bg: 'bg-red-30', icon: Heart, color: 'text-red-90' };
    case 'edited':
      return { bg: 'bg-gray-40', icon: PencilLine, color: 'text-gray-90' };
    default:
      return { bg: 'bg-gray-40', icon: FileText, color: 'text-gray-90' };
  }
}

// ── Capitalize helper ──────────────────────────────────────────
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Props ──────────────────────────────────────────────────────
interface ActivityItemProps {
  item: ActivityItemData;
  onTogglePin: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  /** When true, show only time (not full timestamp) */
  showTimeOnly?: boolean;
}

// ── Main component ─────────────────────────────────────────────
export function ActivityItem({
  item,
  onTogglePin,
  onToggleComplete,
  onDelete,
  onEdit,
  showTimeOnly = false,
}: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { bg, icon: Icon, color } = getIconConfig(item.type);
  const isSystem = item.actor.name === 'System';

  // For follow-ups with createdAt, show relative time; otherwise show absolute time
  const displayTime = item.createdAt
    ? item.createdAt
    : showTimeOnly
      ? item.time
      : item.timestamp;

  return (
    <>
    <div className="group/item p-spacing-5 border-b border-border-default last:border-b-0 hover:bg-gray-30/30 transition-colors">
      {/* METADATA ROW */}
      <div
        className={cn(
          'flex items-center gap-spacing-3 pb-spacing-3',
          isExpanded && 'border-b border-gray-50',
        )}
      >
        {/* Type icon circle */}
        <div
          className={`w-8 h-8 rounded-round ${bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
        </div>

        {/* Meta line: "Logged a call by Kevin McCarthy · 2:17 PM" */}
        <div className="flex-1 min-w-0 flex items-center gap-spacing-2 text-text-2 leading-none">
          {isSystem ? (
            <>
              <span className="whitespace-nowrap text-text-default font-medium">
                {capitalize(item.typeLabel)}
              </span>
              <span className="text-text-muted">&middot;</span>
              <span className="whitespace-nowrap text-text-secondary">{displayTime}</span>
            </>
          ) : (
            <>
              <span className="whitespace-nowrap">
                <span className="text-text-default font-medium">{capitalize(item.typeLabel)}</span>
                {' '}
                <span className="text-text-secondary">by</span>
                {' '}
                <span className="text-text-secondary">
                  {item.actor.name}
                </span>
              </span>
              <span className="text-text-muted">&middot;</span>
              <span className="whitespace-nowrap text-text-secondary">{displayTime}</span>
            </>
          )}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-spacing-1 shrink-0">
          {/* Pin button */}
          <button
            type="button"
            onClick={() => onTogglePin(item.id)}
            className={`p-1 rounded-2 transition-colors cursor-pointer hover:bg-gray-30 ${
              item.pinned ? 'text-blue-110' : 'text-gray-70'
            }`}
            title={item.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin
              className={`w-4 h-4 transition-transform ${
                item.pinned ? '-rotate-45' : ''
              }`}
            />
          </button>

          {/* "..." menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded-2 hover:bg-gray-30 cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit?.(item.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard?.writeText?.(`#activity-${item.id}`);
                  toast('Link copied to clipboard');
                }}
              >
                Copy link
              </DropdownMenuItem>
              {item.isCompletable && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    onToggleComplete?.(item.id);
                    toast.success(item.isCompleted ? 'Marked as incomplete' : 'Marked as complete');
                  }}
                >
                  {item.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  onTogglePin(item.id);
                  toast(item.pinned ? 'Unpinned from top' : 'Pinned to top');
                }}
              >
                {item.pinned ? 'Unpin' : 'Pin to top'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-90 cursor-pointer"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Expand/collapse chevron */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-2 hover:bg-gray-30 cursor-pointer transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-gray-70 transition-transform duration-200 ${
                !isExpanded ? '-rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* TITLE + BODY (expanded) */}
      {isExpanded && (
        <div className="ml-11 pt-spacing-3">
          <div className="flex items-start gap-spacing-3">
            {/* Completion checkbox for tasks/follow-ups */}
            {item.isCompletable && (
              <button
                type="button"
                onClick={() => onToggleComplete?.(item.id)}
                className="mt-0.5 shrink-0 cursor-pointer group/checkbox"
                aria-label={item.isCompleted ? 'Mark incomplete' : 'Mark complete'}
              >
                {item.isCompleted ? (
                  <div className="w-5 h-5 rounded-round bg-green-90 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-round border-2 border-gray-60 group-hover/checkbox:border-blue-110 transition-colors flex items-center justify-center">
                    <Check
                      className="w-3 h-3 text-gray-60 opacity-40 group-hover/checkbox:opacity-70 group-hover/checkbox:text-blue-110 transition-all"
                      strokeWidth={3}
                    />
                  </div>
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              {/* Bold title */}
              <h4
                className={`text-text-3 font-semibold ${
                  item.isCompleted
                    ? 'text-text-muted line-through'
                    : 'text-text-default'
                }`}
              >
                <TruncatedText fullText={item.title}>
                  {item.title}
                </TruncatedText>
              </h4>

              {/* Body: note text */}
              {item.note && (
                <div className="mt-spacing-2">
                  <div className="border border-border-default rounded-2 p-spacing-3">
                    <TruncatedText
                      lines={2}
                      fullText={item.note}
                      className="text-text-3 font-normal text-text-default italic whitespace-pre-line"
                    >
                      &ldquo;{item.note}&rdquo;
                    </TruncatedText>
                  </div>
                </div>
              )}

              {/* Body: search criteria */}
              {item.searchCriteria && (
                <div className="mt-spacing-2">
                  <div className="border border-border-default rounded-2 p-spacing-3">
                    {item.searchCriteria.map((line, i) => (
                      <p
                        key={i}
                        className="text-text-3 font-normal text-text-default"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  {item.addNoteLink && (
                    <a
                      href="#"
                      className="inline-block mt-spacing-2 text-text-3 font-semibold text-text-link hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      + Add a note
                    </a>
                  )}
                </div>
              )}

              {/* Body: property cards */}
              {item.properties && item.properties.length > 0 && (
                <div className="mt-spacing-2 space-y-spacing-3">
                  {item.properties.map((prop, i) => (
                    <PropertyCard key={i} property={prop} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inset panel for tasks/follow-ups — outline-only with column dividers */}
          {item.inset && (
            <div className="mt-spacing-3 rounded-2 border border-gray-50 overflow-hidden">
              <div className="flex">
                {Object.entries(item.inset.fields).map(([label, value], index) => (
                  <div
                    key={label}
                    className={cn(
                      'flex-1 p-spacing-3',
                      index === 0 && 'flex-[1.2]',
                      index === Object.entries(item.inset!.fields).length - 1 && 'flex-[1.2]',
                      index > 0 && 'border-l border-gray-50',
                    )}
                  >
                    <div className="text-text-2 text-text-secondary mb-spacing-1">
                      {label}
                    </div>
                    <div className="text-text-3 font-semibold text-text-default">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Delete confirmation */}
    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this activity?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The activity record will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-80 text-white hover:bg-red-90"
            onClick={() => {
              onDelete?.(item.id);
              toast.error('Activity deleted');
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

// ── Property card sub-component ────────────────────────────────
function PropertyCard({ property }: { property: PropertyData }) {
  return (
    <div className="flex gap-spacing-4 border border-border-default rounded-2 p-spacing-3">
      <img
        src={
          property.image ||
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=280&fit=crop'
        }
        alt={property.address}
        className="w-[200px] h-[140px] rounded-2 object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-text-3 font-semibold text-text-default min-w-0">
          <TruncatedText fullText={property.address}>
            {property.address}
          </TruncatedText>
        </p>
        <p className="text-text-3 font-normal text-text-secondary">
          MLS #{property.mls}
        </p>
        <p className="text-text-3 font-semibold text-text-default">
          {property.price}
        </p>
        <p className="text-text-3 font-normal text-text-default">
          {property.beds} &middot; {property.baths} &middot; {property.type}
        </p>
        {property.year && (
          <p className="text-text-3 font-normal text-text-secondary">
            {property.year}
          </p>
        )}
        <a
          href="#"
          className="mt-spacing-1 text-text-3 font-semibold text-text-link hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          View this property
        </a>
      </div>
    </div>
  );
}
