import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// OnlineNowBanner removed — Online Status consolidated to HighlightsCard
import { ActivityStatsCard } from './ActivityStatsCard';
import { ImportantNotesCard } from './ImportantNotesCard';
import { HighlightsCard } from './HighlightsCard';
import { ContactInfoSection } from './ContactInfoSection';
import { SearchCriteriaCard } from './SearchCriteriaCard';
import { ImportantDatesCard } from './ImportantDatesCard';
import { TagsCard } from './TagsCard';
import { SecondaryContactCard } from './SecondaryContactCard';
import { LeadAssignmentCard } from './LeadAssignmentCard';
import { SourceCard } from './SourceCard';
import { FollowUpsCard } from './FollowUpsCard';
import { WorkflowsCard } from './WorkflowsCard';
import { SavedSearchesCard } from './SavedSearchesCard';
import { MarketReportsCard } from './MarketReportsCard';
import { HomeValuationReportsCard } from './HomeValuationReportsCard';
import { SmsEmailOptOutsCard } from './SmsEmailOptOutsCard';
import { SortableCard } from './SortableCard';

// ── Default orderings ──────────────────────────────────────────
const INFO_DEFAULT_ORDER = [
  'important-notes',
  'activity-stats',
  'contact-info',
  'highlights',
  'search-criteria',
  'important-dates',
  'tags',
  'secondary-contact',
  'lead-assignment',
  'source',
];

const ENGAGEMENT_DEFAULT_ORDER = [
  'follow-ups',
  'workflows',
  'saved-searches',
  'market-reports',
  'sms-email-opt-outs',
  'home-valuation-reports',
];

// ── Card component maps ────────────────────────────────────────
const INFO_CARD_MAP: Record<string, React.FC> = {
  'activity-stats': ActivityStatsCard,
  'important-notes': ImportantNotesCard,
  highlights: HighlightsCard,
  'contact-info': ContactInfoSection,
  'search-criteria': SearchCriteriaCard,
  'important-dates': ImportantDatesCard,
  tags: TagsCard,
  'secondary-contact': SecondaryContactCard,
  'lead-assignment': LeadAssignmentCard,
  source: SourceCard,
};

const ENGAGEMENT_CARD_MAP: Record<string, React.FC> = {
  'follow-ups': FollowUpsCard,
  workflows: WorkflowsCard,
  'saved-searches': SavedSearchesCard,
  'market-reports': MarketReportsCard,
  'home-valuation-reports': HomeValuationReportsCard,
  'sms-email-opt-outs': SmsEmailOptOutsCard,
};

function renderEngagementCards(order: string[]) {
  return order.map((id) => {
    const Component = ENGAGEMENT_CARD_MAP[id];
    if (!Component) return null;
    return (
      <SortableCard key={id} id={id}>
        <Component />
      </SortableCard>
    );
  });
}

// ── Main component ─────────────────────────────────────────────
export function RightColumn() {
  const [infoOrder, setInfoOrder] = useState(INFO_DEFAULT_ORDER);
  const [engagementOrder, setEngagementOrder] = useState(
    ENGAGEMENT_DEFAULT_ORDER,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleInfoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setInfoOrder((order) => {
        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);
        return arrayMove(order, oldIndex, newIndex);
      });
    }
  };

  const handleEngagementDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEngagementOrder((order) => {
        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);
        return arrayMove(order, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-spacing-4">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full h-auto p-0 bg-transparent rounded-none border-b border-border-default">
          <TabsTrigger
            value="info"
            className="flex-1 py-4 rounded-none bg-transparent text-text-4 font-semibold text-gray-80 shadow-none border-b-2 border-transparent data-[state=active]:text-blue-100 data-[state=active]:border-blue-100 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Info
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="flex-1 py-4 rounded-none bg-transparent text-text-4 font-semibold text-gray-80 shadow-none border-b-2 border-transparent data-[state=active]:text-blue-100 data-[state=active]:border-blue-100 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Engagement
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-spacing-4 space-y-spacing-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleInfoDragEnd}
          >
            <SortableContext
              items={infoOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-spacing-4">
                {infoOrder.map((id) => {
                  const Component = INFO_CARD_MAP[id];
                  return (
                    <SortableCard key={id} id={id}>
                      <Component />
                    </SortableCard>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="mt-spacing-4 space-y-spacing-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleEngagementDragEnd}
          >
            <SortableContext
              items={engagementOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-spacing-4">
                {renderEngagementCards(engagementOrder)}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>
    </div>
  );
}
