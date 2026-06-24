import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { CollapsibleCard } from './CollapsibleCard';

type Tag = {
  id: string;
  label: string;
};

const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', label: 'Example' },
  { id: 'tag-2', label: 'Example' },
  { id: 'tag-3', label: 'Example' },
];

export function TagsCard() {
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setTags((prev) => [...prev, { id: `tag-${Date.now()}`, label: trimmed }]);
      setInputValue('');
    }
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      setTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
      setTagToDelete(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <CollapsibleCard data-component="LeadSignalTagsCard" title="Custom Tags" countBadge={tags.length}>
        {/* Tag chips with X delete button */}
        <div className="flex flex-wrap gap-spacing-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-spacing-2 h-7 pl-spacing-3 pr-spacing-2 rounded-round bg-gray-30 text-text-default"
            >
              <span className="text-sm font-medium whitespace-nowrap">{tag.label}</span>
              <button
                type="button"
                aria-label={`Delete tag "${tag.label}"`}
                onClick={() => setTagToDelete(tag)}
                className="inline-flex items-center justify-center w-4 h-4 rounded-round hover:bg-black/10 transition cursor-pointer"
              >
                <X className="w-3 h-3 text-[#101828]" />
              </button>
            </div>
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
            className="w-full h-9 pl-8 pr-3 border border-border-default rounded-1 text-text-3 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring bg-white transition-shadow"
          />
        </div>
      </CollapsibleCard>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag{' '}
              <strong className="text-[#101828]">"{tagToDelete?.label}"</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-100 hover:bg-red-110 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
