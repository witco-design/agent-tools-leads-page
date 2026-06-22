import { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, MessageSquare, Mail, StickyNote, MoveHorizontal as MoreHorizontal, Calendar as CalendarIcon, Maximize2, Minimize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

/* ── Activity type config (single source of truth) ─────────── */
const ACTIVITY_TYPES = [
  {
    key: 'call',
    label: 'Call',
    icon: Phone,
    directionOptions: ['Inbound', 'Outbound'],
    directionLabel: 'Direction',
    customTypeInput: false,
  },
  {
    key: 'text',
    label: 'Text',
    icon: MessageSquare,
    directionOptions: ['Sent', 'Received'],
    directionLabel: 'Direction',
    customTypeInput: false,
  },
  {
    key: 'email',
    label: 'Email',
    icon: Mail,
    directionOptions: ['Sent', 'Received'],
    directionLabel: 'Direction',
    customTypeInput: false,
  },
  {
    key: 'note',
    label: 'Note',
    icon: StickyNote,
    directionOptions: null,
    directionLabel: null,
    customTypeInput: false,
  },
  {
    key: 'other',
    label: 'Other',
    icon: MoreHorizontal,
    directionOptions: null,
    directionLabel: 'Activity Type',
    customTypeInput: true,
  },
] as const;

type ActivityTypeKey = (typeof ACTIVITY_TYPES)[number]['key'];

/* ── Module-scoped draft (persists across close/reopen within session) ── */
let draftState: {
  activityType: ActivityTypeKey;
  direction: string;
  customType: string;
  date: string;
  time: string;
  ampm: 'AM' | 'PM';
  notes: string;
  recipient: string;
} | null = null;

/* ── Utility: combine date + time + ampm into a Date ──────── */
function combineDateAndTime(date: Date, time: string, ampm: 'AM' | 'PM'): Date {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const combined = new Date(date);
  combined.setHours(h, m, 0, 0);
  return combined;
}

/* ── Props ─────────────────────────────────────────────────── */
interface LogActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  currentUserName: string;
  onSave?: (activity: {
    type: string;
    direction: string;
    timestamp: Date;
    notes: string;
    notifyRecipient: string;
  }) => void;
}

/* ── Component ─────────────────────────────────────────────── */
export function LogActivityDialog({
  open,
  onOpenChange,
  leadName,
  currentUserName,
  onSave,
}: LogActivityDialogProps) {
  const now = new Date();

  const [activityType, setActivityType] = useState<ActivityTypeKey>(
    draftState?.activityType || 'call',
  );
  const [direction, setDirection] = useState(draftState?.direction || '');
  const [customType, setCustomType] = useState(draftState?.customType || '');
  const [date, setDate] = useState<Date>(
    draftState?.date ? new Date(draftState.date) : now,
  );
  const [time, setTime] = useState(
    draftState?.time || format(now, 'hh:mm'),
  );
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(
    (draftState?.ampm as 'AM' | 'PM') ||
      (format(now, 'aa').toUpperCase() as 'AM' | 'PM'),
  );
  const [notes, setNotes] = useState(draftState?.notes || '');
  const [recipient, setRecipient] = useState(draftState?.recipient || 'self');
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  const notesRef = useRef<HTMLTextAreaElement>(null);

  const currentTypeConfig = ACTIVITY_TYPES.find((t) => t.key === activityType)!;
  const isDirty = !!(direction || customType || notes || recipient !== 'self');
  const charLimit = 2000;

  /* ── Persist draft on change ──────────────────────────────── */
  useEffect(() => {
    if (open && isDirty) {
      draftState = {
        activityType,
        direction,
        customType,
        date: date.toISOString(),
        time,
        ampm,
        notes,
        recipient,
      };
    }
  }, [open, isDirty, activityType, direction, customType, date, time, ampm, notes, recipient]);

  /* ── Reset form ───────────────────────────────────────────── */
  const resetForm = useCallback(() => {
    const n = new Date();
    setActivityType('call');
    setDirection('');
    setCustomType('');
    setDate(n);
    setTime(format(n, 'hh:mm'));
    setAmpm(format(n, 'aa').toUpperCase() as 'AM' | 'PM');
    setNotes('');
    setRecipient('self');
    setNotesExpanded(false);
    draftState = null;
  }, []);

  /* ── Save handler ─────────────────────────────────────────── */
  const handleSave = useCallback(() => {
    const activity = {
      type: activityType,
      direction: currentTypeConfig.customTypeInput ? customType : direction,
      timestamp: combineDateAndTime(date, time, ampm),
      notes,
      notifyRecipient: recipient,
    };
    onSave?.(activity);
    resetForm();
    onOpenChange(false);
  }, [activityType, currentTypeConfig, customType, direction, date, time, ampm, notes, recipient, onSave, resetForm, onOpenChange]);

  /* ── Dirty-state close confirmation ───────────────────────── */
  const handleAttemptClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && isDirty) {
        setConfirmCloseOpen(true);
        return;
      }
      onOpenChange(nextOpen);
    },
    [isDirty, onOpenChange],
  );

  const handleConfirmDiscard = useCallback(() => {
    resetForm();
    setConfirmCloseOpen(false);
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  /* ── Keyboard shortcuts ───────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
        return;
      }
      // Number keys 1-5 to switch activity types (only when not in input/textarea)
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && /^[1-5]$/.test(e.key)) {
        e.preventDefault();
        setActivityType(ACTIVITY_TYPES[parseInt(e.key, 10) - 1].key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleSave]);

  /* ── Clear direction when switching type ──────────────────── */
  useEffect(() => {
    setDirection('');
    setCustomType('');
  }, [activityType]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleAttemptClose}>
        <DialogContent className="sm:max-w-[640px] p-0 gap-0">
          {/* HEADER */}
          <DialogHeader className="px-spacing-6 pt-spacing-6 pb-spacing-4">
            <DialogTitle className="text-base font-semibold text-text-default">
              Log Activity
            </DialogTitle>
            <DialogDescription className="text-sm text-[#344054]">
              Record an activity for {leadName}.
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="px-spacing-6 py-spacing-5 space-y-spacing-5">
            {/* ACTIVITY TYPE TABS */}
            <Tabs
              value={activityType}
              onValueChange={(v) => setActivityType(v as ActivityTypeKey)}
              className="w-full"
            >
              <TabsList className="w-full justify-start gap-spacing-6 bg-transparent border-b border-border-default rounded-none p-0 h-auto">
                {ACTIVITY_TYPES.map((t, idx) => {
                  const Icon = t.icon;
                  return (
                    <TabsTrigger
                      key={t.key}
                      value={t.key}
                      aria-keyshortcuts={String(idx + 1)}
                      className="inline-flex items-center gap-spacing-2 px-0 pb-spacing-2 pt-0 rounded-none bg-transparent shadow-none border-b-2 border-transparent text-text-4 font-medium text-text-muted hover:text-text-default transition-colors data-[state=active]:border-blue-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-text-default data-[state=active]:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {t.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* CONDITIONAL DIRECTION / CUSTOM TYPE */}
            {currentTypeConfig.directionLabel && (
              <div className="space-y-spacing-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Label
                  htmlFor="log-direction"
                  className="text-sm font-medium text-text-default"
                >
                  {currentTypeConfig.directionLabel}
                </Label>
                {currentTypeConfig.customTypeInput ? (
                  <input
                    id="log-direction"
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. In-person meeting, voicemail, postcard..."
                    className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  />
                ) : (
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger id="log-direction" className="w-full">
                      <SelectValue
                        placeholder={`Select ${currentTypeConfig.directionLabel.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {currentTypeConfig.directionOptions!.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* DATE + TIME ROW */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-spacing-3 items-end">
              {/* Date Picker */}
              <div className="space-y-spacing-2">
                <Label
                  htmlFor="log-date"
                  className="text-sm font-medium text-text-default"
                >
                  Date
                </Label>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="log-date"
                      type="button"
                      className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring transition-colors cursor-pointer inline-flex items-center gap-spacing-2 text-left"
                    >
                      <CalendarIcon
                        className="w-4 h-4 text-text-secondary"
                        aria-hidden="true"
                      />
                      {format(date, 'MM/dd/yyyy')}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
                          setDatePopoverOpen(false);
                        }
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Hour : Minute */}
              <div className="space-y-spacing-2">
                <Label
                  htmlFor="log-time"
                  className="text-sm font-medium text-text-default"
                >
                  Time
                </Label>
                <input
                  id="log-time"
                  type="text"
                  inputMode="numeric"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="02:45"
                  className="w-[80px] h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default text-center focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  maxLength={5}
                />
              </div>

              {/* AM/PM */}
              <div className="space-y-spacing-2">
                <Label className="sr-only">AM/PM</Label>
                <Select
                  value={ampm}
                  onValueChange={(v) => setAmpm(v as 'AM' | 'PM')}
                >
                  <SelectTrigger className="w-[72px]" aria-label="AM or PM">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-spacing-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="log-notes"
                  className="text-sm font-medium text-text-default"
                >
                  Notes
                </Label>
                <button
                  type="button"
                  onClick={() => setNotesExpanded(!notesExpanded)}
                  className="text-xs text-text-link hover:underline inline-flex items-center gap-1 cursor-pointer"
                  aria-label={notesExpanded ? 'Collapse notes' : 'Expand notes'}
                >
                  {notesExpanded ? (
                    <Minimize2 className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  )}
                  {notesExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <textarea
                ref={notesRef}
                id="log-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, charLimit))}
                placeholder="Type notes here..."
                rows={notesExpanded ? 10 : 4}
                className="w-full px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none transition-all duration-200"
              />
              <div className="flex justify-end">
                <span
                  className={`text-xs ${
                    notes.length > charLimit * 0.9
                      ? 'text-orange-100'
                      : 'text-[#344054]'
                  }`}
                  aria-live="polite"
                >
                  {notes.length} / {charLimit}
                </span>
              </div>
            </div>

            {/* RECIPIENT */}
            <div className="space-y-spacing-2">
              <Label
                htmlFor="log-recipient"
                className="text-sm font-medium text-text-default"
              >
                Send notification to
              </Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger id="log-recipient" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">No one (just log)</SelectItem>
                  <SelectItem value="me">
                    {currentUserName} (me)
                  </SelectItem>
                  <SelectItem value="lead">{leadName} (the lead)</SelectItem>
                  <SelectItem value="assignee">Assigned agent</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-spacing-6 py-spacing-4 border-t border-border-default flex flex-row items-center justify-between sm:justify-between">
            <div className="text-xs text-[#475467]">
              <kbd className="px-1.5 py-0.5 bg-bg-muted rounded-1 text-[10px] font-mono border border-border-default">
                &#8984;&#8629;
              </kbd>
              <span className="ml-1">to save</span>
            </div>
            <div className="flex gap-spacing-2">
              <button
                type="button"
                className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
                onClick={() => handleAttemptClose(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-9 px-spacing-4 rounded-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIRTY-STATE CONFIRM */}
      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without
              logging this activity?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmCloseOpen(false)}>
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDiscard}
              className="bg-red-100 hover:bg-red-110 text-white"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
