import { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Mic,
  GraduationCap,
  Phone,
  Search,
  Download,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { ActivityItemData, TranscriptLine, CoachingData } from './ActivityItem';

interface CallDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItemData;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * PROTECTED — Call detail dialog.
 * Centered modal with scrim (task-focused reading pattern).
 * NOT the pinned floating dialog — different intent.
 *
 * Tabs: Summary | Transcript | Recording | Coaching.
 * Header always shows call metadata (contact, timestamp, duration).
 * Each tab is scrollable independently up to max-h-[60vh].
 *
 * Do NOT convert to pinned floating pattern. Do NOT remove the scrim.
 */
export function CallDetailDialog({ isOpen, onClose, activity }: CallDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const ai = activity.aiInsight;

  if (!ai) return null;

  const contactName = activity.title?.replace(/^.*?called\s+/i, '').replace(/^.*?logged a call.*?$/i, 'Camille Dubois') || 'Camille Dubois';
  const duration = 428;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogTitle className="sr-only">Call detail with {contactName}</DialogTitle>

        {/* Header — always visible above tabs */}
        <div className="flex items-center justify-between px-spacing-5 py-spacing-4 border-b border-border-default shrink-0 pr-spacing-12">
          <div className="flex items-center gap-spacing-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-1 bg-green-10">
              <Phone className="w-4 h-4 text-green-100" aria-hidden="true" />
            </div>
            <div>
              <div className="text-text-4 font-semibold text-text-default">
                Call with {contactName}
              </div>
              <div className="text-text-3 text-text-muted">
                {activity.timestamp} · {formatDuration(duration)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex border-b border-border-default px-spacing-5 gap-spacing-4 bg-transparent h-auto p-0">
            <TabsTrigger
              value="summary"
              className="inline-flex items-center gap-spacing-2 px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <Sparkles className="w-4 h-4 text-purple-100" aria-hidden="true" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="inline-flex items-center gap-spacing-2 px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="recording"
              className="inline-flex items-center gap-spacing-2 px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <Mic className="w-4 h-4" aria-hidden="true" />
              Recording
            </TabsTrigger>
            <TabsTrigger
              value="coaching"
              className="inline-flex items-center gap-spacing-2 px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              Coaching
            </TabsTrigger>
          </TabsList>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto px-spacing-5 py-spacing-4 max-h-[60vh]">
            <TabsContent value="summary" className="mt-0">
              <div className="space-y-spacing-4">
                <p className="text-text-3 text-text-default leading-relaxed">
                  {ai.summary}
                </p>

                {ai.nextStep && (
                  <div className="rounded-2 bg-purple-10 p-spacing-4">
                    <p className="text-text-2 font-semibold text-purple-110 uppercase tracking-wide mb-spacing-2">
                      Your Next Step
                    </p>
                    <p className="text-text-3 text-text-default leading-relaxed">
                      {ai.nextStep}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-0">
              <TranscriptTab transcript={ai.transcript} />
            </TabsContent>

            <TabsContent value="recording" className="mt-0">
              <div className="space-y-spacing-4">
                <div className="rounded-2 bg-gray-10 p-spacing-4">
                  <div className="flex items-center gap-spacing-3 mb-spacing-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-1 bg-blue-10">
                      <Mic className="w-4 h-4 text-blue-100" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-text-3 font-semibold text-text-default">Call Recording</div>
                      <div className="text-text-2 text-text-muted">{formatDuration(duration)}</div>
                    </div>
                  </div>

                  <audio
                    controls
                    src={ai.recordingUrl}
                    className="w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>

                  <div className="flex justify-between items-center mt-spacing-3 pt-spacing-3 border-t border-border-default">
                    <a
                      href={ai.recordingUrl}
                      download
                      className="inline-flex items-center gap-spacing-2 text-text-3 text-blue-100 hover:text-blue-110 font-medium"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      Download recording
                    </a>
                    <div className="text-text-2 text-text-muted">
                      Recorded {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coaching" className="mt-0">
              {ai.coaching ? (
                <CoachingTab coaching={ai.coaching} />
              ) : (
                <div className="text-text-3 text-text-muted text-center py-spacing-6">
                  No coaching data available for this call.
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TranscriptTab({ transcript }: { transcript?: TranscriptLine[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!transcript || transcript.length === 0) {
    return (
      <div className="text-text-3 text-text-muted text-center py-spacing-6">
        No transcript available for this call.
      </div>
    );
  }

  const filteredLines = transcript.filter((line) =>
    !searchQuery || line.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-spacing-4">
      <div className="relative">
        <Search className="absolute left-spacing-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search Transcript"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-8"
        />
      </div>

      <div className="space-y-spacing-3">
        {filteredLines.map((line, i) => (
          <div key={i} className="flex gap-spacing-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-1 flex-shrink-0"
              style={{ backgroundColor: line.speakerColor }}
            >
              <span className="text-text-2 font-semibold text-white">{line.speakerInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-text-3 font-semibold text-text-default">{line.speakerName}</div>
              <div className="text-text-3 text-text-default leading-relaxed">{line.text}</div>
            </div>
          </div>
        ))}

        {filteredLines.length === 0 && searchQuery && (
          <div className="text-text-3 text-text-muted text-center py-spacing-6">
            No transcript lines match "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}

function CoachingTab({ coaching }: { coaching: CoachingData }) {
  return (
    <div className="space-y-spacing-6">
      {/* Talk-time ratio */}
      <div>
        <div className="text-text-3 font-semibold text-text-default mb-spacing-3">
          Talk time
        </div>
        <div className="space-y-spacing-3">
          <div>
            <div className="flex justify-between text-text-3 text-text-default mb-spacing-1">
              <span>{coaching.agentName}</span>
              <span className="text-text-muted">{coaching.agentTalkPct}%</span>
            </div>
            <div className="h-2 rounded-1 bg-gray-30 overflow-hidden">
              <div
                className="h-full bg-blue-100 transition-all duration-300"
                style={{ width: `${coaching.agentTalkPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-text-3 text-text-default mb-spacing-1">
              <span>{coaching.customerName}</span>
              <span className="text-text-muted">{coaching.customerTalkPct}%</span>
            </div>
            <div className="h-2 rounded-1 bg-gray-30 overflow-hidden">
              <div
                className="h-full bg-green-100 transition-all duration-300"
                style={{ width: `${coaching.customerTalkPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI feedback bullets */}
      <div>
        <div className="text-text-3 font-semibold text-text-default mb-spacing-3">
          AI feedback
        </div>
        <ul className="space-y-spacing-3">
          {coaching.feedback.map((item, i) => (
            <li key={i} className="flex gap-spacing-3">
              <Sparkles className="w-4 h-4 text-purple-100 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-text-3 text-text-default leading-relaxed">
                {item}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
