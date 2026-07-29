import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

export type FieldStatus = 'good' | 'bad';

export interface ContactInfo {
  firstName: string;
  lastName: string;
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
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface ContactInfoContextValue {
  contactInfo: ContactInfo;
  updateContactInfo: (updates: Partial<ContactInfo>) => void;
  /** Opens the Contact Edit dialog, optionally focusing a field key. */
  openContactDialog: (autoFocusField?: string) => void;
  /** Closes the Contact Edit dialog. */
  closeContactDialog: () => void;
  /** Whether the Contact Edit dialog is open. */
  contactDialogOpen: boolean;
  /** Which field key to auto-focus when the dialog opens. */
  contactDialogAutoFocus: string | undefined;
}

const ContactInfoContext = createContext<ContactInfoContextValue | null>(null);

export function ContactInfoProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial: ContactInfo;
}) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initial);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactDialogAutoFocus, setContactDialogAutoFocus] = useState<
    string | undefined
  >(undefined);

  const updateContactInfo = (updates: Partial<ContactInfo>) => {
    setContactInfo((prev) => ({ ...prev, ...updates }));
  };

  const openContactDialog = useCallback((autoFocusField?: string) => {
    setContactDialogAutoFocus(autoFocusField);
    setContactDialogOpen(true);
  }, []);

  const closeContactDialog = useCallback(() => {
    setContactDialogOpen(false);
  }, []);

  return (
    <ContactInfoContext.Provider
      value={{
        contactInfo,
        updateContactInfo,
        openContactDialog,
        closeContactDialog,
        contactDialogOpen,
        contactDialogAutoFocus,
      }}
    >
      {children}
    </ContactInfoContext.Provider>
  );
}

export function useContactInfo() {
  const ctx = useContext(ContactInfoContext);
  if (!ctx)
    throw new Error('useContactInfo must be used within ContactInfoProvider');
  return ctx;
}
