import { useState } from 'react';
import { Pencil, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDragHandle } from './DragHandleContext';
import { ContactFieldRow } from '@/components/contact/ContactFieldRow';
import {
  useContactInfo,
  type ContactInfo,
  type FieldStatus,
} from '@/contexts/ContactInfoContext';

/* ────────────────────────────────────────────────────────
   DefaultMode — shows non-blank fields with action menus
   ──────────────────────────────────────────────────────── */
function DefaultMode({ onStartEdit }: { onStartEdit: () => void }) {
  const { contactInfo, updateContactInfo } = useContactInfo();

  const markStatus = (field: string, status: FieldStatus) => {
    const statusField = `${field}Status` as keyof ContactInfo;
    updateContactInfo({ [statusField]: status } as Partial<ContactInfo>);
  };

  const deleteField = (field: string) => {
    updateContactInfo({ [field]: '' } as Partial<ContactInfo>);
  };

  // Check if ALL fields are empty → show empty state
  const hasAnyField =
    !!contactInfo.primary || !!contactInfo.alt || !!contactInfo.office ||
    !!contactInfo.fax || !!contactInfo.email || !!contactInfo.street;

  if (!hasAnyField) {
    return (
      <div className="py-spacing-4 text-center">
        <p className="text-sm text-text-muted mb-spacing-2">No contact information yet.</p>
        <button
          type="button"
          onClick={onStartEdit}
          className="text-sm font-semibold text-text-link hover:underline cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-60 focus-visible:ring-offset-2 rounded-1"
        >
          Add contact details
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-spacing-3">
      {contactInfo.primary && (
        <ContactFieldRow
          type="phone"
          label="Primary"
          value={contactInfo.primary}
          status={contactInfo.primaryStatus}
          onMarkBad={() => markStatus('primary', 'bad')}
          onMarkGood={() => markStatus('primary', 'good')}
          onDelete={() => deleteField('primary')}
        />
      )}
      {contactInfo.alt && (
        <ContactFieldRow
          type="phone"
          label="Alt"
          value={contactInfo.alt}
          status={contactInfo.altStatus}
          onMarkBad={() => markStatus('alt', 'bad')}
          onMarkGood={() => markStatus('alt', 'good')}
          onDelete={() => deleteField('alt')}
        />
      )}
      {contactInfo.office && (
        <ContactFieldRow
          type="phone"
          label="Office"
          value={contactInfo.office}
          status={contactInfo.officeStatus}
          onMarkBad={() => markStatus('office', 'bad')}
          onMarkGood={() => markStatus('office', 'good')}
          onDelete={() => deleteField('office')}
        />
      )}
      {contactInfo.fax && (
        <ContactFieldRow
          type="phone"
          label="Fax"
          value={contactInfo.fax}
          status={contactInfo.faxStatus}
          onMarkBad={() => markStatus('fax', 'bad')}
          onMarkGood={() => markStatus('fax', 'good')}
          onDelete={() => deleteField('fax')}
        />
      )}
      {contactInfo.email && (
        <ContactFieldRow
          type="email"
          label="Email"
          value={contactInfo.email}
          status={contactInfo.emailStatus}
          onMarkBad={() => markStatus('email', 'bad')}
          onMarkGood={() => markStatus('email', 'good')}
          /* no onDelete — email is not deletable, only markable */
        />
      )}
      {contactInfo.street && (
        <ContactFieldRow
          type="address"
          label="Address"
          value={contactInfo.street}
          status="good"
          onDelete={() =>
            updateContactInfo({ street: '', city: '', state: '', zip: '' })
          }
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   EditMode — all fields as inputs (including blanks)
   ──────────────────────────────────────────────────────── */
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-spacing-3 min-h-9">
      <span className="text-sm text-[#667085] flex-shrink-0 w-[100px]">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function EditMode({
  form,
  onChange,
}: {
  form: ContactInfo;
  onChange: (next: ContactInfo) => void;
}) {
  const handleField = (field: keyof ContactInfo, value: string) => {
    onChange({ ...form, [field]: value });
  };

  const inputClass =
    'h-9 w-full px-spacing-3 border border-[#E4E7EC] rounded-1 text-sm text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-[#3e60c9] focus:ring-1 focus:ring-[#3e60c9]';

  return (
    <div className="space-y-spacing-3">
      <FieldRow label="First Name">
        <input
          type="text"
          value={form.firstName}
          onChange={(e) => handleField('firstName', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Last Name">
        <input
          type="text"
          value={form.lastName}
          onChange={(e) => handleField('lastName', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Primary">
        <input
          type="tel"
          value={form.primary}
          onChange={(e) => handleField('primary', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Alt">
        <input
          type="tel"
          value={form.alt}
          onChange={(e) => handleField('alt', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Office">
        <input
          type="tel"
          value={form.office}
          onChange={(e) => handleField('office', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Fax">
        <input
          type="tel"
          value={form.fax}
          onChange={(e) => handleField('fax', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleField('email', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Address">
        <input
          type="text"
          value={form.street}
          onChange={(e) => handleField('street', e.target.value)}
          placeholder="Street address"
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="City">
        <input
          type="text"
          value={form.city}
          onChange={(e) => handleField('city', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="State/Province">
        <input
          type="text"
          value={form.state}
          onChange={(e) => handleField('state', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Zip/Postal">
        <input
          type="text"
          value={form.zip}
          onChange={(e) => handleField('zip', e.target.value)}
          className={inputClass}
        />
      </FieldRow>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   ContactInfoSection — right column card with edit mode
   ──────────────────────────────────────────────────────── */
export function ContactInfoSection() {
  const { contactInfo, updateContactInfo } = useContactInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ContactInfo>(contactInfo);
  const [open, setOpen] = useState(true);
  const { attributes, listeners } = useDragHandle();

  const handleStartEdit = () => {
    setEditForm(contactInfo);
    setIsEditing(true);
  };

  const handleDone = () => {
    updateContactInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-component="ContactInfoCard"
        className="bg-bg-card rounded-3 border border-border-default shadow-sm overflow-hidden group"
      >
        {/* Header */}
        <div
          className={`w-full flex items-center px-spacing-5 py-spacing-3 hover:bg-bg-muted/50 transition-colors ${open ? 'border-b border-border-default' : ''}`}
        >
          {/* Drag handle — slides in on hover */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="inline-flex items-center justify-center w-0 mr-0 opacity-0 overflow-hidden cursor-grab
                           group-hover:w-4 group-hover:mr-spacing-2 group-hover:opacity-100
                           transition-all duration-200 ease-out shrink-0"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-4 h-4 text-gray-70 shrink-0" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>

          <button
            type="button"
            className="flex items-center cursor-pointer bg-transparent border-none p-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            <h3 className="text-text-4 font-semibold text-text-default">
              Contact Info
            </h3>
          </button>

          {/* Edit / Cancel+Done controls */}
          <div className="ml-spacing-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            {isEditing ? (
              <div className="flex items-center gap-spacing-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-[#667085] hover:text-[#101828] transition cursor-pointer bg-transparent border-none p-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDone}
                  className="h-7 px-spacing-3 inline-flex items-center bg-[#3e60c9] hover:bg-[#3840a9] text-white rounded-1 text-sm font-semibold transition cursor-pointer border-none"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-spacing-1 text-text-4 font-semibold text-text-link hover:text-text-link-hover transition cursor-pointer bg-transparent border-none p-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          <div className="flex-1" />

          <button
            type="button"
            data-collapse-toggle
            className="cursor-pointer bg-transparent border-none p-0"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? (
              <ChevronUp className="w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200" />
            )}
          </button>
        </div>

        {/* Body */}
        {open && (
          <div className="px-spacing-5 py-spacing-4">
            {isEditing ? (
              <EditMode form={editForm} onChange={setEditForm} />
            ) : (
              <DefaultMode onStartEdit={handleStartEdit} />
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
