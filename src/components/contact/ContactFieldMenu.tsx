import {
  Phone,
  Mail,
  MapPin,
  Pencil,
  Copy,
  Flag,
  Trash2,
  ChevronDown,
  TriangleAlert as AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  useContactInfo,
  type ContactInfo,
  type FieldStatus,
} from '@/contexts/ContactInfoContext';

/** Fields that support a status flag + delete (phone + email). */
type StatusField = 'primary' | 'alt' | 'email';

/** All fields that can show an action menu. */
export type MenuField = StatusField | 'address';

const STATUS_KEYS: Record<StatusField, keyof ContactInfo> = {
  primary: 'primaryStatus',
  alt: 'altStatus',
  email: 'emailStatus',
};

const DIALOG_KEYS: Record<MenuField, string> = {
  primary: 'primary',
  alt: 'alt',
  email: 'email',
  address: 'street',
};

/** Class shared by the trigger button so both surfaces look identical. */
const TRIGGER_BTN =
  'inline-flex items-center gap-spacing-2 rounded-1 px-1 -mx-1 hover:bg-gray-30/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 transition min-w-0 max-w-full';

interface ContactFieldMenuProps {
  field: MenuField;
  value: string;
  /** Optional full address string (for the address map/copy actions). */
  fullAddress?: string;
  /** Override the status for phone/email fields (read from context by default). */
  fieldStatus?: FieldStatus;
  /** Show the chevron (default true). Hide for secondary address lines. */
  showChevron?: boolean;
  /** Extra classes on the value span (e.g. leading-5 for multi-line address). */
  valueClassName?: string;
  /** Right margin to offset secondary lines from the chevron width. */
  triggerClassName?: string;
  /** Aria-label suffix; defaults to the field label. */
  ariaLabel?: string;
}

/**
 * Shared per-field action menu used by both the Snapshot (top strip) and
 * the Contact Info card (right column). Keeps the two surfaces identical.
 */
export function ContactFieldMenu({
  field,
  value,
  fullAddress,
  showChevron = true,
  valueClassName,
  triggerClassName,
  ariaLabel,
}: ContactFieldMenuProps) {
  const { contactInfo, updateContactInfo, openContactDialog } = useContactInfo();

  const isStatusField = (f: MenuField): f is StatusField => f in STATUS_KEYS;
  const hasStatus = isStatusField(field);
  const status: FieldStatus = hasStatus
    ? (contactInfo[STATUS_KEYS[field]] as FieldStatus)
    : 'good';

  const fieldType: 'phone' | 'email' | 'address' =
    field === 'email' ? 'email' : field === 'address' ? 'address' : 'phone';

  const primaryLabel =
    fieldType === 'phone'
      ? 'Call'
      : fieldType === 'email'
        ? 'Send Email'
        : 'See On Map';

  const handlePrimaryAction = () => {
    if (fieldType === 'phone') window.location.href = `tel:${value}`;
    if (fieldType === 'email') window.location.href = `mailto:${value}`;
    if (fieldType === 'address') {
      const addr = fullAddress ?? value;
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(addr)}`,
        '_blank',
      );
    }
  };

  const handleEdit = () => openContactDialog(DIALOG_KEYS[field]);

  const handleCopy = () => {
    const text = field === 'address' ? (fullAddress ?? value) : value;
    navigator.clipboard.writeText(text);
  };

  const markStatus = (newStatus: FieldStatus) => {
    if (!hasStatus) return;
    const statusKey = STATUS_KEYS[field];
    updateContactInfo({ [statusKey]: newStatus } as Partial<ContactInfo>);
    toast(
      `${field.charAt(0).toUpperCase() + field.slice(1)} marked as ${newStatus}`,
    );
  };

  const deleteField = () => {
    if (field === 'address') {
      updateContactInfo({ street: '', city: '', state: '', zip: '' });
    } else {
      const key = field as Exclude<MenuField, 'address'>;
      updateContactInfo({ [key]: '' } as Partial<ContactInfo>);
    }
    toast(`${field.charAt(0).toUpperCase() + field.slice(1)} deleted`);
  };

  const baseValueClass = `text-sm font-medium text-left min-w-0 truncate ${
    status === 'bad' ? 'text-[#ec423d]' : 'text-blue-100'
  }`;
  const valueClass = valueClassName
    ? `${baseValueClass} ${valueClassName}`
    : baseValueClass;

  const label = ariaLabel ?? field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`${TRIGGER_BTN} ${triggerClassName ?? ''}`}
          aria-label={`${label} actions`}
        >
          {status === 'bad' && (
            <AlertTriangle className="w-4 h-4 text-[#f48a3c] inline mr-spacing-1 flex-shrink-0" />
          )}
          <span className={valueClass} title={value}>
            {value}
          </span>
          {showChevron && (
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition ${
                status === 'bad' ? 'text-[#ec423d]' : 'text-blue-100'
              }`}
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handlePrimaryAction}>
          {fieldType === 'phone' && <Phone className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
          {fieldType === 'email' && <Mail className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
          {fieldType === 'address' && <MapPin className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
          {primaryLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="w-4 h-4 mr-spacing-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-spacing-2" />
          Copy
        </DropdownMenuItem>
        {hasStatus && (
          <>
            <DropdownMenuSeparator />
            {status === 'good' ? (
              <DropdownMenuItem onClick={() => markStatus('bad')}>
                <Flag className="w-4 h-4 mr-spacing-2" />
                Mark as Bad
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => markStatus('good')}>
                <Flag className="w-4 h-4 mr-spacing-2" />
                Mark as Good
              </DropdownMenuItem>
            )}
          </>
        )}
        {/* Delete — phone and address, not email */}
        {field !== 'email' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteField}
              className="text-[#ec423d] focus:bg-[#ffe0e4]"
            >
              <Trash2 className="w-4 h-4 mr-spacing-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
