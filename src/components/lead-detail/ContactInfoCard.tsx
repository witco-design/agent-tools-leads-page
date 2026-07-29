import { useState } from 'react';
import {
  Phone,
  Globe,
  Mail,
  MapPin,
  Pencil,
  TriangleAlert as AlertTriangle,
  ChevronDown,
  Copy,
  Flag,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
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

/** Fields that can be inline-edited in the top contact strip */
type EditableField = 'primary' | 'email' | 'address';

/** Map EditableField to ContactInfo keys */
const FIELD_TO_CONTACT_KEY: Record<EditableField, keyof ContactInfo> = {
  primary: 'primary',
  email: 'email',
  address: 'street',
};

/** Map EditableField to status keys in ContactInfo */
const FIELD_TO_STATUS_KEY: Record<string, keyof ContactInfo> = {
  primary: 'primaryStatus',
  email: 'emailStatus',
};

/** Field type for dropdown menus */
const FIELD_TYPE_MAP: Record<EditableField, 'phone' | 'email' | 'address'> = {
  primary: 'phone',
  email: 'email',
  address: 'address',
};

/** Which dialog field key to focus when opening the contact dialog */
const FIELD_TO_DIALOG_KEY: Record<EditableField, string> = {
  primary: 'primary',
  email: 'email',
  address: 'street',
};

export function ContactInfoCard() {
  const { contactInfo, updateContactInfo, openContactDialog } =
    useContactInfo();

  /* ── About dropdowns ── */
  const [urgency, setUrgency] = useState('none');
  const [status, setStatus] = useState('nurture');
  const [type, setType] = useState('buyer');
  const [timeframe, setTimeframe] = useState('30-days');

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

  /**
   * PROTECTED — Click-to-edit on top strip values.
   * Each field value in the top contact strip is a button that opens
   * the ContactEditDialog with that field auto-focused.
   *
   * The per-field chevron menu (Call/Text/Copy/Edit) is separate and
   * still functional. Edit in that menu ALSO opens the dialog — same
   * end result, discoverable via two paths.
   *
   * Do not remove the value-text click trigger — it's the primary
   * (fastest) edit path for power users.
   */
  const renderContactRow = (field: EditableField, label: string) => {
    const valueKey = FIELD_TO_CONTACT_KEY[field];
    const value = contactInfo[valueKey] as string;
    const fieldStatus = (FIELD_TO_STATUS_KEY[field]
      ? (contactInfo[FIELD_TO_STATUS_KEY[field]] as FieldStatus)
      : 'good');
    const fieldType = FIELD_TYPE_MAP[field];
    const primaryLabel =
      fieldType === 'phone'
        ? 'Call'
        : fieldType === 'email'
          ? 'Send Email'
          : 'See On Map';

    // Don't render if blank
    if (!value || value.trim() === '') return null;

    return (
      <div
        key={field}
        className="flex items-center justify-between gap-spacing-3 min-h-9"
      >
        <span className="text-sm text-text-muted flex-shrink-0">{label}</span>

        <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
          {/* Click-to-edit value text */}
          <button
            type="button"
            onClick={() => openContactDialog(FIELD_TO_DIALOG_KEY[field])}
            className={`text-sm font-medium truncate whitespace-nowrap text-left transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2 rounded-1 ${
              fieldStatus === 'bad'
                ? 'text-[#ec423d]'
                : 'text-blue-100'
            }`}
            title={value}
          >
            {fieldStatus === 'bad' && (
              <AlertTriangle className="w-4 h-4 text-[#f48a3c] inline mr-spacing-1 flex-shrink-0" />
            )}
            {value}
          </button>

          {/* Chevron menu — Call/Text/Copy/Edit */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center"
                aria-label={`${label} actions`}
              >
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition ${
                    fieldStatus === 'bad'
                      ? 'text-[#ec423d]'
                      : 'text-blue-100'
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
              <DropdownMenuItem
                onClick={() => openContactDialog(FIELD_TO_DIALOG_KEY[field])}
              >
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

  // Address composite — street + city/state/zip on two lines
  const hasAddress = contactInfo.street.trim() !== '';
  const addressLine2 = [contactInfo.city, contactInfo.state, contactInfo.zip]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      data-component="LeadDataSnapshotCard"
      className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden"
    >
      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(180px,1fr)_1px_minmax(220px,1fr)_1px_minmax(200px,1fr)]">
        {/* ── COLUMN 1: Contact (no header) — Primary, Email, Address only ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {renderContactRow('primary', 'Primary')}
            {renderContactRow('email', 'Email')}

            {/* Address — 2 lines, click-to-edit */}
            {hasAddress && (
              <div className="flex items-start justify-between gap-spacing-3 min-h-9">
                <span className="text-sm text-text-muted flex-shrink-0 pt-0.5">
                  Address
                </span>
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => openContactDialog('street')}
                    className="text-sm font-medium text-blue-100 hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2 rounded-1"
                  >
                    {contactInfo.street}
                  </button>
                  {addressLine2 && (
                    <button
                      type="button"
                      onClick={() => openContactDialog('street')}
                      className="text-sm font-medium text-blue-100 hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2 rounded-1"
                    >
                      {addressLine2}
                    </button>
                  )}
                </div>
                {/* Chevron menu for address */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center pt-0.5"
                      aria-label="Address actions"
                    >
                      <ChevronDown className="w-4 h-4 flex-shrink-0 text-blue-100" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(
                            [contactInfo.street, addressLine2].filter(Boolean).join(', '),
                          )}`,
                          '_blank',
                        )
                      }
                    >
                      <MapPin className="w-4 h-4 mr-spacing-2" aria-hidden="true" />
                      See On Map
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openContactDialog('street')}>
                      <Pencil className="w-4 h-4 mr-spacing-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          [contactInfo.street, addressLine2].filter(Boolean).join(', '),
                        )
                      }
                    >
                      <Copy className="w-4 h-4 mr-spacing-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteField('address')}
                      className="text-[#ec423d] focus:bg-[#ffe0e4]"
                    >
                      <Trash2 className="w-4 h-4 mr-spacing-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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
              <span className="text-sm text-text-muted flex-shrink-0">
                Online
              </span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span className="inline-flex items-center gap-spacing-2 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
                  </span>
                  <span className="text-text-3 font-normal text-success-text">
                    Online Now
                  </span>
                </span>
              </div>
            </div>

            {/* Contacted */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-text-muted flex-shrink-0">
                Contacted
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span
                  className="text-sm text-text-default truncate whitespace-nowrap"
                  title="3 days ago"
                >
                  3 days ago
                </span>
                <Phone className="w-4 h-4 flex-shrink-0 text-text-secondary" />
              </div>
            </div>

            {/* Login */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-text-muted flex-shrink-0">
                Login
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span
                  className="text-sm text-text-default truncate whitespace-nowrap"
                  title="14 days ago"
                >
                  14 days ago
                </span>
                <Globe className="w-4 h-4 flex-shrink-0 text-text-secondary" />
              </div>
            </div>

            {/* IP */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-text-muted flex-shrink-0">IP</span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span
                  className="text-sm text-text-default truncate whitespace-nowrap"
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
              <span className="text-sm text-text-muted flex-shrink-0">
                Urgency
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={urgency} onValueChange={handleUrgency}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
              <span className="text-sm text-text-muted flex-shrink-0">
                Status
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={status} onValueChange={handleStatus}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
              <span className="text-sm text-text-muted flex-shrink-0">
                Type
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={type} onValueChange={handleType}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
              <span className="text-sm text-text-muted flex-shrink-0">
                Timeframe
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={timeframe} onValueChange={handleTimeframe}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
