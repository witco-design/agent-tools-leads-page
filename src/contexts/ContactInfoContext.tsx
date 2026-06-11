import { createContext, useContext, useState, ReactNode } from 'react';

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

  const updateContactInfo = (updates: Partial<ContactInfo>) => {
    setContactInfo((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ContactInfoContext.Provider value={{ contactInfo, updateContactInfo }}>
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
