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
import { ContactEditDialog, type FieldConfig } from '@/components/ContactEditDialog';

/* ────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────── */
interface SecondaryContact {
  name: string;
  primary: string;
  alt: string;
  office: string;
  fax: string;
  email: string;
  altEmail: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

/* ────────────────────────────────────────────────────────
   Field config — keys match SecondaryContact
   ──────────────────────────────────────────────────────── */
const SECONDARY_CONTACT_FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'primary', label: 'Primary', type: 'tel' },
  { key: 'alt', label: 'Alt', type: 'tel' },
  { key: 'office', label: 'Office', type: 'tel' },
  { key: 'fax', label: 'Fax', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'altEmail', label: 'Alt Email', type: 'email' },
  { key: 'address', label: 'Address', type: 'text', placeholder: 'Street address' },
  { key: 'addressLine2', label: 'Address 2', type: 'text', placeholder: 'Suite, unit, floor, etc. (optional)' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'state', label: 'State/Province', type: 'text' },
  { key: 'zip', label: 'Zip/Postal', type: 'text' },
];

/* ────────────────────────────────────────────────────────
   Sample data
   ──────────────────────────────────────────────────────── */
const INITIAL_DATA: SecondaryContact = {
  name: 'Tom Dubois',
  primary: '(214) 555-8832',
  alt: '',
  office: '',
  fax: '',
  email: 'tom.dubois@email.com',
  altEmail: '',
  address: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
};

/* ────────────────────────────────────────────────────────
   DisplayRow — label-left / value-right
   ──────────────────────────────────────────────────────── */
function DisplayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center min-h-9">
      <span className="w-24 text-sm text-text-muted flex-shrink-0">{label}</span>
      <span className="flex-1 text-sm text-text-default">{value}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   SecondaryContactCard — display-only + Edit link → dialog
   ──────────────────────────────────────────────────────── */
export function SecondaryContactCard() {
  const [contact, setContact] = useState<SecondaryContact>(INITIAL_DATA);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autoFocusField, setAutoFocusField] = useState<string | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(true);
  const { attributes, listeners } = useDragHandle();

  const handleSave = (values: Record<string, string>) => {
    setContact((prev) => ({
      ...prev,
      name: values.name ?? '',
      primary: values.primary ?? '',
      alt: values.alt ?? '',
      office: values.office ?? '',
      fax: values.fax ?? '',
      email: values.email ?? '',
      altEmail: values.altEmail ?? '',
      address: values.address ?? '',
      addressLine2: values.addressLine2 ?? '',
      city: values.city ?? '',
      state: values.state ?? '',
      zip: values.zip ?? '',
    }));
    toast.success('Secondary contact updated');
  };

  const openDialog = (field?: string) => {
    setAutoFocusField(field);
    setDialogOpen(true);
  };

  // Build display rows — only populated fields
  const rows: { label: string; value: string }[] = [];
  if (contact.name) rows.push({ label: 'Name', value: contact.name });
  if (contact.primary)
    rows.push({ label: 'Primary', value: contact.primary });
  if (contact.alt) rows.push({ label: 'Alt', value: contact.alt });
  if (contact.office)
    rows.push({ label: 'Office', value: contact.office });
  if (contact.fax) rows.push({ label: 'Fax', value: contact.fax });
  if (contact.email) rows.push({ label: 'Email', value: contact.email });
  if (contact.altEmail)
    rows.push({ label: 'Alt Email', value: contact.altEmail });
  if (contact.address) {
    rows.push({ label: 'Address', value: contact.address });
    if (contact.addressLine2)
      rows.push({ label: 'Address 2', value: contact.addressLine2 });
    const line2 = [contact.city, contact.state, contact.zip]
      .filter(Boolean)
      .join(', ');
    if (line2) rows.push({ label: '', value: line2 });
  }

  const isEmpty = rows.length === 0;

  const initialValues: Record<string, string> = {
    name: contact.name,
    primary: contact.primary,
    alt: contact.alt,
    office: contact.office,
    fax: contact.fax,
    email: contact.email,
    altEmail: contact.altEmail,
    address: contact.address,
    addressLine2: contact.addressLine2,
    city: contact.city,
    state: contact.state,
    zip: contact.zip,
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-component="SecondaryContactCard"
        className="bg-bg-card rounded-3 border border-border-default overflow-hidden group"
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

          {/* Edit link */}
          <button
            type="button"
            onClick={() => openDialog()}
            className="ml-spacing-3 inline-flex items-center gap-spacing-1 text-text-3 font-normal text-blue-100 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 rounded-1 cursor-pointer bg-transparent border-none p-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

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
        {/**
         * PROTECTED — Right-column contact cards render in display-only mode.
         * Empty fields are hidden (established pattern from task #160).
         * Editing happens via the Edit link in the card header, which opens
         * ContactEditDialog with all fields (populated + empty as placeholders).
         *
         * Do NOT reintroduce inline input fields or a "Done" button.
         * The dialog is the single edit affordance for these cards.
         */}
        {open && (
          <div className="px-spacing-5 py-spacing-4 space-y-spacing-2">
            {isEmpty ? (
              <div className="text-sm text-text-muted italic">
                No secondary contact yet.{' '}
                <button
                  type="button"
                  onClick={() => openDialog('name')}
                  className="text-blue-100 underline hover:no-underline cursor-pointer bg-transparent border-none p-0"
                >
                  Add one
                </button>
                .
              </div>
            ) : (
              rows.map((row, i) => (
                <DisplayRow
                  key={`${row.label || 'row'}-${i}`}
                  label={row.label}
                  value={row.value}
                />
              ))
            )}
          </div>
        )}
      </div>

      <ContactEditDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        title="Secondary Contact"
        initialValues={initialValues}
        fields={SECONDARY_CONTACT_FIELDS}
        autoFocusField={autoFocusField}
      />
    </TooltipProvider>
  );
}
