import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useVersion } from '@/contexts/VersionContext';

const EXAMPLE_TAGS = [
  { label: 'Example', bg: '#EBEAFF' },
  { label: 'Example', bg: '#E4F2FF' },
  { label: 'Example', bg: '#E0F1EC' },
  { label: 'Example', bg: '#FBE4AB' },
];

export function LeadSignalTagsCard() {
  const { emptyMode } = useVersion();

  return (
    <div className="bg-white border border-border-default rounded-3 p-spacing-3">
      {emptyMode ? (
        <button
          type="button"
          onClick={() => {}}
          className="inline-flex items-center gap-spacing-1 px-spacing-3 py-spacing-1 rounded-round border border-dashed border-border-default text-text-muted text-text-3 font-medium hover:bg-bg-muted transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add tags
        </button>
      ) : (
        <div className="flex items-center gap-spacing-2 flex-wrap">
          {EXAMPLE_TAGS.map((tag, i) => (
            <Badge
              key={i}
              style={{ backgroundColor: tag.bg }}
              className="whitespace-nowrap text-[#101828] border-0 shadow-none"
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
