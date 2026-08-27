import { useState, useRef } from 'react';
import { Sparkles, MessageSquare, Mic, GraduationCap, Search, Download, CircleCheck as CheckCircle2, Lightbulb, Check, Info } from 'lucide-react';
import { useVersion } from '@/contexts/VersionContext';
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
  const { version } = useVersion();
  const [activeTab, setActiveTab] = useState('summary');
  const ai = activity.aiInsight;

  if (!ai) return null;

  const showCoaching = version === 'V2';
  const safeActiveTab = !showCoaching && activeTab === 'coaching' ? 'summary' : activeTab;

  const contactName = activity.title?.replace(/^.*?called\s+/i, '').replace(/^.*?logged a call.*?$/i, 'Camille Dubois') || 'Camille Dubois';
  const duration = 428;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogTitle className="sr-only">Call detail with {contactName}</DialogTitle>

        {/* Header — always visible above tabs */}
        <div className="flex items-center justify-between px-spacing-5 py-spacing-4 border-b border-border-default shrink-0 pr-spacing-12">
          <div>
            <div className="text-text-4 font-semibold text-text-default">
              Call with {contactName}
            </div>
            <div className="text-text-3 text-text-muted">
              {activity.timestamp} · {formatDuration(duration)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={safeActiveTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex justify-start border-b border-border-default px-spacing-5 gap-spacing-4 bg-transparent h-auto p-0">
            <TabsTrigger
              value="summary"
              className="inline-flex items-center justify-center gap-spacing-2 w-[120px] px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <Sparkles className="w-4 h-4 text-purple-100" aria-hidden="true" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="inline-flex items-center justify-center gap-spacing-2 w-[120px] px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="recording"
              className="inline-flex items-center justify-center gap-spacing-2 w-[120px] px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <Mic className="w-4 h-4" aria-hidden="true" />
              Recording
            </TabsTrigger>
            {showCoaching && (
            <TabsTrigger
              value="coaching"
              className="inline-flex items-center justify-center gap-spacing-2 w-[120px] px-0 py-spacing-3 border-b-2 border-transparent text-text-3 font-medium text-text-muted transition-colors rounded-none data-[state=active]:border-blue-100 data-[state=active]:text-text-default data-[state=active]:shadow-none hover:text-text-default"
            >
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              Coaching
            </TabsTrigger>
            )}
          </TabsList>

          {/* Tab content — scrollable */}
          <div className="overflow-y-auto px-spacing-5 py-spacing-4 h-[70vh] min-h-[480px] max-h-[600px]">
            <TabsContent value="summary" className="mt-0">
              <div className="space-y-spacing-4">
                <p className="text-text-3 text-text-default leading-relaxed">
                  {ai.summary}
                </p>

                {ai.nextStep && (
                  <ul className="space-y-spacing-1 pt-spacing-2 mt-spacing-3">
                    <li className="flex items-start gap-spacing-2 text-text-3 text-text-default">
                      <Check className="w-4 h-4 text-purple-110 shrink-0 mt-[2px]" />
                      <span>She confirmed her lender Letter of Intent on the call, so she's ready to tour.</span>
                    </li>
                    <li className="flex items-start gap-spacing-2 text-text-3 text-text-default">
                      <Check className="w-4 h-4 text-purple-110 shrink-0 mt-[2px]" />
                      <span>She asked to view next weekend, so lock in Saturday showings while intent is high.</span>
                    </li>
                    <li className="flex items-start gap-spacing-2 text-text-3 text-text-default">
                      <Check className="w-4 h-4 text-purple-110 shrink-0 mt-[2px]" />
                      <span>She prefers texts during work hours, so lead with a text rather than a call.</span>
                    </li>
                  </ul>
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

                  <p className="mt-spacing-3 text-text-2 text-text-muted">
                    Call recordings are available for 14 days after the call, then automatically deleted. Download a copy to save to your personal files.
                  </p>
                </div>
              </div>
            </TabsContent>

            {showCoaching && (
            <TabsContent value="coaching" className="mt-0">
              {ai.coaching ? (
                <CoachingTab coaching={ai.coaching} />
              ) : (
                <div className="text-text-3 text-text-muted text-center py-spacing-6">
                  No coaching data available for this call.
                </div>
              )}
            </TabsContent>
            )}
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
              className="flex items-center justify-center w-8 h-8 rounded-round flex-shrink-0"
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
  const overallScore = 82;
  const grade = 'B+';

  const skillScores = [
    { label: 'Rapport', value: 90 },
    { label: 'Discovery', value: 72 },
    { label: 'Objection handling', value: 78 },
    { label: 'Closing', value: 80 },
    { label: 'Next steps', value: 85 },
  ];

  const tier =
    overallScore >= 80
      ? { colorClass: 'text-green-100', pillClass: 'bg-green-10 text-green-100', headline: 'This was a strong call', word: 'Strong' }
      : overallScore >= 65
        ? { colorClass: 'text-orange-100', pillClass: 'bg-orange-10 text-orange-100', headline: 'This call was solid', word: 'Solid' }
        : { colorClass: 'text-red-100', pillClass: 'bg-red-10 text-red-100', headline: 'This call needs work', word: 'Needs work' };

  const legend = [...skillScores].sort((a, b) => b.value - a.value);
  const topOpportunity = [...skillScores].sort((a, b) => a.value - b.value)[0];
  const tipsRef = useRef<HTMLDivElement>(null);

  const dotColor = (v: number) =>
    v >= 80 ? 'bg-green-100' : v >= 70 ? 'bg-orange-100' : 'bg-red-100';

  const angle = (180 - (overallScore / 100) * 180) * (Math.PI / 180);
  const dotCx = 100 + 88 * Math.cos(angle);
  const dotCy = 100 - 88 * Math.sin(angle);

  const strengths = [
    {
      lead: 'Strong opening',
      text: ' — quickly established purpose and moved to the pre-approval question. Efficient use of time in the first 60 seconds.',
    },
    {
      lead: 'Good active listening.',
      text: ' You let Camille articulate her needs before offering solutions. This built rapport and gave you specific criteria to work with.',
    },
    {
      lead: 'Great catch on the spouse\'s promotion motivation.',
      text: ' Referencing this in follow-up communications will reinforce the urgency angle and personalize your outreach.',
    },
  ];

  const opportunities = [
    {
      lead: 'Ask more discovery questions.',
      text: ' One or two more open-ended questions about must-have features (yard size, garage, HOA preferences) before committing to specific listings — narrows the property list and shows deeper consultative selling.',
    },
    {
      lead: 'Strengthen the close.',
      text: ' Propose 2–3 specific showing times rather than asking "when works?" — reduces cognitive load for the client.',
    },
  ];

  const metrics = [
    { label: 'Questions asked', value: '7' },
    { label: 'Longest monologue', value: '0:52' },
    { label: 'Discovery covered', value: '4 / 6' },
    { label: 'Talk pace', value: '155 wpm' },
  ];

  return (
    <div className="space-y-spacing-6">
      {/* Call score — health-score hero */}
      <div>
        <div className="text-text-3 font-semibold text-text-default mb-spacing-3">
          Call score
        </div>
        <div className="border border-border-default rounded-2 p-spacing-5">
          <h3 className="text-text-6 font-bold text-text-default mb-spacing-5">{tier.headline}</h3>
          <div className="flex flex-col sm:flex-row gap-spacing-10">
            {/* LEFT: semicircle gauge + dimension legend */}
            <div className="flex flex-col items-center gap-spacing-4 shrink-0">
              <div className="relative w-[200px] h-[124px]">
                <svg viewBox="0 0 200 110" className="w-[200px] h-[110px]" role="img" aria-label={`Call score ${overallScore} out of 100, grade ${grade}`}>
                  <path d="M 12 100 A 88 88 0 0 1 188 100" fill="none" stroke="var(--gray-30, #E4E7EC)" strokeWidth="14" strokeLinecap="round" pathLength={100} />
                  <path d="M 12 100 A 88 88 0 0 1 188 100" fill="none" className={tier.colorClass} stroke="currentColor" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${overallScore} 100`} />
                  <circle cx={dotCx} cy={dotCy} r="7" fill="white" className={tier.colorClass} stroke="currentColor" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-[6px] gap-1 pointer-events-none">
                  <span className="text-text-7 font-bold text-text-default leading-none">{overallScore}</span>
                  <span className={`${tier.pillClass} rounded-round px-spacing-2 py-[2px] text-text-2 font-semibold`}>{grade}</span>
                </div>
                <div className="absolute left-[6px] bottom-[6px] text-text-1 text-text-muted">0</div>
                <div className="absolute right-[2px] bottom-[6px] text-text-1 text-text-muted">100</div>
              </div>

              <ul className="grid grid-cols-2 gap-x-spacing-4 gap-y-spacing-2 w-full">
                {legend.map((skill) => (
                  <li key={skill.label} className="flex items-center gap-spacing-2 text-text-2 text-text-default">
                    <span className={`w-2 h-2 rounded-round ${dotColor(skill.value)} shrink-0`} />
                    <span className="flex-1">{skill.label}</span>
                    <span className="font-semibold">{skill.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: verdict line, meta, top opportunity, tips, CTA */}
            <div className="flex-1 flex flex-col gap-spacing-3">
              <div className="flex items-center gap-spacing-2 flex-wrap">
                <span className="text-text-4 font-semibold text-text-default">This call's coaching score is</span>
                <span className={`${tier.pillClass} rounded-round px-spacing-2 py-[2px] text-text-2 font-semibold`}>{tier.word}</span>
                <Info className="w-4 h-4 text-text-muted" aria-hidden="true" />
              </div>
              <p className="text-text-2 text-text-muted">Nov 5, 2025 at 2:17pm · 7:08 · Kevin McCarthy</p>

              <div>
                <p className="text-text-3 font-semibold text-text-default">Top opportunity</p>
                <p className="text-text-3 text-text-default mt-spacing-1">{topOpportunity.label} ({topOpportunity.value}) — surface timeline and motivations earlier in the call to qualify faster.</p>
              </div>

              <div className="flex items-center gap-spacing-2 text-text-3 text-text-default">
                <Lightbulb className="w-4 h-4 text-purple-100 shrink-0" aria-hidden="true" />
                <span><span className="font-semibold">2</span> coaching tips available</span>
              </div>

              <button
                type="button"
                onClick={() => tipsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="inline-flex items-center justify-center h-9 px-spacing-4 rounded-1 border border-blue-100 text-blue-100 hover:bg-blue-10 font-semibold text-text-3 transition-colors cursor-pointer w-fit"
              >
                View coaching tips
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Talk-time ratio */}
      <div>
        <div className="text-text-3 font-semibold text-text-default mb-spacing-3">
          Talk time
        </div>
        <div className="space-y-spacing-2">
          {/* Legend — agent (blue) left, lead (green) right */}
          <div className="flex items-center justify-between text-text-3 text-text-default">
            <span className="flex items-center gap-spacing-2">
              <span className="w-2 h-2 rounded-round bg-blue-100 shrink-0" />
              {coaching.agentName} <span className="text-text-muted">· Agent</span>
              <span className="font-semibold">{coaching.agentTalkPct}%</span>
            </span>
            <span className="flex items-center gap-spacing-2">
              <span className="w-2 h-2 rounded-round bg-green-100 shrink-0" />
              {coaching.customerName}
              <span className="font-semibold">{coaching.customerTalkPct}%</span>
            </span>
          </div>

          {/* Single stacked 100% bar: blue = agent, green = lead */}
          <div
            className="flex h-3 w-full rounded-1 overflow-hidden bg-gray-30"
            role="img"
            aria-label={`Talk time: agent ${coaching.agentTalkPct}%, lead ${coaching.customerTalkPct}%`}
          >
            <div
              className="h-full bg-blue-100 transition-all duration-300"
              style={{ width: `${coaching.agentTalkPct}%` }}
            />
            <div
              className="h-full bg-green-100 transition-all duration-300"
              style={{ width: `${coaching.customerTalkPct}%` }}
            />
          </div>

          {/* Listen-first check line */}
          <div className="flex items-center gap-spacing-2 text-text-3 text-green-100">
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Agent talk-time within the 40–45% listen-first range</span>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="flex flex-wrap gap-x-spacing-4 gap-y-spacing-2 mt-spacing-4 pt-spacing-3 border-t border-border-default">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`flex items-center gap-spacing-1 text-text-3 ${
                i > 0 ? 'sm:border-l sm:border-border-default sm:pl-spacing-4' : ''
              }`}
            >
              <span className="text-text-muted">{m.label}</span>
              <span className="font-semibold text-text-default">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div ref={tipsRef} className="border-l-2 border-green-40 pl-spacing-4 scroll-mt-spacing-4">
        <div className="flex items-center gap-spacing-2 mb-spacing-3">
          <CheckCircle2 className="w-4 h-4 text-green-100 flex-shrink-0" aria-hidden="true" />
          <span className="text-text-4 font-semibold text-text-default">Strengths</span>
          <span className="text-text-3 text-text-muted">(3)</span>
        </div>
        <ul className="space-y-spacing-3">
          {strengths.map((item, i) => (
            <li key={i} className="flex gap-spacing-3">
              <CheckCircle2 className="w-4 h-4 text-green-100 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-text-3 text-text-default leading-relaxed">
                <span className="font-semibold">{item.lead}</span>
                {item.text}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Coaching opportunities */}
      <div className="border-l-2 border-orange-40 pl-spacing-4">
        <div className="flex items-center gap-spacing-2 mb-spacing-3">
          <Lightbulb className="w-4 h-4 text-orange-100 flex-shrink-0" aria-hidden="true" />
          <span className="text-text-4 font-semibold text-text-default">Coaching opportunities</span>
          <span className="text-text-3 text-text-muted">(2)</span>
        </div>
        <ul className="space-y-spacing-3">
          {opportunities.map((item, i) => (
            <li key={i} className="flex gap-spacing-3">
              <Lightbulb className="w-4 h-4 text-orange-100 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-text-3 text-text-default leading-relaxed">
                <span className="font-semibold">{item.lead}</span>
                {item.text}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
