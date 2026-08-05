import { useState } from 'react';
import { Pencil, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDragHandle } from './DragHandleContext';
import {
  useContactInfo,
  type ContactInfo,
} from '@/contexts/ContactInfoContext';
import { ContactEditDialog, type FieldConfig } from '@/components/ContactEditDialog';

const CONTACT_INFO_FIELDS: FieldConfig[] = [
  { key: 'firstName', label: 'First Name', type: 'text' },
  { key: 'lastName', label: 'Last Name', type: 'text' },
  { key: 'primary', label: 'Primary', type: 'tel', placeholder: '(415) 555-0142' },
  { key: 'alt', label: 'Alt', type: 'tel', placeholder: '(415) 555-0188' },
  { key: 'office', label: 'Office', type: 'tel' },
  { key: 'fax', label: 'Fax', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
  { key: 'street', label: 'Address', type: 'text', placeholder: 'Street address' },
  { key: 'addressLine2', label: 'Apt, suite, etc.', type: 'text', placeholder: 'Suite, unit, floor, etc. (optional)' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'state', label: 'State/Province', type: 'text' },
  { key: 'zip', label: 'Zip/Postal', type: 'text' },
];

function DisplayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center min-h-9">
      <span className="w-28 text-sm text-text-muted flex-shrink-0">{label}</span>
      <span className="flex-1 text-sm text-text-default">{value}</span>
    </div>
  );
}

export function ContactInfoSection() {
  const {
    contactInfo,
    updateContactInfo,
    openContactDialog,
    contactDialogOpen,
    contactDialogAutoFocus,
    closeContactDialog,
  } = useContactInfo();
  const [open, setOpen] = useState(true);
  const { attributes, listeners } = useDragHandle();

  const rows: { label: string; value: string }[] = [];
  if (contactInfo.firstName)
    rows.push({ label: 'First Name', value: contactInfo.firstName });
  if (contactInfo.lastName)
    rows.push({ label: 'Last Name', value: contactInfo.lastName });
  if (contactInfo.primary)
    rows.push({ label: 'Primary', value: contactInfo.primary });
  if (contactInfo.alt) rows.push({ label: 'Alt', value: contactInfo.alt });
  if (contactInfo.office)
    rows.push({ label: 'Office', value: contactInfo.office });
  if (contactInfo.fax) rows.push({ label: 'Fax', value: contactInfo.fax });
  if (contactInfo.email)
    rows.push({ label: 'Email', value: contactInfo.email });
  if (contactInfo.street) {
    rows.push({ label: 'Address', value: contactInfo.street });
    if (contactInfo.addressLine2)
      rows.push({ label: 'Apt, suite, etc.', value: contactInfo.addressLine2 });
    if (contactInfo.city)
      rows.push({ label: 'City', value: contactInfo.city });
    if (contactInfo.state)
      rows.push({ label: 'State', value: contactInfo.state });
    if (contactInfo.zip)
      rows.push({ label: 'Zip', value: contactInfo.zip });
  }

  const isEmpty = rows.length === 0;

  const handleSave = (values: Record<string, string>) => {
    updateContactInfo({
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      primary: values.primary ?? '',
      alt: values.alt ?? '',
      office: values.office ?? '',
      fax: values.fax ?? '',
      email: values.email ?? '',
      street: values.street ?? '',
      addressLine2: values.addressLine2 ?? '',
      city: values.city ?? '',
      state: values.state ?? '',
      zip: values.zip ?? '',
    } as Partial<ContactInfo>);
  };

  const initialValues: Record<string, string> = {
    firstName: contactInfo.firstName,
    lastName: contactInfo.lastName,
    primary: contactInfo.primary,
    alt: contactInfo.alt,
    office: contactInfo.office,
    fax: contactInfo.fax,
    email: contactInfo.email,
    street: contactInfo.street,
    addressLine2: contactInfo.addressLine2,
    city: contactInfo.city,
    state: contactInfo.state,
    zip: contactInfo.zip,
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-component="ContactInfoCard"
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
              Contact Info
            </h3>
          </button>

          {/* Edit link */}
          <button
            type="button"
            onClick={() => openContactDialog()}
            className="ml-spacing-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 inline-flex items-center gap-spacing-1 text-text-3 font-normal text-blue-100 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-60 focus-visible:ring-offset-2 rounded-1 cursor-pointer bg-transparent border-none p-0"
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
                No contact information yet.{' '}
                <button
                  type="button"
                  onClick={() => openContactDialog()}
                  className="text-blue-100 underline hover:no-underline cursor-pointer bg-transparent border-none p-0"
                >
                  Add one
                </button>
                .
              </div>
            ) : (
              rows.map((row, i) => (
                <DisplayRow key={`${row.label || 'row'}-${i}`} label={row.label} value={row.value} />
              ))
            )}
          </div>
        )}
      </div>

      <ContactEditDialog
        isOpen={contactDialogOpen}
        onClose={closeContactDialog}
        onSave={handleSave}
        title="Contact Info"
        initialValues={initialValues}
        fields={CONTACT_INFO_FIELDS}
        autoFocusField={contactDialogAutoFocus}
      />
    </TooltipProvider>
  );
}
