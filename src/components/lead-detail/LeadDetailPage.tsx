import { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/shell/Sidebar';
import { AppHeader } from '@/components/shell/AppHeader';
import { useSidebar } from '@/components/shell/useSidebar';
import { useDevMode } from '@/devmode';
import { LeadHeader } from './LeadHeader';
import { ContactInfoCard } from './ContactInfoCard';
import { RobinAISummaryCard } from './RobinAISummaryCard';
import { ActivityHistoryCard } from './ActivityHistoryCard';
import { RightColumn } from './RightColumn';
import { LeadSignalTagsCard } from './LeadSignalTagsCard';
import { ActivityFilterProvider } from './ActivityFilterContext';
import {
  ContactInfoProvider,
  type ContactInfo,
} from '@/contexts/ContactInfoContext';
import { LeadDetailPageSkeleton } from './LeadDetailSkeletons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const LOADING_MS = 800;

const INITIAL_CONTACT_INFO: ContactInfo = {
  firstName: 'Camille',
  lastName: 'Dubois',
  primary: '(415) 555-0142',
  primaryStatus: 'good',
  alt: '(415) 555-0188',
  altStatus: 'good',
  office: '',
  officeStatus: 'good',
  fax: '',
  faxStatus: 'good',
  email: 'cdubois@realgeeks.com',
  emailStatus: 'good',
  street: '123 Malcolm Street',
  addressLine2: 'Unit 3',
  city: 'Atlanta',
  state: 'GA',
  zip: '30019',
};

export default function LeadDetailPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { collapsed, toggle } = useSidebar();
  const { active: devModeActive } = useDevMode();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContactInfoProvider initial={INITIAL_CONTACT_INFO}>
    <ActivityFilterProvider>
      <div className="min-h-screen w-full overflow-x-hidden bg-bg-app">
        {/* Header — fixed, full viewport width, z-30 */}
        <div
          className="fixed top-0 left-0 z-30 transition-all duration-200"
          style={{ right: devModeActive ? 380 : 0 }}
        >
          <AppHeader />
        </div>

        {/* Sidebar — fixed, below header */}
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        {/* PROTECTED — Sidebar collapse toggle position.
         * Reads --sidebar-width so it slides with the sidebar automatically
         * when the width changes (both collapse/expand state changes AND
         * any future design-time width adjustments).
         *
         * The translateX(-50%) is what creates the "overlap" effect —
         * half the circle sits on the sidebar, half on the content area.
         *
         * Do not hardcode `left` values for the collapsed / expanded states.
         * If a new sidebar width is introduced, update it in Sidebar.tsx's
         * useEffect and this toggle will follow. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="fixed z-30 w-6 h-6 rounded-round bg-bg-card border border-border-default flex items-center justify-center shadow-md hover:shadow-lg hover:bg-bg-muted cursor-pointer hidden md:flex"
          style={{
            top: 76,
            left: 'var(--sidebar-width, 184px)',
            transform: 'translateX(-50%)',
            transition: 'left 180ms ease, box-shadow 150ms ease',
          }}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-text-muted" strokeWidth={2.5} />
          )}
        </button>

        {/* Main content area — offset for header + sidebar + devmode panel */}
        <main
          className="min-h-screen pt-20 p-spacing-8"
          style={{
            marginLeft: collapsed ? 72 : 184,
            marginRight: devModeActive ? 380 : 0,
            transition: 'margin-left 180ms ease, margin-right 200ms ease',
          }}
        >
          <div className="space-y-spacing-4 max-w-[1284px]">
            {isLoading ? (
              <LeadDetailPageSkeleton />
            ) : (
              <>
                {/* TOP: Lead Header only */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                  <LeadHeader />
                </div>

                {/* BOTTOM TWO-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] items-start gap-spacing-4 mt-spacing-10">
                  {/* Left column: Data Snapshot → Robin AI → Activity History */}
                  <div className="flex flex-col gap-spacing-4 min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: '120ms' }}>
                    <LeadSignalTagsCard />
                    <ContactInfoCard />
                    <RobinAISummaryCard />
                    <ActivityHistoryCard />
                  </div>
                  {/* Right column */}
                  <div className="flex flex-col gap-spacing-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <RightColumn />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid var(--gray-50)',
            color: 'var(--gray-120)',
          },
        }}
        richColors
      />

      {/* Floating Support Chat Bubble */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 z-50 w-14 h-14 rounded-round bg-blue-100 shadow-lg flex items-center justify-center hover:bg-blue-110 active:bg-blue-120 transition-all duration-200 cursor-pointer"
        style={{ right: devModeActive ? 380 + 24 : 24 }}
        aria-label="Chat with support"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Support Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Chat with Real Geeks Support</DialogTitle>
            <DialogDescription>
              Send us a message and we&apos;ll get back to you as soon as
              possible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-spacing-4 py-spacing-2">
            {/* Mock chat area */}
            <div className="h-[200px] bg-gray-30 rounded-1 p-spacing-3 overflow-y-auto">
              <div className="flex flex-col gap-spacing-3">
                <div className="self-start max-w-[80%] bg-white rounded-1 rounded-tl-none px-spacing-3 py-spacing-2">
                  <p className="text-text-3 text-text-default">
                    Hi there! How can we help you today?
                  </p>
                  <span className="text-text-1 text-text-muted mt-spacing-1 block">
                    Support &middot; just now
                  </span>
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="flex items-center gap-spacing-2">
              <textarea
                rows={1}
                placeholder="Type your message..."
                className="flex-1 h-9 px-spacing-3 py-spacing-2 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
              <button
                type="button"
                className="h-9 w-9 rounded-1 bg-blue-100 text-white flex items-center justify-center hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ActivityFilterProvider>
    </ContactInfoProvider>
  );
}
