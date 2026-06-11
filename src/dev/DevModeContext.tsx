import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/* ────────────────────────────────────────────────────────
   DevMode context — global state for the element inspector
   ──────────────────────────────────────────────────────── */

interface DevModeContextValue {
  active: boolean;
  setActive: (b: boolean) => void;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
  hoveredElement: HTMLElement | null;
  setHoveredElement: (el: HTMLElement | null) => void;
}

const DevModeContext = createContext<DevModeContextValue | null>(null);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  // Clear selection + hover when DevMode is turned off
  useEffect(() => {
    if (!active) {
      setSelectedElement(null);
      setHoveredElement(null);
    }
  }, [active]);

  return (
    <DevModeContext.Provider
      value={{ active, setActive, selectedElement, setSelectedElement, hoveredElement, setHoveredElement }}
    >
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) throw new Error('useDevMode must be used within DevModeProvider');
  return ctx;
}
