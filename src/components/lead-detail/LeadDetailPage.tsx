import { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/shell/Sidebar';
import { AppHeader } from '@/components/shell/AppHeader';
import { useSidebar } from '@/components/shell/useSidebar';
import { LeadHeader } from './LeadHeader';
import { ContactInfoCard } from './ContactInfoCard';
import { RobinAISummaryCard } from './RobinAISummaryCard';
import { ActivityHistoryCard } from './ActivityHistoryCard';
import { RightColumn } from './RightColumn';
import { LeadSignalTagsCard } from './LeadSignalTagsCard';
import { ActivityFilterProvider } from './ActivityFilterContext';
import {
  LeadHeaderSkeleton,
  ContactInfoCardSkeleton,
  ActivityHistoryCardSkeleton,
  RightColumnSkeleton,
} from './LeadDetailSkeletons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const LOADING_MS = 800;

export default function LeadDetailPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { collapsed, toggle } = useSidebar();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ActivityFilterProvider>
      <div className="min-h-screen w-screen bg-bg-app">
        {/* Header — fixed, full viewport width, z-30 */}
        <div className="fixed top-0 left-0 right-0 z-30">
          <AppHeader />
        </div>

        {/* Sidebar — fixed, below header */}
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        {/* Floating collapse toggle — Notion-style */}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="fixed z-30 w-6 h-6 rounded-full bg-bg-card border border-border-default flex items-center justify-center shadow-md hover:shadow-lg hover:bg-bg-muted cursor-pointer hidden md:flex"
          style={{
            top: 76,
            left: collapsed ? 60 : 208,
            transition: 'left 180ms ease, box-shadow 150ms ease',
          }}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-text-muted" strokeWidth={2.5} />
          )}
        </button>

        {/* Main content area — offset for header + sidebar */}
        <main
          className="min-h-screen pt-20 p-spacing-8"
          style={{
            marginLeft: collapsed ? 72 : 220,
            transition: 'margin-left 180ms ease',
          }}
        >
          <div className="space-y-spacing-4 max-w-[1284px]">
            {isLoading ? (
              <>
                <LeadHeaderSkeleton />
                <ContactInfoCardSkeleton />
                <div className="flex flex-col xl:flex-row gap-spacing-6">
                  <div className="flex-1 min-w-0 max-w-full xl:max-w-[880px] w-full">
                    <ActivityHistoryCardSkeleton />
                  </div>
                  <div className="w-full xl:w-[380px] xl:shrink-0">
                    <RightColumnSkeleton />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* TOP: Lead Header only */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                  <LeadHeader />
                </div>

                {/* BOTTOM TWO-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-spacing-4 mt-spacing-10">
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-round bg-blue-110 shadow-lg flex items-center justify-center hover:bg-blue-120 transition-colors cursor-pointer"
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
            <div className="h-[200px] bg-gray-30 rounded-2 p-spacing-3 overflow-y-auto">
              <div className="flex flex-col gap-spacing-3">
                <div className="self-start max-w-[80%] bg-white rounded-2 rounded-tl-none px-spacing-3 py-spacing-2 shadow-sm">
                  <p className="text-text-4 text-text-default">
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
                className="flex-1 h-9 px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
              />
              <button
                type="button"
                className="h-9 w-9 rounded-2 bg-blue-110 text-white flex items-center justify-center hover:bg-blue-120 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ActivityFilterProvider>
  );
}
