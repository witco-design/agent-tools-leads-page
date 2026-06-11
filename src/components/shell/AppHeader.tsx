import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  MessageSquare,
  MessageSquareDot,
  Globe,
  ChevronDown,
  ExternalLink,
  LogOut,
  Settings,
  Check,
  BookOpen,
  Trophy,
  Users,
  Newspaper,
  Share2,
  Key,
  CreditCard,
  FileText,
  Shield,
  Accessibility,
  CircleUserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ── Data ─────────────────────────────────────────────────────────
const WEBSITES = [
  { domain: 'www.totallynotrealgeeks.com' },
  { domain: 'www.luxuryhomes.com' },
  { domain: 'www.beachfrontrealty.com' },
];

const USER_FIRST_NAME = 'Alina';
const USER_NAME = 'Alina Kāne';
const USER_EMAIL = 'alina.kane@realgeeks.com';
const LEAD_NAME = 'Camille Dubois';

function stripWww(domain: string) {
  return domain.replace(/^www\./, '');
}

// ── Component ────────────────────────────────────────────────────
export function AppHeader() {
  const [currentDomain, setCurrentDomain] = useState(WEBSITES[0].domain);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // Chat Support animation sequencing
  const [animPhase, setAnimPhase] = useState<'pulse' | 'dot' | 'done'>('pulse');
  const [isOnline] = useState(true);

  // Nudge popover state
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nudgeRef = useRef<HTMLDivElement>(null);

  // Animation sequence: button pulses 4× (~3.2s) → dot starts pulsing → badge burst
  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase('dot'), 3200);
    const t2 = setTimeout(() => setAnimPhase('done'), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Focus mobile search input when overlay opens
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const openChat = () => toast('Opening support chat…');
  const signOut = () => toast('Signing out…');
  const markAllRead = () => setUnreadCount(0);
  const switchTo = (domain: string) => {
    setCurrentDomain(domain);
    toast(`Switched to ${stripWww(domain)}`);
  };

  // ── Nudge hover/focus handlers ──
  const showNudge = useCallback(() => {
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = null;
    setNudgeVisible(true);
  }, []);

  const startHideNudge = useCallback(() => {
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => setNudgeVisible(false), 250);
  }, []);

  const cancelHideNudge = useCallback(() => {
    if (nudgeTimer.current) {
      clearTimeout(nudgeTimer.current);
      nudgeTimer.current = null;
    }
  }, []);

  const dismissNudge = useCallback(() => {
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    setNudgeVisible(false);
  }, []);

  return (
    <header data-component="AppHeader" className="h-14 sticky top-0 z-40 bg-white border-b border-[#E4E7EC] flex items-center px-spacing-6 gap-spacing-4">

      {/* ── LEFT: Breadcrumb ──────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="shrink-0">
        <ol className="flex items-center gap-spacing-2 text-sm whitespace-nowrap">
          <li>
            <a
              href="/dashboard"
              className="font-medium text-[#3E60C9] hover:text-[#3840A9] hover:underline transition"
            >
              <span className="hidden md:inline">Dashboard</span>
              <span className="md:hidden">Dashboard</span>
            </a>
          </li>
          <li className="text-[#667085]" aria-hidden="true">/</li>
          <li>
            <span
              className="font-medium text-[#475467] truncate max-w-[180px] inline-block align-bottom"
              aria-current="page"
            >
              {LEAD_NAME}
            </span>
          </li>
        </ol>
      </nav>

      {/* ── SPACER ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0" />

      {/* ── RIGHT CLUSTER ─────────────────────────────────── */}
      <div className="flex items-center gap-spacing-3 shrink-0">

        {/* ────────────────────────────────────────────────── */}
        {/* Search                                            */}
        {/* ────────────────────────────────────────────────── */}

        {/* Search — <md: icon button → overlay */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Search"
              className="md:hidden h-9 w-9 inline-flex items-center justify-center text-[#475467] hover:bg-[#F9FAFB] rounded-1 transition cursor-pointer shrink-0"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Search</TooltipContent>
        </Tooltip>

        {/* Search — md+: focus-expanding input */}
        <div className="hidden md:flex justify-end relative shrink-0">
          <Search className="absolute left-spacing-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none z-10" />
          <Input
            type="search"
            placeholder="Search your CRM"
            className={cn(
              'h-10 pl-9 pr-spacing-3 rounded-1 border border-[#E4E7EC] bg-white text-sm text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#3E60C9] focus:ring-1 focus:ring-[#3E60C9] transition-[width] duration-300 ease-out',
              searchFocused ? 'w-[440px]' : 'w-[320px]',
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* ────────────────────────────────────────────────── */}
        {/* Chat Support                                      */}
        {/* Blue-tinted bg, grey content, green live dot      */}
        {/* Labeled ≥1080px; icon-only below                  */}
        {/* ────────────────────────────────────────────────── */}
        <Popover open={nudgeVisible} onOpenChange={() => {}}>
          <PopoverTrigger asChild>
            <div className="relative shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={buttonRef}
                    type="button"
                    aria-label="Chat Support"
                    onClick={openChat}
                    onMouseEnter={showNudge}
                    onMouseLeave={startHideNudge}
                    onFocus={showNudge}
                    onBlur={startHideNudge}
                    className={cn(
                      'inline-flex items-center justify-center gap-spacing-2 h-10 rounded-1 text-sm font-semibold transition cursor-pointer',
                      'bg-[#3E60C9]/[0.08] hover:bg-[#3E60C9]/[0.14]',
                      'w-10 min-[1080px]:w-auto min-[1080px]:px-spacing-4',
                      animPhase === 'pulse' && 'animate-chat-pulse',
                    )}
                  >
                    <span className="relative shrink-0">
                      <MessageSquare className="w-5 h-5 text-[#475467]" />
                      {/* Live dot */}
                      <span
                        className={cn(
                          'absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-round ring-2 ring-white',
                          isOnline ? 'bg-[#216f51]' : 'bg-[#667085]',
                          isOnline && animPhase !== 'pulse' && 'animate-dot-pulse',
                        )}
                      />
                    </span>
                    <span className="hidden min-[1080px]:inline whitespace-nowrap text-[#101828]">
                      Chat Support
                    </span>
                  </button>
                </TooltipTrigger>
                {/* Tooltip only when icon-only (below 1080px) */}
                <TooltipContent side="bottom" sideOffset={6} className="min-[1080px]:hidden">Chat Support</TooltipContent>
              </Tooltip>
            </div>
          </PopoverTrigger>

          {/* ── Contextual Nudge Popover ── */}
          {nudgeVisible && (
            <PopoverContent
              side="bottom"
              sideOffset={8}
              align="center"
              className="w-[280px] p-spacing-4 bg-white border border-[#E4E7EC] rounded-1 shadow-lg"
              onMouseEnter={cancelHideNudge}
              onMouseLeave={startHideNudge}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              ref={nudgeRef}
            >
              {/* Close X */}
              <button
                type="button"
                aria-label="Close"
                className="absolute top-2 right-2 h-6 w-6 inline-flex items-center justify-center text-[#667085] hover:text-[#101828] rounded-1 transition cursor-pointer"
                onClick={dismissNudge}
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-sm font-semibold text-[#101828]">Need a hand?</p>
              <p className="text-sm text-[#475467] mt-0.5">Get instant answers now.</p>

              <div className="flex items-center gap-spacing-2 mt-spacing-3">
                <span className={cn(
                  'w-2 h-2 rounded-round shrink-0',
                  isOnline ? 'bg-[#216f51]' : 'bg-[#667085]',
                )} />
                <span className="text-xs font-medium text-[#216f51]">Available now</span>
              </div>

              <button
                type="button"
                className="mt-spacing-3 h-9 px-spacing-4 w-full inline-flex items-center justify-center bg-[#3E60C9] hover:bg-[#3840A9] text-white text-sm font-medium rounded-1 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E60C9] focus-visible:ring-offset-2"
                onClick={() => {
                  dismissNudge();
                  openChat();
                }}
              >
                Chat now
              </button>
            </PopoverContent>
          )}
        </Popover>

        {/* ────────────────────────────────────────────────── */}
        {/* Notifications                                     */}
        {/* Bell + label ≥1080px; icon-only below             */}
        {/* ────────────────────────────────────────────────── */}
        <Popover
          open={isNotifOpen}
          onOpenChange={(open) => {
            setIsNotifOpen(open);
            if (open) markAllRead();
          }}
          modal={false}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="inline-flex items-center gap-spacing-2 h-9 min-[1080px]:h-10 min-[1080px]:px-spacing-3 rounded-1 text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] transition cursor-pointer shrink-0 relative w-9 min-[1080px]:w-auto justify-center min-[1080px]:justify-start"
                >
                  <span className="relative shrink-0">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className={cn(
                        'absolute -top-1 -right-1 min-w-4 h-4 px-1 inline-flex items-center justify-center text-[10px] font-semibold text-white bg-[#ec423d] rounded-round ring-2 ring-white',
                        animPhase === 'done' && 'animate-badge-burst',
                      )}>
                        {unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="hidden min-[1080px]:inline text-sm font-medium text-[#101828] whitespace-nowrap">
                    Notifications
                  </span>
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="min-[1080px]:hidden">Notifications</TooltipContent>
          </Tooltip>

          <PopoverContent className="w-[360px] p-0 bg-white border border-[#E4E7EC] rounded-1 shadow-lg" align="end">
            <div className="px-spacing-4 py-spacing-3 border-b border-[#E4E7EC] bg-[#F9FAFB]">
              <h3 className="text-sm font-semibold text-[#101828]">Refer-A-Friend Program</h3>
            </div>
            <div className="px-spacing-4 py-spacing-4 space-y-spacing-3">
              <p className="text-sm text-[#3E60C9] font-medium">Refer Real Geeks. Earn $200.</p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="h-8 px-spacing-3 inline-flex items-center bg-[#216f51] hover:bg-[#027A48] text-white rounded-1 text-sm font-medium transition cursor-pointer"
                  onClick={() => toast('Opening referral form…')}
                >
                  Earn $200
                </button>
                <button
                  type="button"
                  className="text-xs text-[#ec423d] hover:text-[#B42318] transition cursor-pointer"
                  onClick={() => { setIsNotifOpen(false); toast('Notification deleted'); }}
                >
                  Delete Notification
                </button>
              </div>
            </div>
            <div className="px-spacing-4 py-spacing-3 border-t border-[#E4E7EC] text-center">
              <button
                type="button"
                onClick={() => setIsNotifOpen(false)}
                className="text-sm font-medium text-[#3E60C9] hover:text-[#3840A9] transition cursor-pointer"
              >
                Close Notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* ────────────────────────────────────────────────── */}
        {/* Resources (was Help & Support)                    */}
        {/* Labeled ≥1080px; icon-only below                  */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Resources"
                  className="inline-flex items-center gap-spacing-2 h-9 min-[1080px]:h-10 min-[1080px]:px-spacing-3 rounded-1 text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] transition cursor-pointer shrink-0 w-9 min-[1080px]:w-auto justify-center min-[1080px]:justify-start"
                >
                  <HelpCircle className="w-5 h-5 shrink-0" />
                  <span className="hidden min-[1080px]:inline text-sm font-medium text-[#101828] whitespace-nowrap">
                    Resources
                  </span>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="min-[1080px]:hidden">Resources</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[280px] bg-white border border-[#E4E7EC] rounded-1 shadow-lg" align="end">
            <DropdownMenuLabel className="text-sm font-semibold text-[#101828] px-spacing-3 py-spacing-2">
              Resources
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E4E7EC]" />

            {/* Highlighted Chat Support row */}
            <DropdownMenuItem
              onClick={openChat}
              className="px-spacing-3 py-spacing-2 cursor-pointer bg-[#3E60C9]/[0.08] hover:bg-[#3E60C9]/[0.14] focus:bg-[#3E60C9]/[0.14]"
            >
              <MessageSquareDot className="w-4 h-4 mr-spacing-2 text-[#3E60C9] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">Chat Support</span>
                <span className="text-xs text-[#667085]">Get real-time help</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Product Training…')}>
              <BookOpen className="w-4 h-4 mr-spacing-2 text-[#667085] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">Product Training</span>
                <span className="text-xs text-[#667085]">Everything you need to know about Real Geeks</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Live Coaching Events…')}>
              <Trophy className="w-4 h-4 mr-spacing-2 text-[#667085] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">Live Coaching Events</span>
                <span className="text-xs text-[#667085]">Learn from the best in the business</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening FB Mastermind Group…')}>
              <Users className="w-4 h-4 mr-spacing-2 text-[#667085] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">FB Mastermind Group</span>
                <span className="text-xs text-[#667085]">Ask and answer questions with the Real Geeks community</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening What\'s New…')}>
              <Newspaper className="w-4 h-4 mr-spacing-2 text-[#667085] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">What&apos;s New</span>
                <span className="text-xs text-[#667085]">Take a look at new and upcoming features</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Send a Referral…')}>
              <Share2 className="w-4 h-4 mr-spacing-2 text-[#667085] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">Send a Referral</span>
                <span className="text-xs text-[#667085]">Earn $200 for each referral</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ────────────────────────────────────────────────── */}
        {/* Account (includes domain switcher)                */}
        {/* Icon + first name ≥1080px; icon-only below        */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="inline-flex items-center gap-spacing-2 h-9 px-spacing-2 rounded-1 hover:bg-[#F9FAFB] transition cursor-pointer shrink-0"
                >
                  <CircleUserRound className="w-5 h-5 text-[#475467] shrink-0" />
                  <span className="hidden min-[1080px]:inline text-sm font-medium text-[#101828] whitespace-nowrap">
                    {USER_FIRST_NAME}
                  </span>
                  <ChevronDown className="hidden min-[1080px]:block w-4 h-4 text-[#667085] shrink-0" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="min-[1080px]:hidden">{USER_NAME}</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[300px] bg-white border border-[#E4E7EC] rounded-1 shadow-lg" align="end">
            {/* User identity */}
            <div className="px-spacing-3 py-spacing-3 flex items-center gap-spacing-3 border-b border-[#E4E7EC]">
              <CircleUserRound className="w-8 h-8 text-[#475467] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#101828] truncate">{USER_NAME}</p>
                <p className="text-xs text-[#667085] truncate">{USER_EMAIL}</p>
              </div>
            </div>

            {/* Switch Website section */}
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-[#667085] px-spacing-3 pt-spacing-2 pb-1">
              Switch Website
            </DropdownMenuLabel>
            {WEBSITES.map((site) => {
              const isCurrent = site.domain === currentDomain;
              return (
                <DropdownMenuItem
                  key={site.domain}
                  onClick={() => switchTo(site.domain)}
                  className={cn(
                    'px-spacing-3 py-spacing-2 cursor-pointer',
                    isCurrent
                      ? 'bg-[#3E60C9]/[0.08] focus:bg-[#3E60C9]/[0.14]'
                      : 'focus:bg-[#F9FAFB]',
                  )}
                >
                  <Globe className="w-4 h-4 mr-spacing-2 text-[#475467] shrink-0" />
                  <span className={cn(
                    'text-sm flex-1 truncate',
                    isCurrent ? 'font-semibold text-[#101828]' : 'text-[#101828]',
                  )}>
                    {stripWww(site.domain)}
                  </span>
                  {isCurrent && <Check className="w-4 h-4 text-[#3E60C9] shrink-0 ml-spacing-2" />}
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-spacing-2 text-[#98A2B3] hover:text-[#475467] transition"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Visit ${stripWww(site.domain)}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="bg-[#E4E7EC]" />

            {/* Account actions */}
            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Account Settings…')}>
              <Settings className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Account Settings</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Change Password…')}>
              <Key className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Change Password</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Billing…')}>
              <CreditCard className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Billing</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#E4E7EC]" />

            {/* Legal/info */}
            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Terms & Conditions…')}>
              <FileText className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Terms &amp; Conditions</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Privacy Policy…')}>
              <Shield className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Privacy Policy</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening California Privacy Notice…')}>
              <Globe className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">California Privacy Notice</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Accessibility…')}>
              <Accessibility className="w-4 h-4 mr-spacing-2 text-[#667085]" />
              <span className="text-sm text-[#101828] flex-1">Accessibility</span>
              <ExternalLink className="w-3 h-3 ml-auto text-[#98A2B3]" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#E4E7EC]" />

            {/* Sign Out */}
            <DropdownMenuItem
              onClick={signOut}
              className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#FEE4E2] text-[#ec423d]"
            >
              <LogOut className="w-4 h-4 mr-spacing-2" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ────────────────────────────────────────────────────── */}
      {/* Mobile Search Overlay (<md)                           */}
      {/* ────────────────────────────────────────────────────── */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-50 bg-white border-b border-[#E4E7EC] px-spacing-4 py-spacing-3 flex items-center gap-spacing-3 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-spacing-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none z-10" />
            <Input
              ref={mobileSearchRef}
              type="search"
              placeholder="Search your CRM"
              className="h-10 w-full pl-9 pr-spacing-3 rounded-1 border border-[#E4E7EC] bg-white text-sm text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#3E60C9] focus:ring-1 focus:ring-[#3E60C9]"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setMobileSearchOpen(false);
              }}
            />
          </div>
          <button
            type="button"
            aria-label="Close search"
            className="h-9 w-9 inline-flex items-center justify-center text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] rounded-1 transition cursor-pointer shrink-0"
            onClick={() => setMobileSearchOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
