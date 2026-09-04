import { useState } from 'react';
import { ArrowRight, Info, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { SectionActionButton } from './SectionActionButton';
import { useVersion } from '@/contexts/VersionContext';
import { TruncatedText } from './TruncatedText';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface SavedSearch {
  id: string;
  name: string;
  criteria: string[];
}

const initialSearches: SavedSearch[] = [
  {
    id: '1',
    name: ', type: Single Family Residential',
    criteria: [
      'Type: Single Family Residential',
      'Min Price: $500,000',
      'Max Price: $800,000',
      'Min Beds: 3',
      'Min Baths: 2',
      'Area: San Jose, CA',
    ],
  },
];

export function SavedSearchesCard() {
  const { emptyMode } = useVersion();
  const [searches, setSearches] = useState<SavedSearch[]>(initialSearches);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSearch, setDetailSearch] = useState<SavedSearch | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');

  const openDetail = (search: SavedSearch) => {
    setDetailSearch(search);
    setDetailOpen(true);
  };

  const handleGuidedTour = () => {
    console.log('[Saved Searches] Open guided tour');
    // TODO: integrate with actual tour overlay
  };

  const handleMoreInfo = () => {
    console.log('[Saved Searches] Open more info docs');
    // TODO: integrate with docs link
  };

  const handleAdd = () => {
    if (!addName.trim()) return;
    const newSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      name: addName.trim(),
      criteria: ['No criteria specified'],
    };
    setSearches((prev) => [...prev, newSearch]);
    setAddOpen(false);
    setAddName('');
    toast.success('Saved search added');
  };

  return (
    <>
      <CollapsibleCard
        title="Saved Searches"
        countBadge={emptyMode ? 0 : searches.length}
        infoSlot={
          <HoverCard openDelay={150} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                aria-label="Learn about saved searches"
                className="inline-flex items-center justify-center w-5 h-5 rounded-round bg-[#322b95] text-white hover:bg-[#2d2684] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2"
              >
                <Info className="w-3 h-3" aria-hidden="true" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              side="top"
              align="center"
              sideOffset={8}
              className="w-80 p-spacing-4 bg-white border border-border-default shadow-lg rounded-2"
            >
              <p className="text-sm font-semibold text-text-default mb-spacing-3 text-center">
                Use property alerts to get more website&nbsp;activity:
              </p>
              <div className="flex flex-col gap-spacing-2 items-center">
                <button
                  type="button"
                  onClick={handleGuidedTour}
                  className="text-sm font-semibold text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1 cursor-pointer"
                >
                  View Guided Tour
                </button>
                <button
                  type="button"
                  onClick={handleMoreInfo}
                  className="text-sm font-semibold text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1 cursor-pointer"
                >
                  More Information
                </button>
              </div>
            </HoverCardContent>
          </HoverCard>
        }
        footer={emptyMode ? undefined : (
          <SectionActionButton
            label="+ Add Saved Search"
            variant="link"
            onClick={() => setAddOpen(true)}
          />
        )}
      >
        {emptyMode ? (
          <EmptyState
            icon={Bookmark}
            title="No saved searches"
            action={{ label: 'Add saved search', onClick: () => setAddOpen(true) }}
          />
        ) : (
        <div>
          {/* Saved search rows */}
          {searches.map((search) => (
            <button
              key={search.id}
              type="button"
              onClick={() => openDetail(search)}
              className="flex items-center gap-1 text-text-3 font-semibold text-text-link hover:underline cursor-pointer p-spacing-2 -mx-spacing-2 rounded-1 hover:bg-gray-30 transition-colors w-full min-w-0"
            >
              <span className="flex-1 min-w-0 text-left">
                <TruncatedText>{search.name}</TruncatedText>
              </span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          ))}
        </div>
        )}
      </CollapsibleCard>

      {/* Saved Search Detail */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Saved Search Details</DialogTitle>
            <DialogDescription>{detailSearch?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <div className="space-y-spacing-2">
              {detailSearch?.criteria.map((line, i) => (
                <div key={i} className="flex items-center justify-between text-text-3">
                  <span className="text-text-secondary">{line.split(':')[0]}</span>
                  <span className="font-semibold text-text-default">{line.split(':').slice(1).join(':').trim()}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-4 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer"
              onClick={() => setDetailOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Saved Search Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Saved Search</DialogTitle>
            <DialogDescription>Create a new saved search for this lead.</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Search Name</label>
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="e.g., 3-bed homes in San Jose"
              className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-4 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!addName.trim()}
              className="h-8 px-spacing-4 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdd}
            >
              Add
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
