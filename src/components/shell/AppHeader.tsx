import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  MessageCircle,
  ArrowLeft,
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
  MoreHorizontal,
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

const USER_NAME = 'Alina Kāne';
const USER_EMAIL = 'alina.kane@realgeeks.com';

function stripWww(domain: string) {
  return domain.replace(/^www\./, '');
}

// ── Idle detection hook ──────────────────────────────────────────
function useIdleDetection(thresholdMs: number, onIdle: () => void) {
  const stableOnIdle = useCallback(onIdle, [onIdle]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(stableOnIdle, thresholdMs);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [thresholdMs, stableOnIdle]);
}

// ── Component ────────────────────────────────────────────────────
export function AppHeader() {
  const [currentDomain, setCurrentDomain] = useState(WEBSITES[0].domain);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // Chat with Support animations
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFirstLoad(false), 3200); // 2 pulses × 1.6s
    return () => clearTimeout(timer);
  }, []);

  useIdleDetection(
    20000,
    useCallback(() => {
      setIsIdle(true);
      setTimeout(() => setIsIdle(false), 600);
    }, []),
  );

  // Focus mobile search input when overlay opens
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const openChat = () => toast('Opening support chat…');
  const signOut = () => toast('Signing out…');
  const markAllRead = () => {
    setUnreadCount(0);
  };
  const switchTo = (domain: string) => {
    setCurrentDomain(domain);
    toast(`Switched to ${stripWww(domain)}`);
  };

  return (
    <header className="h-14 sticky top-0 z-40 bg-white border-b border-[#E4E7EC] flex items-center px-spacing-4 md:px-spacing-6 gap-spacing-3 md:gap-spacing-4">

      {/* ── LEFT: CRM Breadcrumb ──────────────────────────── */}
      <a
        href="/leads"
        className="inline-flex items-center gap-spacing-2 text-sm font-medium text-[#3E60C9] hover:text-[#3840A9] transition shrink-0 whitespace-nowrap"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        {/* Stage D (<md): arrow only. Stage A/B/C (md+): full breadcrumb */}
        <span className="hidden md:inline">CRM / Lead Manager</span>
      </a>

      {/* ── SPACER ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0" />

      {/* ── RIGHT CLUSTER (search + utilities) ──────────── */}
      <div className="flex items-center gap-spacing-2 md:gap-spacing-3 shrink-0">

        {/* ────────────────────────────────────────────────── */}
        {/* Search                                            */}
        {/* ────────────────────────────────────────────────── */}

        {/* Search — Stage D (<md): icon button that opens overlay */}
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

        {/* Search — Stage A/B/C (md+): focus-expanding input */}
        {/* xl: 320→440, lg: 260→400, md: 200→360 */}
        <div className="hidden md:flex justify-end relative shrink-0">
          <Search className="absolute left-spacing-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none z-10" />
          <Input
            type="search"
            placeholder="Search your CRM"
            className={cn(
              'h-10 pl-9 pr-spacing-3 rounded-2 border border-[#E4E7EC] bg-white text-sm text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#3E60C9] focus:ring-1 focus:ring-[#3E60C9] transition-[width] duration-300 ease-out',
              searchFocused
                ? 'w-[360px] lg:w-[400px] xl:w-[440px]'
                : 'w-[200px] lg:w-[260px] xl:w-[320px]',
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* ────────────────────────────────────────────────── */}
        {/* Chat with Support                                 */}
        {/* Visible at md+, hidden below md (moves to kebab)  */}
        {/* xl: icon + label. lg/md: icon only                */}
        {/* ────────────────────────────────────────────────── */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Chat with Support"
              onClick={openChat}
              className={cn(
                'hidden md:inline-flex h-9 w-9 items-center justify-center gap-spacing-2 text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] rounded-1 text-sm font-medium transition cursor-pointer shrink-0',
                'xl:w-auto xl:px-spacing-4 xl:border xl:border-[#E4E7EC] xl:bg-white xl:text-[#101828] xl:shadow-sm',
                isFirstLoad && 'animate-pulse-blue',
                isIdle && 'animate-shake',
              )}
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              {/* Label only at xl */}
              <span className="hidden xl:inline whitespace-nowrap">Chat with Support</span>
            </button>
          </TooltipTrigger>
          {/* Tooltip shows when label is hidden (below xl) */}
          <TooltipContent side="bottom" sideOffset={6} className="xl:hidden">Chat with Support</TooltipContent>
        </Tooltip>

        {/* ────────────────────────────────────────────────── */}
        {/* Notification Bell                                 */}
        {/* Visible at md+, hidden below md (moves to kebab)  */}
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
                  className="hidden md:inline-flex relative h-9 w-9 items-center justify-center text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] rounded-1 transition cursor-pointer shrink-0"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 inline-flex items-center justify-center text-[10px] font-semibold text-white bg-[#D92D20] rounded-round ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>Notifications</TooltipContent>
          </Tooltip>

          <PopoverContent className="w-[360px] p-0 bg-white border border-[#E4E7EC] rounded-2 shadow-lg" align="end">
            {/* Popover header */}
            <div className="px-spacing-4 py-spacing-3 border-b border-[#E4E7EC] bg-[#F9FAFB]">
              <h3 className="text-sm font-semibold text-[#101828]">Refer-A-Friend Program</h3>
            </div>
            {/* Popover body */}
            <div className="px-spacing-4 py-spacing-4 space-y-spacing-3">
              <p className="text-sm text-[#3E60C9] font-medium">
                Refer Real Geeks. Earn $200.
              </p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="h-8 px-spacing-3 inline-flex items-center bg-[#039855] hover:bg-[#027A48] text-white rounded-1 text-sm font-medium transition cursor-pointer"
                  onClick={() => toast('Opening referral form…')}
                >
                  Earn $200
                </button>
                <button
                  type="button"
                  className="text-xs text-[#D92D20] hover:text-[#B42318] transition cursor-pointer"
                  onClick={() => {
                    setIsNotifOpen(false);
                    toast('Notification deleted');
                  }}
                >
                  Delete Notification
                </button>
              </div>
            </div>
            {/* Popover footer */}
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
        {/* Help & Support                                    */}
        {/* Visible at md+, hidden below md (moves to kebab)  */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Help & Support"
                  className="hidden md:inline-flex h-9 w-9 items-center justify-center text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] rounded-1 transition cursor-pointer shrink-0"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>Help &amp; Support</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[280px] bg-white border border-[#E4E7EC] rounded-2 shadow-lg" align="end">
            <DropdownMenuLabel className="text-sm font-semibold text-[#101828] px-spacing-3 py-spacing-2">
              Help &amp; Support
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E4E7EC]" />

            <DropdownMenuItem onClick={openChat} className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
              <MessageCircle className="w-4 h-4 mr-spacing-2 text-[#3E60C9] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#101828]">Chat with Support</span>
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
        {/* Overflow Kebab (Stage D: <md only)                */}
        {/* Contains Chat, Notifications, Help                */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More"
                  className="md:hidden relative h-9 w-9 inline-flex items-center justify-center text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] rounded-1 transition cursor-pointer shrink-0"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  {/* Unread dot on kebab when notifications are collapsed */}
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D92D20] rounded-round ring-2 ring-white" />
                  )}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>More</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[240px] bg-white border border-[#E4E7EC] rounded-2 shadow-lg" align="end">
            <DropdownMenuItem onClick={openChat} className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]">
              <MessageCircle className="w-4 h-4 mr-spacing-2 text-[#475467] shrink-0" />
              <span className="text-sm font-medium text-[#101828]">Chat with Support</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]"
              onClick={() => {
                setIsNotifOpen(true);
                markAllRead();
              }}
            >
              <Bell className="w-4 h-4 mr-spacing-2 text-[#475467] shrink-0" />
              <span className="text-sm font-medium text-[#101828] flex-1">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1.5 inline-flex items-center justify-center text-[11px] font-semibold text-white bg-[#D92D20] rounded-round">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]" onClick={() => toast('Opening Help & Support…')}>
              <HelpCircle className="w-4 h-4 mr-spacing-2 text-[#475467] shrink-0" />
              <span className="text-sm font-medium text-[#101828]">Help &amp; Support</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ────────────────────────────────────────────────── */}
        {/* Account Menu                                      */}
        {/* xl/lg: icon + name + chevron                      */}
        {/* md: icon only                                     */}
        {/* <md: icon only (identity = always visible)        */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={USER_NAME}
                  className="inline-flex items-center gap-spacing-2 h-9 px-spacing-2 rounded-1 hover:bg-[#F9FAFB] transition cursor-pointer shrink-0"
                >
                  <CircleUserRound className="w-5 h-5 text-[#475467] shrink-0" />
                  {/* Label visible at lg+, hidden below lg */}
                  <span className="hidden lg:inline text-sm font-medium text-[#101828] whitespace-nowrap">{USER_NAME}</span>
                  <ChevronDown className="hidden lg:block w-4 h-4 text-[#667085] shrink-0" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {/* Tooltip when label hidden (below lg) */}
            <TooltipContent side="bottom" sideOffset={6} className="lg:hidden">{USER_NAME}</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[280px] bg-white border border-[#E4E7EC] rounded-2 shadow-lg" align="end">
            {/* User identity */}
            <div className="px-spacing-3 py-spacing-3 border-b border-[#E4E7EC]">
              <p className="text-sm font-semibold text-[#101828]">{USER_NAME}</p>
              <p className="text-xs text-[#667085]">{USER_EMAIL}</p>
            </div>

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
              className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#FEE4E2] text-[#D92D20]"
            >
              <LogOut className="w-4 h-4 mr-spacing-2" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ────────────────────────────────────────────────── */}
        {/* Domain Switcher                                   */}
        {/* xl/lg: icon + domain + chevron                    */}
        {/* md: icon only                                     */}
        {/* <md: icon only (context = always visible)         */}
        {/* ────────────────────────────────────────────────── */}
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Switch website"
                  className="inline-flex items-center gap-spacing-2 h-9 px-spacing-2 rounded-1 hover:bg-[#F9FAFB] transition cursor-pointer shrink-0"
                >
                  <Globe className="w-5 h-5 text-[#475467] shrink-0" />
                  {/* Label visible at lg+, hidden below lg */}
                  <span className="hidden lg:inline text-sm font-medium text-[#101828] truncate max-w-[180px] whitespace-nowrap">
                    {stripWww(currentDomain)}
                  </span>
                  <ChevronDown className="hidden lg:block w-4 h-4 text-[#667085] shrink-0" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {/* Tooltip: full domain when label hidden (below lg), "Switch website" at lg+ */}
            <TooltipContent side="bottom" sideOffset={6} className="lg:hidden">{stripWww(currentDomain)}</TooltipContent>
          </Tooltip>

          <DropdownMenuContent className="w-[280px] bg-white border border-[#E4E7EC] rounded-2 shadow-lg" align="end">
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-[#667085] px-spacing-3 py-spacing-2">
              Switch Website
            </DropdownMenuLabel>

            {WEBSITES.map((site) => (
              <DropdownMenuItem
                key={site.domain}
                onClick={() => switchTo(site.domain)}
                className="px-spacing-3 py-spacing-2 cursor-pointer focus:bg-[#F9FAFB]"
              >
                <span className="text-sm text-[#101828] flex-1">{stripWww(site.domain)}</span>
                {site.domain === currentDomain && (
                  <Check className="w-4 h-4 text-[#3E60C9]" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ────────────────────────────────────────────────────── */}
      {/* Mobile Search Overlay (Stage D: <md)                  */}
      {/* Full-width input anchored under header                */}
      {/* ────────────────────────────────────────────────────── */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-50 bg-white border-b border-[#E4E7EC] px-spacing-4 py-spacing-3 flex items-center gap-spacing-3 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-spacing-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none z-10" />
            <Input
              ref={mobileSearchRef}
              type="search"
              placeholder="Search your CRM"
              className="h-10 w-full pl-9 pr-spacing-3 rounded-2 border border-[#E4E7EC] bg-white text-sm text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#3E60C9] focus:ring-1 focus:ring-[#3E60C9]"
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
