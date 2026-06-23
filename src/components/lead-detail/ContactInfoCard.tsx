import { useState } from 'react';
import { Phone, Globe, Mail, MapPin, Pencil, TriangleAlert as AlertTriangle, ChevronDown, Copy, Flag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

/** Fields that can be inline-edited in the Contact column */
type EditableField = 'primary' | 'alt' | 'email' | 'address';

/** Input type per editable field */
const FIELD_INPUT_TYPE: Record<EditableField, string> = {
  primary: 'tel',
  alt: 'tel',
  email: 'email',
  address: 'text',
};

/** Map EditableField to ContactInfo keys */
const FIELD_TO_CONTACT_KEY: Record<EditableField, keyof ContactInfo> = {
  primary: 'primary',
  alt: 'alt',
  email: 'email',
  address: 'street',
};

/** Map EditableField to status keys in ContactInfo */
const FIELD_TO_STATUS_KEY: Record<string, keyof ContactInfo> = {
  primary: 'primaryStatus',
  alt: 'altStatus',
  email: 'emailStatus',
};

/** Field type for dropdown menus */
const FIELD_TYPE_MAP: Record<EditableField, 'phone' | 'email' | 'address'> = {
  primary: 'phone',
  alt: 'phone',
  email: 'email',
  address: 'address',
};

export function ContactInfoCard() {
  const { contactInfo, updateContactInfo } = useContactInfo();

  /* ── About dropdowns ── */
  const [urgency, setUrgency] = useState('none');
  const [status, setStatus] = useState('nurture');
  const [type, setType] = useState('buyer');
  const [timeframe, setTimeframe] = useState('30-days');

  /* ── Contact inline editing ── */
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editDraft, setEditDraft] = useState('');

  /** Get value for a field from shared context */
  const getFieldValue = (field: EditableField): string => {
    const key = FIELD_TO_CONTACT_KEY[field];
    return contactInfo[key] as string;
  };

  /** Get status for a field from shared context */
  const getFieldStatus = (field: EditableField): FieldStatus => {
    const statusKey = FIELD_TO_STATUS_KEY[field];
    if (statusKey) return contactInfo[statusKey] as FieldStatus;
    return 'good';
  };

  const startEditing = (field: EditableField) => {
    setEditingField(field);
    setEditDraft(getFieldValue(field));
  };

  const saveEdit = () => {
    if (editingField) {
      const key = FIELD_TO_CONTACT_KEY[editingField];
      updateContactInfo({ [key]: editDraft } as Partial<ContactInfo>);
      toast(
        `${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated`,
      );
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  /* ── Status & delete handlers ── */
  const markStatus = (field: EditableField, newStatus: FieldStatus) => {
    const statusKey = FIELD_TO_STATUS_KEY[field];
    if (statusKey) {
      updateContactInfo({ [statusKey]: newStatus } as Partial<ContactInfo>);
      toast(
        `${field.charAt(0).toUpperCase() + field.slice(1)} marked as ${newStatus}`,
      );
    }
  };

  const deleteField = (field: EditableField) => {
    if (field === 'address') {
      updateContactInfo({ street: '', city: '', state: '', zip: '' });
    } else {
      const key = FIELD_TO_CONTACT_KEY[field];
      updateContactInfo({ [key]: '' } as Partial<ContactInfo>);
    }
    toast(`${field.charAt(0).toUpperCase() + field.slice(1)} deleted`);
  };

  /* ── About handlers ── */
  const handleUrgency = (val: string) => {
    setUrgency(val);
    toast(`Urgency updated to ${val.replace(/-/g, ' ')}`);
  };
  const handleStatus = (val: string) => {
    setStatus(val);
    toast(`Status updated to ${val.replace(/-/g, ' ')}`);
  };
  const handleType = (val: string) => {
    setType(val);
    toast(`Type updated to ${val}`);
  };
  const handleTimeframe = (val: string) => {
    setTimeframe(val);
    toast(`Timeframe updated to ${val.replace(/-/g, ' ')}`);
  };

  /** Primary action for a field type */
  const handlePrimaryAction = (field: EditableField, value: string) => {
    const fieldType = FIELD_TYPE_MAP[field];
    if (fieldType === 'phone') window.location.href = `tel:${value}`;
    if (fieldType === 'email') window.location.href = `mailto:${value}`;
    if (fieldType === 'address')
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(value)}`,
        '_blank',
      );
  };

  /** Render a single Contact row with unified value+chevron trigger + hover-pencil + inline editing */
  const renderContactRow = (field: EditableField, label: string) => {
    const value = getFieldValue(field);
    const fieldStatus = getFieldStatus(field);
    const isEditing = editingField === field;
    const inputType = FIELD_INPUT_TYPE[field];
    const fieldType = FIELD_TYPE_MAP[field];
    const primaryLabel =
      fieldType === 'phone'
        ? 'Call'
        : fieldType === 'email'
          ? 'Send Email'
          : 'See On Map';

    // Don't render if blank
    if (!value || value.trim() === '') return null;

    if (isEditing) {
      return (
        <div
          key={field}
          className="flex items-center justify-between gap-spacing-3 min-h-9"
        >
          <span className="text-sm text-[#667085] flex-shrink-0">{label}</span>
          <Input
            type={inputType}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEdit}
            autoFocus
            className="h-9 flex-1 max-w-[180px] border border-[#E4E7EC] rounded-1 px-spacing-3 text-sm font-medium text-[#101828] bg-white focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition"
          />
        </div>
      );
    }

    return (
      <div
        key={field}
        className="flex items-center justify-between gap-spacing-3 min-h-9"
      >
        <span className="text-sm text-[#667085] flex-shrink-0">{label}</span>

        <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
          {/* Unified value + chevron dropdown trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-spacing-1 group/value min-w-0"
                aria-label={`${label} actions`}
              >
                {fieldStatus === 'bad' && (
                  <AlertTriangle className="w-4 h-4 text-[#f48a3c] flex-shrink-0" />
                )}
                <span
                  title={value}
                  className={`text-sm font-medium truncate whitespace-nowrap transition ${
                    fieldStatus === 'bad'
                      ? 'text-[#ec423d] group-hover/value:text-[#cc0a1b]'
                      : 'text-[#3e60c9] group-hover/value:text-[#3840a9]'
                  }`}
                >
                  {value}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition ${
                    fieldStatus === 'bad'
                      ? 'text-[#ec423d] group-hover/value:text-[#cc0a1b]'
                      : 'text-[#3e60c9] group-hover/value:text-[#3840a9]'
                  }`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                onClick={() => handlePrimaryAction(field, value)}
              >
                {fieldType === 'phone' && <Phone className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
                {fieldType === 'email' && <Mail className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
                {fieldType === 'address' && <MapPin className="w-4 h-4 mr-spacing-2" aria-hidden="true" />}
                {primaryLabel}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => startEditing(field)}>
                <Pencil className="w-4 h-4 mr-spacing-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(value)}
              >
                <Copy className="w-4 h-4 mr-spacing-2" />
                Copy
              </DropdownMenuItem>
              {/* Mark as Bad/Good — only for phone and email */}
              {FIELD_TO_STATUS_KEY[field] && (
                <>
                  <DropdownMenuSeparator />
                  {fieldStatus === 'good' ? (
                    <DropdownMenuItem
                      onClick={() => markStatus(field, 'bad')}
                    >
                      <Flag className="w-4 h-4 mr-spacing-2" />
                      Mark as Bad
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => markStatus(field, 'good')}
                    >
                      <Flag className="w-4 h-4 mr-spacing-2" />
                      Mark as Good
                    </DropdownMenuItem>
                  )}
                </>
              )}
              {/* Delete — phone and address only, not email */}
              {field !== 'email' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deleteField(field)}
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
      </div>
    );
  };

  return (
    <div
      data-component="LeadDataSnapshotCard"
      className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden"
    >
      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(180px,1fr)_1px_minmax(220px,1fr)_1px_minmax(200px,1fr)]">
        {/* ── COLUMN 1: Contact (no header) ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {renderContactRow('primary', 'Primary')}
            {renderContactRow('alt', 'Alt')}
            {renderContactRow('email', 'Email')}
            {renderContactRow('address', 'Address')}
          </div>
        </div>

        {/* Horizontal divider — visible below lg only */}
        <div className="xl:hidden mx-spacing-5 h-px bg-[#E4E7EC]" />

        {/* Vertical divider — visible at lg+ only */}
        <div className="hidden xl:block my-spacing-3 w-px bg-[#E4E7EC]" />

        {/* ── COLUMN 2: Highlights (no header) ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Online */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Online
              </span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span className="inline-flex items-center gap-spacing-2 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
                  </span>
                  <span className="text-text-4 font-normal text-success-text">
                    Online Now
                  </span>
                </span>
              </div>
            </div>

            {/* Contacted */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Contacted
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span
                  className="text-sm text-[#101828] truncate whitespace-nowrap"
                  title="3 days ago"
                >
                  3 days ago
                </span>
                <Phone className="w-4 h-4 flex-shrink-0 text-[#475467]" />
              </div>
            </div>

            {/* Login */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Login
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span
                  className="text-sm text-[#101828] truncate whitespace-nowrap"
                  title="14 days ago"
                >
                  14 days ago
                </span>
                <Globe className="w-4 h-4 flex-shrink-0 text-[#475467]" />
              </div>
            </div>

            {/* IP */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">IP</span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span
                  className="text-sm text-[#101828] truncate whitespace-nowrap"
                  title="San Jose, CA"
                >
                  San Jose, CA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal divider — visible below lg only */}
        <div className="xl:hidden mx-spacing-5 h-px bg-[#E4E7EC]" />

        {/* Vertical divider — visible at lg+ only */}
        <div className="hidden xl:block my-spacing-3 w-px bg-[#E4E7EC]" />

        {/* ── COLUMN 3: About (no header) ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Urgency */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Urgency
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={urgency} onValueChange={handleUrgency}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fire">Fire (Daily)</SelectItem>
                    <SelectItem value="hot">Hot (Weekly)</SelectItem>
                    <SelectItem value="warm">Warm (Monthly)</SelectItem>
                    <SelectItem value="long-term">
                      Long Term (Quarterly)
                    </SelectItem>
                    <SelectItem value="do-not-contact">
                      Do Not Contact
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Status
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={status} onValueChange={handleStatus}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="Nurture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="attempted-contact">
                      Attempted Contact
                    </SelectItem>
                    <SelectItem value="nurture">Nurture</SelectItem>
                    <SelectItem value="appointment-set">
                      Appointment Set
                    </SelectItem>
                    <SelectItem value="showing-listing">
                      Showing/Listing
                    </SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="do-not-contact">
                      Do Not Contact
                    </SelectItem>
                    <SelectItem value="non-client">Non-Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Type
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={type} onValueChange={handleType}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="Buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timeframe */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">
                Timeframe
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={timeframe} onValueChange={handleTimeframe}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="30 Days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="60-days">60 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
