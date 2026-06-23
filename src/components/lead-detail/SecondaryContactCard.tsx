import { useState } from 'react';
import { Pencil, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDragHandle } from './DragHandleContext';
import { ContactFieldRow } from '@/components/contact/ContactFieldRow';

/* ────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────── */
type FieldStatus = 'good' | 'bad';

interface SecondaryContact {
  name: string;
  primary: string;
  primaryStatus: FieldStatus;
  alt: string;
  altStatus: FieldStatus;
  office: string;
  officeStatus: FieldStatus;
  fax: string;
  faxStatus: FieldStatus;
  email: string;
  emailStatus: FieldStatus;
  altEmail: string;
  altEmailStatus: FieldStatus;
  address: string;
  city: string;
  state: string;
  zip: string;
}

/* ────────────────────────────────────────────────────────
   Field config
   ──────────────────────────────────────────────────────── */
interface FieldConfig {
  key: keyof SecondaryContact;
  label: string;
  type: 'phone' | 'email' | 'address' | 'text';
  inputType: string;
  inputMode?: 'tel' | 'email' | 'text';
  placeholder?: string;
}

const FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', inputType: 'text' },
  { key: 'primary', label: 'Primary', type: 'phone', inputType: 'tel', inputMode: 'tel' },
  { key: 'alt', label: 'Alt', type: 'phone', inputType: 'tel', inputMode: 'tel' },
  { key: 'office', label: 'Office', type: 'phone', inputType: 'tel', inputMode: 'tel' },
  { key: 'fax', label: 'Fax', type: 'phone', inputType: 'tel', inputMode: 'tel' },
  { key: 'email', label: 'Email', type: 'email', inputType: 'email', inputMode: 'email' },
  { key: 'altEmail', label: 'Alt Email', type: 'email', inputType: 'email', inputMode: 'email' },
  { key: 'address', label: 'Address', type: 'address', inputType: 'text', placeholder: 'Street address' },
  { key: 'city', label: 'City', type: 'text', inputType: 'text' },
  { key: 'state', label: 'State/Province', type: 'text', inputType: 'text' },
  { key: 'zip', label: 'Zip/Postal', type: 'text', inputType: 'text' },
];

/* ────────────────────────────────────────────────────────
   Sample data
   ──────────────────────────────────────────────────────── */
const INITIAL_DATA: SecondaryContact = {
  name: 'Tom Dubois',
  primary: '(214) 555-8832',
  primaryStatus: 'good',
  alt: '',
  altStatus: 'good',
  office: '',
  officeStatus: 'good',
  fax: '',
  faxStatus: 'good',
  email: 'tom.dubois@email.com',
  emailStatus: 'good',
  altEmail: '',
  altEmailStatus: 'good',
  address: '',
  city: '',
  state: '',
  zip: '',
};

/* ────────────────────────────────────────────────────────
   FieldRow — edit-mode label+input row
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

/* ────────────────────────────────────────────────────────
   DefaultMode — shows non-blank fields with action menus
   ──────────────────────────────────────────────────────── */
function DefaultMode({
  contact,
  onChange,
  onStartEdit,
}: {
  contact: SecondaryContact;
  onChange: (next: SecondaryContact) => void;
  onStartEdit: () => void;
}) {
  const statusKey = (field: string) => `${field}Status` as keyof SecondaryContact;

  const markStatus = (field: string, status: FieldStatus) => {
    onChange({ ...contact, [statusKey(field)]: status });
  };

  const deleteField = (field: string) => {
    onChange({ ...contact, [field]: '' });
  };

  // Name row — shown as plain text if filled
  const hasName = contact.name.trim() !== '';

  // Phone / email field rows
  const phoneFields: { key: keyof SecondaryContact; label: string }[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'alt', label: 'Alt' },
    { key: 'office', label: 'Office' },
    { key: 'fax', label: 'Fax' },
  ];

  const emailFields: { key: keyof SecondaryContact; label: string }[] = [
    { key: 'email', label: 'Email' },
    { key: 'altEmail', label: 'Alt Email' },
  ];

  // Address is composite
  const hasAddress = contact.address.trim() !== '';

  // Check if ALL fields are empty → show empty state
  const hasAnyField =
    hasName ||
    phoneFields.some((pf) => (contact[pf.key] as string).trim() !== '') ||
    emailFields.some((ef) => (contact[ef.key] as string).trim() !== '') ||
    hasAddress;

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
      {/* Name */}
      {hasName && (
        <div className="flex items-center justify-between gap-spacing-3 min-h-9">
          <span className="text-sm text-[#667085] flex-shrink-0">Name</span>
          <span className="text-sm font-medium text-[#101828]">{contact.name}</span>
        </div>
      )}

      {/* Phone fields */}
      {phoneFields.map((pf) => {
        const val = contact[pf.key] as string;
        if (!val.trim()) return null;
        const status = contact[statusKey(pf.key)] as FieldStatus;
        return (
          <ContactFieldRow
            key={pf.key}
            type="phone"
            label={pf.label}
            value={val}
            status={status}
            onMarkBad={() => markStatus(pf.key, 'bad')}
            onMarkGood={() => markStatus(pf.key, 'good')}
            onDelete={() => deleteField(pf.key)}
          />
        );
      })}

      {/* Email fields */}
      {emailFields.map((ef) => {
        const val = contact[ef.key] as string;
        if (!val.trim()) return null;
        const status = contact[statusKey(ef.key)] as FieldStatus;
        return (
          <ContactFieldRow
            key={ef.key}
            type="email"
            label={ef.label}
            value={val}
            status={status}
            onMarkBad={() => markStatus(ef.key, 'bad')}
            onMarkGood={() => markStatus(ef.key, 'good')}
            onDelete={() => deleteField(ef.key)}
          />
        );
      })}

      {/* Address */}
      {hasAddress && (
        <ContactFieldRow
          type="address"
          label="Address"
          value={[contact.address, contact.city, contact.state, contact.zip].filter(Boolean).join(', ')}
          status="good"
          onDelete={() => onChange({ ...contact, address: '', city: '', state: '', zip: '' })}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   EditMode — all 11 fields as inputs
   ──────────────────────────────────────────────────────── */
function EditMode({
  form,
  onChange,
}: {
  form: SecondaryContact;
  onChange: (next: SecondaryContact) => void;
}) {
  const handleField = (field: keyof SecondaryContact, value: string) => {
    onChange({ ...form, [field]: value });
  };

  const inputClass =
    'h-9 w-full px-spacing-3 border border-[#E4E7EC] rounded-1 text-sm text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-[#3e60c9] focus:ring-1 focus:ring-[#3e60c9]';

  return (
    <div className="space-y-spacing-3">
      {FIELDS.map((field) => (
        <FieldRow key={field.key} label={field.label}>
          <input
            type={field.inputType}
            inputMode={field.inputMode}
            value={form[field.key] as string}
            onChange={(e) => handleField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        </FieldRow>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   SecondaryContactCard — mirrors ContactInfoSection chrome
   ──────────────────────────────────────────────────────── */
export function SecondaryContactCard() {
  const [contact, setContact] = useState<SecondaryContact>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<SecondaryContact>(INITIAL_DATA);
  const [open, setOpen] = useState(true);
  const { attributes, listeners } = useDragHandle();

  const handleStartEdit = () => {
    setEditForm(contact);
    setIsEditing(true);
  };

  const handleDone = () => {
    setContact(editForm);
    setIsEditing(false);
    toast.success('Secondary contact updated');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-component="SecondaryContactCard"
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
              Secondary Contact
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
              <ChevronUp className="w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Body */}
        {open && (
          <div className="px-spacing-5 py-spacing-4">
            {isEditing ? (
              <EditMode form={editForm} onChange={setEditForm} />
            ) : (
              <DefaultMode
                contact={contact}
                onChange={setContact}
                onStartEdit={handleStartEdit}
              />
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
