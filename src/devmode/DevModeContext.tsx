/**
 * PROTECTED — DevMode tooling.
 *
 * This file is part of the DevMode engineer-handoff system. Do not modify,
 * refactor, or delete without explicit user permission. Bolt / AI agents
 * should treat this folder as off-limits unless the user specifically
 * requests changes to DevMode.
 *
 * Removing or breaking DevMode files affects the design-system handoff to
 * the engineering team. If you think you need to change something here,
 * stop and ask the user first.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
