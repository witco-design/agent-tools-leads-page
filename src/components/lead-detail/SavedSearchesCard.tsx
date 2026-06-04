import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import { TruncatedText } from './TruncatedText';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const [searches, setSearches] = useState<SavedSearch[]>(initialSearches);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSearch, setDetailSearch] = useState<SavedSearch | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');

  const openDetail = (search: SavedSearch) => {
    setDetailSearch(search);
    setDetailOpen(true);
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
        countBadge={searches.length}
        showInfoIcon
        footer={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
          >
            + Add Saved Search
          </button>
        }
      >
        <div>
          {/* Saved search rows */}
          {searches.map((search) => (
            <button
              key={search.id}
              type="button"
              onClick={() => openDetail(search)}
              className="flex items-center gap-1 text-text-4 font-semibold text-text-link hover:underline cursor-pointer p-spacing-2 -mx-spacing-2 rounded-2 hover:bg-gray-30 transition-colors w-full min-w-0"
            >
              <span className="flex-1 min-w-0 text-left">
                <TruncatedText>{search.name}</TruncatedText>
              </span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          ))}
        </div>
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
                <div key={i} className="flex items-center justify-between text-text-4">
                  <span className="text-text-secondary">{line.split(':')[0]}</span>
                  <span className="font-semibold text-text-default">{line.split(':').slice(1).join(':').trim()}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
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
            <label className="block text-text-4 font-semibold text-text-default mb-spacing-1">Search Name</label>
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="e.g., 3-bed homes in San Jose"
              className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-4 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-4 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!addName.trim()}
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-4 font-semibold hover:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
