import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Pencil,
  Flag,
  Trash2,
} from 'lucide-react';

type FieldType = 'phone' | 'email' | 'address';

interface ContactFieldRowProps {
  type: FieldType;
  label: string;
  value: string;
  status: 'good' | 'bad';
  onEdit?: () => void;
  onMarkBad?: () => void;
  onMarkGood?: () => void;
  onDelete?: () => void;
}

export function ContactFieldRow({
  type,
  label,
  value,
  status,
  onEdit,
  onMarkBad,
  onMarkGood,
  onDelete,
}: ContactFieldRowProps) {
  // Don't render if blank
  if (!value || value.trim() === '') return null;

  const primaryActionLabel =
    type === 'phone' ? 'Call' : type === 'email' ? 'Send Email' : 'See On Map';

  const handlePrimaryAction = () => {
    if (type === 'phone') window.location.href = `tel:${value}`;
    if (type === 'email') window.location.href = `mailto:${value}`;
    if (type === 'address')
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(value)}`,
        '_blank',
      );
  };

  const handleCopy = () => navigator.clipboard.writeText(value);

  return (
    <div className="flex items-center justify-between gap-spacing-3 min-h-9">
      {/* LEFT: Label */}
      <span className="text-sm text-[#667085] flex-shrink-0">{label}</span>

      {/* RIGHT: Value + chevron (single unified trigger) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-spacing-1 group/value max-w-full min-w-0"
            aria-label={`${label} actions`}
          >
            {status === 'bad' && (
              <AlertTriangle className="w-4 h-4 text-[#f48a3c] flex-shrink-0" />
            )}
            <span
              title={value}
              className={`text-sm font-medium truncate whitespace-nowrap transition ${
                status === 'bad'
                  ? 'text-[#ec423d] group-hover/value:text-[#cc0a1b]'
                  : 'text-[#3e60c9] group-hover/value:text-[#3840a9]'
              }`}
            >
              {value}
            </span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition ${
                status === 'bad'
                  ? 'text-[#ec423d] group-hover/value:text-[#cc0a1b]'
                  : 'text-[#3e60c9] group-hover/value:text-[#3840a9]'
              }`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handlePrimaryAction}>
            {primaryActionLabel}
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-spacing-2" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-spacing-2" />
            Copy
          </DropdownMenuItem>
          {status === 'good' && onMarkBad && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onMarkBad}>
                <Flag className="w-4 h-4 mr-spacing-2" />
                Mark as Bad
              </DropdownMenuItem>
            </>
          )}
          {status === 'bad' && onMarkGood && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onMarkGood}>
                <Flag className="w-4 h-4 mr-spacing-2" />
                Mark as Good
              </DropdownMenuItem>
            </>
          )}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-[#ec423d] focus:bg-[#ffe0e4]"
              >
                <Trash2 className="w-4 h-4 mr-spacing-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
