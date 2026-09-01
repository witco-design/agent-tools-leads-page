import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContactInfo } from '@/contexts/ContactInfoContext';
import { useVersion } from '@/contexts/VersionContext';
import { LEAD_TIMEZONE, formatLocalTime } from './leadConstants';

export function ContactInfoCard() {
  const { contactInfo, openContactDialog } = useContactInfo();
  const { emptyMode } = useVersion();

  const [snapshotOpen, setSnapshotOpen] = useState(true);

  const [localTime, setLocalTime] = useState(() => formatLocalTime(LEAD_TIMEZONE));
  useEffect(() => {
    setLocalTime(formatLocalTime(LEAD_TIMEZONE));
    const id = setInterval(() => setLocalTime(formatLocalTime(LEAD_TIMEZONE)), 60_000);
    return () => clearInterval(id);
  }, []);

  const [urgency, setUrgency] = useState('none');
  const [status, setStatus] = useState('nurture');
  const [type, setType] = useState('buyer');
  const [timeframe, setTimeframe] = useState('30-days');

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

  const renderContactRow = (field: 'primary' | 'email', label: string, gridClass = '') => {
    const value = contactInfo[field];

    if (emptyMode || !value || value.trim() === '') {
      const addLabel = field === 'primary' ? 'Add phone number' : 'Add email';
      return (
        <div
          className={`flex items-center justify-between gap-spacing-3 xl:min-h-[40px] ${gridClass}`}
        >
          <span className="text-sm text-text-muted flex-shrink-0">{label}</span>
          <div className="min-w-0 flex-1 flex justify-end">
            <button
              type="button"
              onClick={() => openContactDialog(field)}
              className="text-sm text-text-link hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              {addLabel}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex items-start justify-between gap-spacing-3 xl:min-h-[40px] ${gridClass}`}
      >
        <span className="text-sm text-text-muted flex-shrink-0">{label}</span>
        <div className="min-w-0 flex-1 flex justify-end">
          <span className="text-sm text-text-default truncate">{value}</span>
        </div>
      </div>
    );
  };

  const cityStateZip = [contactInfo.city, contactInfo.state, contactInfo.zip]
    .filter(Boolean)
    .join(', ');
  const fullAddress = [contactInfo.street, contactInfo.addressLine2, cityStateZip].filter(Boolean).join(', ');
  const hasAddress = contactInfo.street.trim() !== '';

  return (
    <div
      data-component="LeadDataSnapshotCard"
      className="bg-bg-card border border-border-default rounded-3 overflow-hidden"
    >
      {/* ── Snapshot header ── */}
      <div className="px-spacing-5 py-spacing-3 flex items-center justify-between">
        <div className="flex items-center gap-spacing-2">
          <Zap className="w-4 h-4 text-blue-100 shrink-0" />
          <h3 className="text-text-4 font-semibold text-text-default">Snapshot</h3>
        </div>
        <button
          type="button"
          aria-label={snapshotOpen ? 'Collapse Snapshot' : 'Expand Snapshot'}
          className="p-spacing-1 hover:bg-bg-muted rounded-1 transition-colors cursor-pointer"
          onClick={() => setSnapshotOpen((prev) => !prev)}
        >
          <ChevronDown
            className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${snapshotOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {snapshotOpen && (
      <>
      <div className="border-t border-border-default" />
      <div className="@container">
      <div className="grid grid-cols-1 gap-y-spacing-3 p-spacing-5 @[760px]:grid-cols-[minmax(240px,1fr)_1px_minmax(220px,1fr)_1px_minmax(200px,1fr)] @[760px]:grid-rows-[auto_auto_auto_auto] @[760px]:gap-x-spacing-5 @[760px]:items-baseline">
        {renderContactRow('primary', 'Primary', '@[760px]:col-start-1 @[760px]:row-start-1')}
        {renderContactRow('email', 'Email', '@[760px]:col-start-1 @[760px]:row-start-2')}

            {/* Address — empty: muted "Add address" link; populated: full address block */}
            {emptyMode || !hasAddress ? (
              <div className="flex items-center justify-between gap-spacing-3 @[760px]:min-h-[40px] @[760px]:col-start-1 @[760px]:row-start-3">
                <span className="text-sm text-text-muted flex-shrink-0">Address</span>
                <div className="min-w-0 flex-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openContactDialog('street')}
                    className="text-sm text-text-link hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Add address
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px] @[760px]:col-start-1 @[760px]:row-start-3">
                <span className="text-sm text-text-muted flex-shrink-0">Address</span>
                <div className="min-w-0 flex-1 flex flex-col items-end gap-0 text-right">
                  <span className="text-sm leading-5 text-text-default">{contactInfo.street}</span>
                  {contactInfo.addressLine2 && (
                    <span className="text-sm leading-5 text-text-default">{contactInfo.addressLine2}</span>
                  )}
                  {cityStateZip && (
                    <span className="text-sm leading-5 text-text-default">{cityStateZip}</span>
                  )}
                </div>
              </div>
            )}

        {/* Divider 1 */}
        <div className="h-px my-spacing-3 @[760px]:my-0 @[760px]:h-auto @[760px]:w-px @[760px]:self-stretch bg-border-default @[760px]:col-start-2 @[760px]:row-start-1 @[760px]:row-span-4" />

        {/* ── COLUMN 2: Highlights ── */}
        <div className="@[760px]:col-start-3 @[760px]:row-start-1 @[760px]:row-span-4 flex flex-col gap-y-spacing-3 justify-start">
        {/* Online */}
        <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">
                Online
              </span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                {emptyMode ? (
                  <span className="text-sm text-text-muted">Offline</span>
                ) : (
                <span className="inline-flex items-center gap-spacing-2 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
                  </span>
                  <span className="text-text-3 font-normal text-success-text">
                    Online Now
                  </span>
                </span>
                )}
              </div>
            </div>

            {/* Last Contacted */}
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">
                Last Contacted
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                {emptyMode ? (
                  <span className="text-sm text-text-muted">Never contacted</span>
                ) : (
                  <>
                    <span className="text-sm text-text-default truncate whitespace-nowrap" title="3 days ago">
                      3 days ago
                    </span>
                    {/* Phone icon intentionally omitted in empty mode */}
                  </>
                )}
              </div>
            </div>

            {/* Local Time */}
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm leading-5 text-text-muted flex-shrink-0">
                Local Time
              </span>
              <div className="min-w-0 flex items-center justify-end gap-spacing-2 flex-1">
                <span className="text-sm leading-5 text-text-muted truncate whitespace-nowrap">
                  {emptyMode ? '—' : localTime}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">Location</span>
              <div className="min-w-0 flex items-center justify-end flex-1">
                <span className="text-sm text-text-muted truncate whitespace-nowrap">
                  {emptyMode ? '—' : 'San Jose, CA'}
                </span>
              </div>
            </div>
        </div>

        {/* Divider 2 */}
        <div className="h-px my-spacing-3 @[760px]:my-0 @[760px]:h-auto @[760px]:w-px @[760px]:self-stretch bg-border-default @[760px]:col-start-4 @[760px]:row-start-1 @[760px]:row-span-4" />

        {/* ── COLUMN 3: About — dropdowns stay as-is in empty mode ── */}
        <div className="@[760px]:col-start-5 @[760px]:row-start-1 @[760px]:row-span-4 flex flex-col gap-y-spacing-3 justify-start">
        {/* Urgency */}
        <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">
                Urgency
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={urgency} onValueChange={handleUrgency}>
                  <SelectTrigger className="-mt-2 h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">
                Status
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={status} onValueChange={handleStatus}>
                  <SelectTrigger className="-mt-2 h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm leading-5 text-text-muted flex-shrink-0">
                Type
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={type} onValueChange={handleType}>
                  <SelectTrigger className="-mt-2 h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
            <div className="flex items-start justify-between gap-spacing-3 @[760px]:min-h-[40px]">
              <span className="text-sm text-text-muted flex-shrink-0">
                Timeframe
              </span>
              <div className="min-w-0 max-w-[160px] flex-1">
                <Select value={timeframe} onValueChange={handleTimeframe}>
                  <SelectTrigger className="-mt-2 h-9 w-full px-3 bg-white border border-[#E4E7EC] rounded-1 text-sm font-medium text-text-default hover:bg-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#3E60C9] focus:border-[#3E60C9] transition">
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
      </>
      )}
    </div>
  );
}
