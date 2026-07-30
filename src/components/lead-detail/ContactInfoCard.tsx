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
   * Renders a contact row (Primary, Email) in the top strip.
   * The value text AND chevron are a single unified menu trigger —
   * see the PROTECTED marker inside the JSX for details.
   */
  const renderContactRow = (field: EditableField, label: string, gridClass = '') => {
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
        className={`flex items-start justify-between gap-spacing-3 min-h-[60px] ${gridClass}`}
      >
        <span className="text-sm text-text-muted flex-shrink-0">{label}</span>

        {/**
         * PROTECTED — Field menu trigger.
         * Both the value text AND the chevron open the same field menu.
         * The menu contains action items (Call/Text/Copy/etc.) plus Edit as the last item.
         * Edit opens the ContactEditDialog with this field auto-focused.
         *
         * Do NOT reintroduce a direct-to-dialog click on the value.
         * The unified menu is intentional — one row, one interaction model,
         * multiple actions surfaced via the menu.
         */}
        <div className="min-w-0 flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-spacing-2 rounded-1 px-1 -mx-1 hover:bg-gray-30/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 transition min-w-0 max-w-full"
                aria-label={`${label} actions`}
              >
                <span
                  className={`text-sm font-medium truncate whitespace-nowrap text-left ${
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
                </span>
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

  // Address composite — street + (optional Line 2) + city/state/zip
  const hasAddress = contactInfo.street.trim() !== '';
  const cityStateZip = [contactInfo.city, contactInfo.state, contactInfo.zip]
    .filter(Boolean)
    .join(', ');
  const hasAddressLine2 = contactInfo.addressLine2.trim() !== '';
  const fullAddress = [contactInfo.street, contactInfo.addressLine2, cityStateZip].filter(Boolean).join(', ');

  const renderAddressMenuContent = () => (
    <DropdownMenuContent align="end" className="w-[180px]">
      <DropdownMenuItem
        onClick={() =>
          window.open(
            `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
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
        onClick={() => navigator.clipboard.writeText(fullAddress)}
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
  );

  return (
    <div
      data-component="LeadDataSnapshotCard"
      className="bg-white border border-[#E4E7EC] rounded-3 overflow-hidden"
    >
      {/**
       * PROTECTED — Top contact strip uses a single 4-row × 3-column grid.
       * Row 3 uses items-start + xl:items-baseline so the multi-line address cell
       * can grow while labels cross-align by baseline.
       *
       * Address is a SINGLE cell at r3c1 containing all lines (street, optional
       * Line 2, city/state/zip) stacked tightly in a flex-col value column.
       * Row 4 left column is empty (no r4c1 cell).
       *
       * DO NOT split the address into r3c1 + r4c1 — city/state/zip must stay
       * inside the address cell for visual grouping and tight line-spacing.
       * DO NOT use items-center on the address cell — items-start is required
       * for label to align with the FIRST line of the multi-line value.
       */}
      <div className="grid grid-cols-1 gap-y-spacing-3 p-spacing-5 xl:grid-cols-[minmax(180px,1fr)_1px_minmax(220px,1fr)_1px_minmax(200px,1fr)] xl:grid-rows-[auto_auto_auto_auto] xl:gap-x-spacing-5 xl:items-baseline">
        {renderContactRow('primary', 'Primary', 'xl:col-start-1 xl:row-start-1')}
        {renderContactRow('email', 'Email', 'xl:col-start-1 xl:row-start-2')}

            {/**
             * PROTECTED — Address is a SINGLE grid cell containing all lines.
             *
             * Structure:
             *   - Cell at r3c1 with `flex items-start`
             *   - Label spans on left, value column (flex-col items-end gap-0) on right
             *   - Value column stacks: street → (optional Line 2) → city/state/zip
             *   - All value lines are 14px/20px (text-sm leading-5), tightly spaced (gap-0)
             *
             * Alignment:
             *   - Grid uses `align-items: baseline` so row-3 labels cross-align (Address baseline
             *     = Login baseline = Type baseline).
             *   - Cell's first-baseline is the label / street line's baseline.
             *   - City/state/zip flows below street with tight line-spacing, extending
             *     the cell's height beyond row 4's normal position.
             *
             * Do NOT split into r3c1 + r4c1 — city/state/zip must be inside the address cell
             * to maintain the visual grouping and tight line-spacing.
             *
             * Do NOT use items-center or items-baseline on this cell — items-start is required
             * for label to align with the FIRST line of the multi-line value.
             */}
            {hasAddress && (
              <div className="flex items-start gap-spacing-3 min-h-[60px] xl:col-start-1 xl:row-start-3">
                <span className="w-24 text-sm leading-5 text-text-muted flex-shrink-0">
                  Address
                </span>
                <div className="flex-1 min-w-0 flex flex-col items-end gap-0">
                  {/* Line 1: street with chevron menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-spacing-2 rounded-1 px-1 -mx-1 hover:bg-gray-30/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 transition min-w-0 max-w-full"
                        aria-label="Address actions"
                      >
                        <span
                          className="text-sm font-medium leading-5 text-blue-100 text-left whitespace-nowrap"
                          title={contactInfo.street}
                        >
                          {contactInfo.street}
                        </span>
                        <ChevronDown className="w-4 h-4 flex-shrink-0 text-blue-100" />
                      </button>
                    </DropdownMenuTrigger>
                    {renderAddressMenuContent()}
                  </DropdownMenu>

                  {/* Line 2 (optional): Address Line 2 — no chevron */}
                  {hasAddressLine2 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-1 px-1 -mx-1 hover:bg-gray-30/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 transition min-w-0 max-w-full"
                          aria-label="Address actions"
                        >
                          <span
                            className="text-sm font-medium leading-5 text-blue-100 text-left whitespace-nowrap"
                            title={contactInfo.addressLine2}
                          >
                            {contactInfo.addressLine2}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      {renderAddressMenuContent()}
                    </DropdownMenu>
                  )}

                  {/* Line 3 (or 2): city/state/zip — no chevron */}
                  {cityStateZip && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-1 px-1 -mx-1 hover:bg-gray-30/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 transition min-w-0 max-w-full"
                          aria-label="Address actions"
                        >
                          <span
                            className="text-sm font-medium leading-5 text-blue-100 text-left whitespace-nowrap"
                            title={cityStateZip}
                          >
                            {cityStateZip}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      {renderAddressMenuContent()}
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}

        {/* Divider 1 — horizontal on mobile, vertical spanning all rows on xl */}
        <div className="h-px xl:h-auto xl:w-px bg-border-default xl:col-start-2 xl:row-start-1 xl:row-span-4" />

        {/* ── COLUMN 2: Highlights ── */}
        {/* Online — row 1 */}
        <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-3 xl:row-start-1">
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

            {/* Contacted — row 2 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-3 xl:row-start-2">
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

            {/* Login — row 3 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-3 xl:row-start-3">
              <span className="text-sm leading-5 text-text-muted flex-shrink-0">
                Login
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span
                  className="text-sm leading-5 text-text-default truncate whitespace-nowrap"
                  title="14 days ago"
                >
                  14 days ago
                </span>
                <Globe className="w-4 h-4 flex-shrink-0 text-text-secondary" />
              </div>
            </div>

            {/* IP — row 4 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-3 xl:row-start-4">
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

        {/* Divider 2 — horizontal on mobile, vertical spanning all rows on xl */}
        <div className="h-px xl:h-auto xl:w-px bg-border-default xl:col-start-4 xl:row-start-1 xl:row-span-4" />

        {/* ── COLUMN 3: About ── */}
        {/* Urgency — row 1 */}
        <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-5 xl:row-start-1">
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

            {/* Status — row 2 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-5 xl:row-start-2">
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

            {/* Type — row 3 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-5 xl:row-start-3">
              <span className="text-sm leading-5 text-text-muted flex-shrink-0">
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

            {/* Timeframe — row 4 */}
            <div className="flex items-start justify-between gap-spacing-3 min-h-[60px] xl:col-start-5 xl:row-start-4">
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
  );
}
