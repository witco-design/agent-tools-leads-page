import { createContext, useContext, useState, type ReactNode } from 'react';

export type Version = 'V1' | 'V2';

interface VersionContextValue {
  version: Version;
  setVersion: (v: Version) => void;
}

const VersionContext = createContext<VersionContextValue | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>('V1');
  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion(): VersionContextValue {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error('useVersion must be used within VersionProvider');
  return ctx;
}
