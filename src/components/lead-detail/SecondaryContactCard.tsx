import { useState } from 'react';
import { Pencil, Plus, ChevronUp, ChevronDown, GripVertical, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDragHandle } from './DragHandleContext';
import { ContactEditDialog, type FieldConfig } from '@/components/ContactEditDialog';
import { SectionActionButton } from './SectionActionButton';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';

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
  { key: 'addressLine2', label: 'Apt, suite, etc.', type: 'text', placeholder: 'Suite, unit, floor, etc. (optional)' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'state', label: 'State/Province', type: 'text' },
  { key: 'zip', label: 'Zip/Postal', type: 'text' },
];

/* ────────────────────────────────────────────────────────
   Sample data
   ──────────────────────────────────────────────────────── */
const INITIAL_DATA: SecondaryContact = {
  name: '',
  primary: '',
  alt: '',
  office: '',
  fax: '',
  email: '',
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
      <span className="w-28 text-sm text-text-muted flex-shrink-0">{label}</span>
      <span className="flex-1 text-sm text-text-default">{value}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   SecondaryContactCard — display-only + Edit link → dialog
   ──────────────────────────────────────────────────────── */
export function SecondaryContactCard() {
  const { emptyMode } = useVersion();
  const hasInitialContent = Object.values(INITIAL_DATA).some((v) => v.trim() !== '');
  const [contact, setContact] = useState<SecondaryContact>(INITIAL_DATA);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autoFocusField, setAutoFocusField] = useState<string | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(hasInitialContent);
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
      rows.push({ label: 'Apt, suite, etc.', value: contact.addressLine2 });
    if (contact.city)
      rows.push({ label: 'City', value: contact.city });
    if (contact.state)
      rows.push({ label: 'State', value: contact.state });
    if (contact.zip)
      rows.push({ label: 'Zip', value: contact.zip });
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

          {/* Action link: "Add" when empty (persistent), "Edit" when populated (hover-gated) */}
          {emptyMode || isEmpty ? (
            <SectionActionButton
              label="Add"
              icon={Plus}
              iconPosition="before"
              variant="link"
              onClick={() => openDialog('name')}
              className="ml-spacing-3"
            />
          ) : (
            <SectionActionButton
              label="Edit"
              icon={Pencil}
              iconPosition="before"
              variant="link"
              onClick={() => openDialog()}
              className="ml-spacing-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 rounded-1"
            />
          )}

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
            {emptyMode ? (
              <EmptyState
                icon={UserPlus}
                title="No secondary contact"
                subtitle="Add a spouse, assistant, or other contact associated with this lead."
                action={{ label: 'Add Contact', onClick: () => openDialog('name') }}
              />
            ) : isEmpty ? (
              <div className="space-y-spacing-3">
                <p className="text-sm text-text-muted">No secondary contact added yet.</p>
                <SectionActionButton
                  label="Add secondary contact"
                  icon={Plus}
                  iconPosition="before"
                  variant="link"
                  onClick={() => openDialog('name')}
                />
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
