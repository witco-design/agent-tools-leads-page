import { useState, useRef, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MessagesSquare,
  LogIn,
  MoreHorizontal,
  Pencil,
  Video,
  Lock,
  Bookmark,
  FileSignature,
  Unlock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { TruncatedText } from './TruncatedText';

interface ActionButton {
  label: string;
  icon: React.ElementType;
}

const actionButtons: ActionButton[] = [
  { label: 'Call', icon: Phone },
  { label: 'Text', icon: MessageSquare },
  { label: 'Email', icon: Mail },
  { label: 'Chat', icon: MessagesSquare },
  { label: 'View as Lead', icon: LogIn },
];

export function LeadHeader() {
  const [leadName, setLeadName] = useState('Camille Dubois');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(leadName);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = leadName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Modal states
  const [callOpen, setCallOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [textBody, setTextBody] = useState('');

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditValue(leadName);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      setLeadName(trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(leadName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const openModal = (label: string) => {
    switch (label) {
      case 'Call':
        setCallOpen(true);
        break;
      case 'Text':
        setTextOpen(true);
        break;
      case 'Email':
        setEmailOpen(true);
        break;
      case 'Chat':
        setChatModalOpen(true);
        break;
      case 'View as Lead':
        setLoginOpen(true);
        break;
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      {/* Lead identity + actions */}
      <div data-component="LeadHeader" className="py-spacing-2 flex items-center justify-between gap-spacing-4">
        {/* Avatar + Name + Pencil — group for hover reveal */}
        <div className="group flex items-center gap-spacing-3 flex-1 min-w-0">
          {/* Lock icon */}
          <Lock className="w-4 h-4 text-text-muted shrink-0" strokeWidth={2.25} />

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 min-w-[280px] max-w-[700px] text-text-7 font-semibold text-text-default whitespace-nowrap
                         bg-white border border-border-default rounded-1
                         px-spacing-2 py-0 outline-none
                         focus:border-blue-110 focus:ring-2 focus:ring-blue-40 focus:ring-offset-0"
            />
          ) : (
            <>
              <h1
                className="text-text-7 font-semibold text-text-default whitespace-nowrap cursor-default min-w-0"
                onDoubleClick={startEditing}
              >
                <TruncatedText fullText={leadName}>{leadName}</TruncatedText>
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-1
                               opacity-0 group-hover:opacity-100 focus:opacity-100
                               transition-opacity duration-200 ease-out
                               text-text-muted hover:text-text-link hover:bg-gray-30
                               focus:outline-none focus:ring-2 focus:ring-blue-40"
                    aria-label="Edit lead name"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit lead name</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>

        {/* Action pill buttons */}
        <div className="flex items-center gap-spacing-2 flex-shrink-0">
          {actionButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <Tooltip key={btn.label}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => openModal(btn.label)}
                    className="inline-flex items-center h-9 w-9 xl:w-auto xl:px-spacing-4 rounded-round justify-center xl:justify-start xl:gap-spacing-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 focus:outline-none focus:ring-2 focus:ring-blue-40 focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150 cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{btn.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="xl:hidden">
                  <p>{btn.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* More button — DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center w-9 h-9 rounded-round border border-border-default bg-white text-icon-default hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] bg-white border border-[#E4E7EC] rounded-1 shadow-lg p-spacing-1"
            >
              <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
                <Bookmark className="w-4 h-4 mr-spacing-2 text-[#475467]" />
                <span className="text-sm text-[#101828]">Saved Searches</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
                <FileSignature className="w-4 h-4 mr-spacing-2 text-[#475467]" />
                <span className="text-sm text-[#101828]">Send Agreement</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
                <Mail className="w-4 h-4 mr-spacing-2 text-[#475467]" />
                <span className="text-sm text-[#101828]">Send Postcard</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
                <Video className="w-4 h-4 mr-spacing-2 text-[#475467]" />
                <span className="text-sm text-[#101828]">Send BombBomb</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
                <Unlock className="w-4 h-4 mr-spacing-2 text-[#475467]" />
                <span className="text-sm text-[#101828]">Unlock site photos</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Vertical separator before nav cluster */}
          <div className="h-6 w-px bg-border-default mx-spacing-1" />

          {/* Nav cluster — prev / back-to-list / next */}
          <div className="inline-flex items-center gap-spacing-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Previous lead"
                  className="h-9 w-9 inline-flex items-center justify-center bg-white border border-border-default rounded-1 text-text-secondary hover:bg-bg-muted transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Previous lead</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      window.location.href = '/leads';
                    }
                  }}
                  className="h-9 px-spacing-3 inline-flex items-center gap-spacing-1 bg-white border border-border-default rounded-1 text-text-4 font-medium text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
                >
                  <List className="w-4 h-4 xl:hidden" />
                  <span className="hidden xl:inline">Back to List</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="xl:hidden"><p>Back to List</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Next lead"
                  className="h-9 w-9 inline-flex items-center justify-center bg-white border border-border-default rounded-1 text-text-secondary hover:bg-bg-muted transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Next lead</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

      </div>

      {/* ── CALL MODAL ──────────────────────────────────────── */}
      <Dialog open={callOpen} onOpenChange={setCallOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Call {leadName}</DialogTitle>
            <DialogDescription>Place a call to this lead.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-spacing-4 py-spacing-4">
            <div className="w-16 h-16 rounded-full bg-green-30 flex items-center justify-center">
              <Phone className="w-8 h-8 text-green-90" />
            </div>
            <h2 className="text-text-5 font-semibold text-text-default">{leadName}</h2>
            <p className="font-mono text-text-4 text-text-default">(415) 555-0142</p>
            <p className="text-text-4 text-text-secondary">Ready to call</p>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setCallOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-green-90 text-white text-text-4 font-semibold hover:bg-green-100 transition-colors cursor-pointer"
              onClick={() => {
                setCallOpen(false);
                toast.success('Calling Camille Dubois at (415) 555-0142…');
              }}
            >
              Start Call
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── TEXT MODAL ──────────────────────────────────────── */}
      <Dialog open={textOpen} onOpenChange={(o) => { setTextOpen(o); if (!o) setTextBody(''); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Send a text to {leadName}</DialogTitle>
            <DialogDescription>Compose and send a text message.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div className="flex items-center gap-spacing-3">
              <div className="w-8 h-8 rounded-full bg-blue-110 flex items-center justify-center shrink-0">
                <span className="text-text-3 font-semibold text-white">{initials}</span> {/* text-text-3 OK: avatar initials in 32px circle */}
              </div>
              <div>
                <p className="text-text-4 font-semibold text-text-default">{leadName}</p>
                <p className="text-text-4 text-text-secondary">(415) 555-0142</p>
              </div>
            </div>
            <textarea
              rows={5}
              placeholder="Type your message…"
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
              className="w-full min-h-[120px] px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
            />
            <p className="text-right text-text-4 text-text-muted">{textBody.length} / 160</p>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => { setTextOpen(false); setTextBody(''); }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => {
                setTextOpen(false);
                setTextBody('');
                toast.success('Text sent to Camille Dubois');
              }}
            >
              Send
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EMAIL MODAL ─────────────────────────────────────── */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
            <DialogDescription>Send an email to this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">To</label>
              <input
                type="text"
                readOnly
                value="Camille Dubois <cdubois@realgeeks.com>"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-gray-30 text-text-4 text-text-secondary"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Subject</label>
              <input
                type="text"
                placeholder="Subject line"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Body</label>
              <textarea
                rows={8}
                placeholder="Write your email…"
                className="w-full min-h-[200px] px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEmailOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => {
                setEmailOpen(false);
                toast.success('Email sent to cdubois@realgeeks.com');
              }}
            >
              Send Email
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── CHAT MODAL ──────────────────────────────────────── */}
      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Live Chat with {leadName}</DialogTitle>
            <DialogDescription>Real-time conversation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div className="h-[200px] bg-gray-30 rounded-1 p-spacing-3 overflow-y-auto">
              <div className="flex flex-col gap-spacing-3">
                {/* Agent message */}
                <div className="self-start max-w-[80%] bg-white rounded-1 rounded-tl-none px-spacing-3 py-spacing-2 shadow-sm">
                  <p className="text-text-4 text-text-default">
                    Hi Camille! Just checking in — have you had a chance to review the listings I sent?
                  </p>
                  <span className="text-text-1 text-text-muted mt-spacing-1 block">
                    You &middot; 2 min ago
                  </span>
                </div>
                {/* Lead message */}
                <div className="self-end max-w-[80%] bg-blue-30 rounded-1 rounded-tr-none px-spacing-3 py-spacing-2">
                  <p className="text-text-4 text-text-default">
                    Yes! I really liked the one on Shaughnessy. Can we schedule a tour?
                  </p>
                  <span className="text-text-1 text-text-muted mt-spacing-1 block text-right">
                    Camille &middot; 1 min ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-spacing-2">
              <input
                type="text"
                placeholder="Type a message…"
                className="flex-1 h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => {
                setChatModalOpen(false);
                toast('Chat ended');
              }}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── VIEW AS LEAD MODAL ────────────────────────────────── */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>View as {leadName}</DialogTitle>
            <DialogDescription>See the website as this lead sees it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div className="flex items-start gap-spacing-3 bg-orange-10 border border-orange-40 rounded-1 p-spacing-3">
              <AlertTriangle className="w-5 h-5 text-orange-100 shrink-0 mt-0.5" />
              <p className="text-text-4 text-text-default">
                You&apos;re about to view the website as {leadName}. Your activity will not be tracked during this session.
              </p>
            </div>
            <p className="text-text-4 text-text-secondary">
              This opens a new session showing saved searches, favorites, and property history exactly as the lead sees them.
            </p>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setLoginOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-1 bg-orange-100 text-white text-text-4 font-semibold hover:bg-orange-110 transition-colors cursor-pointer"
              onClick={() => {
                setLoginOpen(false);
                toast('Viewing as Camille Dubois — your activity will not be tracked');
              }}
            >
              View as Lead
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  );
}
