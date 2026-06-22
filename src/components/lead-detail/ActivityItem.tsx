import { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, Search, Heart, Eye, Pin, Mail, MailOpen, CalendarCheck, CalendarClock, PencilLine, Droplets, FileText, Clipboard, Calendar, BookmarkPlus, MessageSquare, MessageCircle, MessagesSquare, MousePointerClick, Globe, Play, SquareCheck as CheckSquare, BarChart3, DollarSign, Users, Shield, ShieldCheck, UserCheck, ArrowRightLeft, UserPlus, Upload, Home, MoveHorizontal as MoreHorizontal, ChevronDown, Check } from 'lucide-react';
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
  // Phone
  | 'call'
  | 'called_contact_made'
  | 'called_no_answer'
  | 'called_left_voicemail'
  // Email
  | 'email'
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'shared_property_via_email'
  // SMS
  | 'text'
  | 'sms'
  | 'sent_text_message_to'
  | 'received_text_message_from'
  | 'opted_in_to_texting'
  // Chat
  | 'chat'
  | 'assistant_conversation_started'
  | 'received_chat_message_from'
  // Notes / Follow-ups
  | 'note'
  | 'edited'
  | 'created_a_followup_for'
  | 'completed_a_followup_for'
  | 'important_date_added'
  // Searches
  | 'search'
  | 'search_performed'
  | 'saved_search'
  | 'saved_search_added'
  // Favorites
  | 'favorited'
  | 'favorite_property_added'
  // Properties / Visits
  | 'view'
  | 'viewed'
  | 'property_viewed'
  | 'visited'
  | 'video_played'
  | 'market_report_viewed'
  | 'tour_requested'
  | 'valuation_inquired'
  | 'opted_in_lender_tcpa'
  // Drip
  | 'drip'
  | 'drip_started'
  | 'drip_ended'
  | 'drip_terminated'
  | 'drip_subscription_created'
  // Lifecycle
  | 'created'
  | 'imported'
  | 'was_assigned'
  | 'round_robin'
  // Transactions
  | 'buyer_consult_set'
  | 'buyer_consult_held'
  // GVL
  | 'gvl_verified'
  // Legacy
  | 'follow_up'
  | 'follow_up_completed'
  | 'task'
  | 'meeting';

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
    // ── Phone ──
    case 'call':
    case 'called_contact_made':
      return { bg: 'bg-green-30', icon: Phone, color: 'text-green-100' };
    case 'called_left_voicemail':
      return { bg: 'bg-orange-20', icon: PhoneCall, color: 'text-orange-110' };
    case 'called_no_answer':
      return { bg: 'bg-gray-40', icon: PhoneOff, color: 'text-gray-90' };

    // ── Email ──
    case 'email':
    case 'email_sent':
    case 'shared_property_via_email':
      return { bg: 'bg-blue-30', icon: Mail, color: 'text-blue-110' };
    case 'email_opened':
      return { bg: 'bg-blue-30', icon: MailOpen, color: 'text-blue-110' };
    case 'email_clicked':
      return { bg: 'bg-blue-30', icon: MousePointerClick, color: 'text-blue-110' };

    // ── SMS ──
    case 'text':
    case 'sms':
    case 'sent_text_message_to':
    case 'received_text_message_from':
    case 'opted_in_to_texting':
      return { bg: 'bg-orange-20', icon: MessageSquare, color: 'text-orange-110' };

    // ── Chat ──
    case 'chat':
    case 'assistant_conversation_started':
      return { bg: 'bg-[#DEDCFF]', icon: MessagesSquare, color: 'text-[#3830A5]' };
    case 'received_chat_message_from':
      return { bg: 'bg-[#DEDCFF]', icon: MessageCircle, color: 'text-[#3830A5]' };

    // ── Notes / Follow-ups ──
    case 'note':
      return { bg: 'bg-orange-20', icon: FileText, color: 'text-orange-110' };
    case 'created_a_followup_for':
      return { bg: 'bg-[#DEDCFF]', icon: Calendar, color: 'text-[#3830A5]' };
    case 'completed_a_followup_for':
      return { bg: 'bg-green-30', icon: CheckSquare, color: 'text-green-100' };
    case 'important_date_added':
      return { bg: 'bg-gray-40', icon: Calendar, color: 'text-gray-90' };
    case 'follow_up':
      return { bg: 'bg-[#DEDCFF]', icon: CalendarClock, color: 'text-[#3830A5]' };
    case 'follow_up_completed':
      return { bg: 'bg-[#DEDCFF]', icon: CalendarCheck, color: 'text-[#3830A5]' };

    // ── Searches ──
    case 'search':
    case 'search_performed':
      return { bg: 'bg-gray-40', icon: Search, color: 'text-gray-90' };
    case 'saved_search':
    case 'saved_search_added':
      return { bg: 'bg-blue-30', icon: BookmarkPlus, color: 'text-blue-110' };

    // ── Favorites ──
    case 'favorited':
    case 'favorite_property_added':
      return { bg: 'bg-red-30', icon: Heart, color: 'text-red-70' };

    // ── Properties / Visits ──
    case 'view':
    case 'viewed':
    case 'property_viewed':
      return { bg: 'bg-blue-20', icon: Home, color: 'text-blue-110' };
    case 'visited':
      return { bg: 'bg-gray-40', icon: Globe, color: 'text-gray-90' };
    case 'video_played':
      return { bg: 'bg-blue-30', icon: Play, color: 'text-blue-110' };
    case 'market_report_viewed':
      return { bg: 'bg-blue-30', icon: BarChart3, color: 'text-blue-110' };
    case 'tour_requested':
      return { bg: 'bg-blue-30', icon: Calendar, color: 'text-blue-110' };
    case 'valuation_inquired':
      return { bg: 'bg-blue-30', icon: DollarSign, color: 'text-blue-110' };
    case 'opted_in_lender_tcpa':
      return { bg: 'bg-blue-30', icon: Shield, color: 'text-blue-110' };

    // ── Drip ──
    case 'drip':
    case 'drip_started':
    case 'drip_ended':
    case 'drip_terminated':
    case 'drip_subscription_created':
      return { bg: 'bg-green-30', icon: Droplets, color: 'text-green-100' };

    // ── Lifecycle ──
    case 'created':
    case 'imported':
      return { bg: 'bg-gray-40', icon: Upload, color: 'text-gray-90' };
    case 'was_assigned':
      return { bg: 'bg-gray-40', icon: UserCheck, color: 'text-gray-90' };
    case 'round_robin':
      return { bg: 'bg-gray-40', icon: ArrowRightLeft, color: 'text-gray-90' };

    // ── Transactions ──
    case 'buyer_consult_set':
      return { bg: 'bg-blue-30', icon: Calendar, color: 'text-blue-110' };
    case 'buyer_consult_held':
      return { bg: 'bg-green-30', icon: Users, color: 'text-green-100' };

    // ── GVL ──
    case 'gvl_verified':
      return { bg: 'bg-blue-30', icon: ShieldCheck, color: 'text-blue-110' };

    // ── Other ──
    case 'task':
      return { bg: 'bg-[#DEDCFF]', icon: Clipboard, color: 'text-[#3830A5]' };
    case 'meeting':
      return { bg: 'bg-orange-30', icon: Calendar, color: 'text-orange-110' };
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
    <div data-component="ActivityItem" className="group/item p-spacing-5 border-b border-border-default last:border-b-0 hover:bg-gray-30/30 transition-colors">
      {/* METADATA ROW */}
      <div className="flex items-center gap-spacing-3 pb-spacing-3">
        {/* Type icon circle */}
        <div
          className={`w-8 h-8 rounded-round ${bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
        </div>

        {/* Meta line: "Logged a call by Kevin McCarthy · 2:17 PM" */}
        <div className="flex-1 min-w-0 flex items-center gap-spacing-2 text-text-4 leading-none">
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
            className={`p-1 rounded-1 transition-colors cursor-pointer ${
              item.pinned
                ? 'bg-[#ebf8ff] hover:bg-[#e4f2ff] text-blue-110'
                : 'text-gray-70 hover:bg-gray-30'
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
                className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded-1 hover:bg-gray-30 cursor-pointer"
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
            className="p-1 rounded-1 hover:bg-gray-30 cursor-pointer transition-colors"
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
                className={`text-text-4 font-semibold ${
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
                  <TruncatedText
                    lines={2}
                    fullText={item.note}
                    className="text-text-4 font-normal text-text-default italic leading-snug whitespace-pre-line"
                  >
                    &ldquo;{item.note}&rdquo;
                  </TruncatedText>
                </div>
              )}

              {/* Body: search criteria */}
              {item.searchCriteria && (
                <div className="mt-spacing-2">
                  <div className="border border-border-default rounded-1 p-spacing-3">
                    {item.searchCriteria.map((line, i) => (
                      <p
                        key={i}
                        className="text-text-4 font-normal text-text-default leading-snug"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  {item.addNoteLink && (
                    <a
                      href="#"
                      className="inline-block mt-spacing-2 text-text-4 font-semibold text-text-link hover:underline"
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
            <div className="mt-spacing-3 rounded-1 border border-border-default overflow-hidden">
              <div className="flex">
                {Object.entries(item.inset.fields).map(([label, value], index) => (
                  <div
                    key={label}
                    className={cn(
                      'flex-1 p-spacing-3',
                      index === 0 && 'flex-[1.2]',
                      index === Object.entries(item.inset!.fields).length - 1 && 'flex-[1.2]',
                      index > 0 && 'border-l border-border-default',
                    )}
                  >
                    <div className="text-text-4 text-text-secondary mb-spacing-1">
                      {label}
                    </div>
                    <div className="text-text-4 font-semibold text-text-default">
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
            className="bg-red-100 text-white hover:bg-red-110"
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
    <div className="flex gap-spacing-4 border border-border-default rounded-1 p-spacing-3">
      <img
        src={
          property.image ||
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=280&fit=crop'
        }
        alt={property.address}
        className="w-[200px] h-[140px] rounded-1 object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-text-4 font-semibold text-text-default min-w-0">
          <TruncatedText fullText={property.address}>
            {property.address}
          </TruncatedText>
        </p>
        <p className="text-text-4 font-normal text-text-secondary">
          MLS #{property.mls}
        </p>
        <p className="text-text-4 font-semibold text-text-default">
          {property.price}
        </p>
        <p className="text-text-4 font-normal text-text-default">
          {property.beds} &middot; {property.baths} &middot; {property.type}
        </p>
        {property.year && (
          <p className="text-text-4 font-normal text-text-secondary">
            {property.year}
          </p>
        )}
        <a
          href="#"
          className="mt-spacing-1 text-text-4 font-semibold text-text-link hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          View this property
        </a>
      </div>
    </div>
  );
}
