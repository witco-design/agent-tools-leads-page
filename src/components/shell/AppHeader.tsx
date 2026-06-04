import { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  MessageCircle,
  ArrowLeft,
  Globe,
  ChevronDown,
  ExternalLink,
  Keyboard,
  MessageSquare,
  Sparkles,
  LogOut,
  Settings,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// ── Data ─────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: '1', title: 'Camille Dubois is online now', time: '2 min ago', read: false },
  { id: '2', title: 'New lead assigned: Mike Chen', time: '15 min ago', read: false },
  { id: '3', title: 'Follow-up reminder: Call Sarah Lee', time: '1 hour ago', read: true },
];

const SITES = [
  { id: '1', name: 'www.testsite.com', active: true },
  { id: '2', name: 'www.myrealestate.com', active: false },
  { id: '3', name: 'www.luxuryhomes.com', active: false },
];

// ── Component ────────────────────────────────────────────────────
export function AppHeader() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeSite, setActiveSite] = useState('www.testsite.com');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast('All notifications marked as read');
  };

  const handleSiteSwitch = (siteName: string) => {
    setActiveSite(siteName);
    toast(`Switched to ${siteName}`);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    setFeedbackOpen(false);
    setFeedbackText('');
    toast.success('Thank you for your feedback!');
  };

  return (
    <>
      <header
        className="shrink-0 flex items-center px-4 bg-bg-card border-b border-border-default"
        style={{ height: 56 }}
      >
        {/* 1. Back button + section label */}
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/leads';
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2 hover:bg-bg-muted transition-colors cursor-pointer shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-text-link" strokeWidth={2.25} />
          <span className="text-text-4 font-semibold whitespace-nowrap text-text-link">
            CRM / Lead Manager
          </span>
        </button>

        {/* 2. Spacer */}
        <div className="flex-1" />

        {/* 4. Search */}
        <div className="relative hidden md:block w-full max-w-[420px] mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search your CRM"
            className="w-full h-9 pl-9 pr-3 bg-bg-card rounded-full text-text-4 font-normal placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus border border-border-default text-text-default"
          />
        </div>

        {/* 5. Right cluster */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Chat with Support pill */}
          <button
            type="button"
            onClick={() => toast('Opening support chat…')}
            className="hidden lg:inline-flex items-center gap-1.5 h-8 px-3 rounded-2 border border-border-default bg-bg-card text-text-default text-text-4 font-normal hover:bg-bg-muted transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-text-muted" />
            <span>Chat with Support</span>
          </button>

          {/* Bell icon with badge */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative w-8 h-8 flex items-center justify-center rounded-2 hover:bg-bg-muted transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-text-muted" />
                {unreadCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center rounded-full text-white font-semibold leading-none bg-error-text"
                    style={{
                      top: 2,
                      right: 2,
                      width: 16,
                      height: 16,
                      fontSize: 10,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] p-0">
              <div className="p-spacing-3 border-b border-border-default flex items-center justify-between">
                <h4 className="text-text-4 font-semibold text-text-default">Notifications</h4>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-spacing-3 py-spacing-2 border-b border-border-default last:border-b-0 hover:bg-gray-30 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-blue-20/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-spacing-2">
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-round bg-blue-110 mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-text-4 font-normal text-text-default">{notif.title}</p>
                        <p className="text-text-4 text-text-muted">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-spacing-3 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => toast('Navigating to all notifications…')}
                  className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer w-full text-center"
                >
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-2 hover:bg-bg-muted transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem className="cursor-pointer" onClick={() => toast('Opening documentation…')}>
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setShortcutsOpen(true)}>
                <Keyboard className="w-3.5 h-3.5 mr-2" />
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setFeedbackOpen(true)}>
                <MessageSquare className="w-3.5 h-3.5 mr-2" />
                Submit Feedback
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => toast('Opening release notes…')}>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                What&apos;s New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separator */}
          <div className="hidden lg:block w-px h-6 bg-border-default mx-1" />

          {/* "Logged in as {Name}" — user menu trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-2 hover:bg-bg-muted transition-colors cursor-pointer whitespace-nowrap">
                <span className="text-text-4 text-text-muted">Logged in as</span>
                <span className="text-text-4 font-semibold text-text-default">Alina Kāne</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 shrink-0 text-text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem className="cursor-pointer" onClick={() => toast('Opening account settings…')}>
                <Settings className="w-3.5 h-3.5 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-80" onClick={() => toast('Signing out…')}>
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden md:flex items-center gap-1 text-text-4 font-normal text-text-link hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[150px]">{activeSite}</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {SITES.map((site) => (
                <DropdownMenuItem
                  key={site.id}
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => handleSiteSwitch(site.name)}
                >
                  <span>{site.name}</span>
                  {activeSite === site.name && <Check className="w-4 h-4 text-blue-110" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-text-link font-semibold"
                onClick={() => toast('Opening site creation wizard…')}
              >
                + Add site…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Keyboard Shortcuts Dialog ─────────────────────── */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Quick actions to speed up your workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-3 py-spacing-2">
            {[
              ['⌘ + K', 'Quick search'],
              ['⌘ + N', 'New note'],
              ['⌘ + Shift + E', 'Compose email'],
              ['⌘ + Shift + C', 'Start call'],
              ['Esc', 'Close dialog / cancel'],
              ['⌘ + /', 'Toggle keyboard shortcuts'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-text-4 text-text-default">{desc}</span>
                <kbd className="inline-flex items-center h-6 px-2 rounded-2 bg-gray-40 text-text-3 font-mono text-text-secondary border border-border-default"> {/* text-text-3 OK: keyboard shortcut hint */}
                  {key}
                </kbd>
              </div>
            ))}
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => setShortcutsOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit Feedback Dialog ────────────────────────── */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>Help us improve your experience.</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you think…"
              className="w-full px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setFeedbackOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!feedbackText.trim()}
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFeedbackSubmit}
            >
              Submit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
