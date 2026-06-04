import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CollapsibleCard } from './CollapsibleCard';
import type { TagVariant } from './TagOverflowList';

/** Map tag labels to their unified variant */
const TAG_VARIANT_MAP: Record<string, TagVariant> = {
  // Communication (blue)
  'New Lead': 'communication',
  'Agent Ready': 'communication',
  'Property Inquiry': 'communication',
  'Email Received': 'communication',
  'Email Opened': 'communication',
  'Text Received': 'communication',
  'Chat Received': 'communication',
  'Valuation Request': 'communication',

  // Behavior (orange)
  'Multiple Site Visits': 'behavior',
  '3 Favorited Properties': 'behavior',
  'Phone Updated': 'behavior',
  '9 Visits': 'behavior',
  '3 Properties Viewed': 'behavior',
  'Same Property Viewed': 'behavior',
  'Property Shared': 'behavior',
  '3 Searches': 'behavior',
  '4 Valuation Views': 'behavior',
  'New Activity': 'behavior',
  'Immediate Timeframe': 'behavior',
  'Budget - $850K': 'behavior',

  // Live (green)
  'Online Now': 'live',
};

function getVariant(label: string): TagVariant {
  return TAG_VARIANT_MAP[label] ?? 'communication';
}

const initialTags = [
  'Email Received',
  'Online Now',
  '3 Favorited Properties',
];

export function TagsCard() {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    toast(`Removed tag "${tag}"`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <CollapsibleCard title="Tags" countBadge={tags.length}>
      {/* Tag chips — no icons, using unified Badge */}
      <div className="flex flex-wrap gap-spacing-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => removeTag(tag)}
            className="cursor-pointer hover:opacity-80 transition-opacity max-w-[180px]"
            title={`Click to remove "${tag}"`}
          >
            <Badge variant={getVariant(tag)} className="pointer-events-none">
              <span className="truncate">{tag}</span>
            </Badge>
          </button>
        ))}
      </div>

      {/* Add tag input */}
      <div className="relative mt-spacing-3">
        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag"
          className="w-full h-9 pl-8 pr-3 border border-border-default rounded-2 text-text-4 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring bg-white transition-shadow"
        />
      </div>
    </CollapsibleCard>
  );
}
