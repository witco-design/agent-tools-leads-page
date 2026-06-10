import { useState } from 'react';
import { Phone, Globe, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/** Fields that can be inline-edited in the Contact column */
type EditableField = 'primary' | 'alt' | 'email' | 'address';

/** Input type per editable field */
const FIELD_INPUT_TYPE: Record<EditableField, string> = {
  primary: 'tel',
  alt: 'tel',
  email: 'email',
  address: 'text',
};

export function ContactInfoCard() {
  /* ── About dropdowns ── */
  const [urgency, setUrgency] = useState('none');
  const [status, setStatus] = useState('nurture');
  const [type, setType] = useState('buyer');
  const [timeframe, setTimeframe] = useState('30-days');

  /* ── Contact inline editing ── */
  const [contactValues, setContactValues] = useState<Record<EditableField, string>>({
    primary: '(415) 555-0142',
    alt: '(415) 555-0188',
    email: 'cdubois@realgeeks.com',
    address: 'Mountain View, CA 94041',
  });
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const startEditing = (field: EditableField) => {
    setEditingField(field);
    setEditDraft(contactValues[field]);
  };

  const saveEdit = () => {
    if (editingField) {
      setContactValues((prev) => ({ ...prev, [editingField]: editDraft }));
      toast(`${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated`);
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

  /** Build href for a contact field */
  const hrefFor = (field: EditableField, value: string) => {
    if (field === 'primary' || field === 'alt') {
      return `tel:${value.replace(/[^+\d]/g, '')}`;
    }
    if (field === 'email') {
      return `mailto:${value}`;
    }
    return undefined;
  };

  /** Render a single Contact row with hover-reveal pencil + inline editing */
  const renderContactRow = (field: EditableField, label: string) => {
    const value = contactValues[field];
    const isEditing = editingField === field;
    const href = hrefFor(field, value);
    const inputType = FIELD_INPUT_TYPE[field];

    if (isEditing) {
      return (
        <div key={field} className="flex items-center justify-between gap-spacing-3 min-h-9">
          <span className="text-sm text-[#667085] flex-shrink-0">{label}</span>
          <Input
            type={inputType}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEdit}
            autoFocus
            className="h-9 flex-1 max-w-[180px] border border-[#E4E7EC] rounded-2 px-spacing-3 text-sm font-medium text-[#101828] bg-white focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition"
          />
        </div>
      );
    }

    return (
      <div key={field} className="group flex items-center justify-between gap-spacing-3 min-h-9">
        <span className="text-sm text-[#667085] flex-shrink-0">{label}</span>

        <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
          {href ? (
            <a
              href={href}
              title={value}
              className="text-sm font-medium text-[#3E60C9] hover:text-[#3840A9] truncate whitespace-nowrap transition"
            >
              {value}
            </a>
          ) : (
            <span className="text-sm font-medium text-[#101828] truncate whitespace-nowrap" title={value}>
              {value}
            </span>
          )}

          <button
            type="button"
            aria-label={`Edit ${label.toLowerCase()}`}
            onClick={() => startEditing(field)}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-[#667085] hover:text-[#475467] flex-shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div data-component="LeadDataSnapshotCard" className="bg-white border border-[#E4E7EC] rounded-3 shadow-sm overflow-hidden">
      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(180px,1fr)_1px_minmax(200px,1fr)_1px_minmax(220px,1fr)]">

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

        {/* ── COLUMN 2: About (no header) ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Urgency */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Urgency</span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={urgency} onValueChange={handleUrgency}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-2 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fire">Fire (Daily)</SelectItem>
                    <SelectItem value="hot">Hot (Weekly)</SelectItem>
                    <SelectItem value="warm">Warm (Monthly)</SelectItem>
                    <SelectItem value="long-term">Long Term (Quarterly)</SelectItem>
                    <SelectItem value="do-not-contact">Do Not Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Status</span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={status} onValueChange={handleStatus}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-2 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
                    <SelectValue placeholder="Nurture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="attempted-contact">Attempted Contact</SelectItem>
                    <SelectItem value="nurture">Nurture</SelectItem>
                    <SelectItem value="appointment-set">Appointment Set</SelectItem>
                    <SelectItem value="showing-listing">Showing/Listing</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="do-not-contact">Do Not Contact</SelectItem>
                    <SelectItem value="non-client">Non-Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Type</span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={type} onValueChange={handleType}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-2 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
              <span className="text-sm text-[#667085] flex-shrink-0">Timeframe</span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={timeframe} onValueChange={handleTimeframe}>
                  <SelectTrigger className="h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-2 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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

        {/* Horizontal divider — visible below lg only */}
        <div className="xl:hidden mx-spacing-5 h-px bg-[#E4E7EC]" />

        {/* Vertical divider — visible at lg+ only */}
        <div className="hidden xl:block my-spacing-3 w-px bg-[#E4E7EC]" />

        {/* ── COLUMN 3: Highlights (no header) ── */}
        <div className="p-spacing-5">
          <div className="space-y-spacing-3">
            {/* Online */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Online</span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 whitespace-nowrap flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
                  </span>
                  <span className="text-text-4 font-semibold text-success-text">Online Now</span>
                </span>
              </div>
            </div>

            {/* Contacted */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Contacted</span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span className="text-sm text-[#101828] truncate whitespace-nowrap" title="3 days ago">3 days ago</span>
                <Phone className="w-4 h-4 flex-shrink-0 text-[#475467]" />
              </div>
            </div>

            {/* Login */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">Login</span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span className="text-sm text-[#101828] truncate whitespace-nowrap" title="14 days ago">14 days ago</span>
                <Globe className="w-4 h-4 flex-shrink-0 text-[#475467]" />
              </div>
            </div>

            {/* IP */}
            <div className="flex items-center justify-between gap-spacing-3 min-h-9">
              <span className="text-sm text-[#667085] flex-shrink-0">IP</span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span className="text-sm text-[#101828] truncate whitespace-nowrap" title="San Jose, CA">San Jose, CA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
