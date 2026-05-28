import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import { TruncatedText } from './TruncatedText';

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
      {/* Tag chips */}
      <div className="flex flex-wrap gap-spacing-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => removeTag(tag)}
            className="inline-flex items-center px-spacing-3 py-1 rounded-round bg-tag-bg text-tag-text text-text-2 font-medium hover:opacity-80 transition-opacity cursor-pointer max-w-[180px]"
            title={`Click to remove "${tag}"`}
          >
            <TruncatedText>{tag}</TruncatedText>
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
          className="w-full h-9 pl-8 pr-3 border border-border-default rounded-2 text-text-3 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring bg-white transition-shadow"
        />
      </div>
    </CollapsibleCard>
  );
}
