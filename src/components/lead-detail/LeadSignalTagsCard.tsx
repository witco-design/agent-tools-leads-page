import { Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EXAMPLE_TAGS = [
  { label: 'Example', bg: '#EBEAFF' }, // Purple/20
  { label: 'Example', bg: '#E4F2FF' }, // Blue/30
  { label: 'Example', bg: '#E0F1EC' }, // Green/30
  { label: 'Example', bg: '#FBE4AB' }, // Orange/20
];

export function LeadSignalTagsCard() {
  return (
    <div className="bg-white border border-border-default rounded-3 p-spacing-3">
      <div className="flex items-center gap-spacing-2 flex-wrap">
        {EXAMPLE_TAGS.map((tag, i) => (
          <Badge
            key={i}
            style={{ backgroundColor: tag.bg }}
            className="whitespace-nowrap text-[#101828] border-0 shadow-none"
          >
            <Circle className="w-3.5 h-3.5" />
            {tag.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
