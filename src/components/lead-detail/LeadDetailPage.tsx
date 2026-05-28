import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Toaster } from 'sonner';
import { LeftNav } from './LeftNav';
import { TopUtilityBar } from './TopUtilityBar';
import { LeadHeader } from './LeadHeader';
import { ContactInfoCard } from './ContactInfoCard';
import { ActivityHistoryCard } from './ActivityHistoryCard';
import { RightColumn } from './RightColumn';
import { ActivityFilterProvider } from './ActivityFilterContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function LeadDetailPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ActivityFilterProvider>
      <div className="h-screen w-screen bg-[#F5F5F5] flex">
        {/* Left Navigation */}
        <LeftNav />

        {/* Main area (right of nav) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Utility Bar */}
          <TopUtilityBar />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-spacing-6">
            <div className="space-y-spacing-4">
              {/* Lead Header — full width, no card chrome */}
              <LeadHeader />

              {/* Content columns */}
              <div className="flex flex-col xl:flex-row gap-spacing-6">
                {/* Left column */}
                <div className="flex-1 min-w-0 max-w-full xl:max-w-[880px] space-y-spacing-4 w-full">
                  {/* Contact Info Card */}
                  <ContactInfoCard />

                  {/* Activity History */}
                  <ActivityHistoryCard />
                </div>

                {/* Right column */}
                <div className="w-full xl:w-[340px] xl:shrink-0">
                  <RightColumn />
                </div>
              </div>
            </div>
          </main>
        </div>
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
                className="flex-1 h-9 px-spacing-3 py-spacing-2 rounded-2 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
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
