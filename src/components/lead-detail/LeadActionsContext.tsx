import { createContext, useContext, useRef, type ReactNode } from 'react';

interface LeadActionsContextType {
  registerOpenAction: (fn: (action: string) => void) => void;
  openAction: (action: string) => void;
}

const LeadActionsContext = createContext<LeadActionsContextType>({
  registerOpenAction: () => {},
  openAction: () => {},
});

export function LeadActionsProvider({ children }: { children: ReactNode }) {
  const openActionRef = useRef<(action: string) => void>(() => {});

  const registerOpenAction = (fn: (action: string) => void) => {
    openActionRef.current = fn;
  };

  const openAction = (action: string) => openActionRef.current(action);

  return (
    <LeadActionsContext.Provider value={{ registerOpenAction, openAction }}>
      {children}
    </LeadActionsContext.Provider>
  );
}

export function useLeadActions() {
  return useContext(LeadActionsContext);
}
