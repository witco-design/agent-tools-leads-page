import { useEffect, useState, useCallback } from 'react';
import { useDevMode } from './DevModeContext';

/* ────────────────────────────────────────────────────────
   Hover overlay — blue outline + floating label
   ──────────────────────────────────────────────────────── */

function HoverOverlay() {
  const { active, hoveredElement, selectedElement } = useDevMode();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!active || !hoveredElement || hoveredElement === selectedElement) {
      setRect(null);
      return;
    }
    setRect(hoveredElement.getBoundingClientRect());
  }, [active, hoveredElement, selectedElement]);

  if (!rect) return null;

  const componentName =
    hoveredElement?.getAttribute('data-component') || hoveredElement?.tagName.toLowerCase() || '';

  return (
    <>
      {/* Outline */}
      <div
        className="fixed pointer-events-none z-[100] border-2 border-[#3e60c9]/60 bg-[#3e60c9]/[0.08]"
        style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
      />
      {/* Label */}
      <div
        className="fixed pointer-events-none z-[101] px-2 py-1 bg-[#3e60c9] text-white text-[10px] font-mono rounded shadow-md whitespace-nowrap"
        style={{ top: Math.max(0, rect.top - 24), left: rect.left }}
      >
        {componentName} · {Math.round(rect.width)}×{Math.round(rect.height)}
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────
   Selected element outline — persistent purple
   ──────────────────────────────────────────────────────── */

function SelectedOutline() {
  const { active, selectedElement } = useDevMode();
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Update rect on selection change and on scroll/resize
  const updateRect = useCallback(() => {
    if (!active || !selectedElement) {
      setRect(null);
      return;
    }
    setRect(selectedElement.getBoundingClientRect());
  }, [active, selectedElement]);

  useEffect(() => {
    updateRect();
    if (!active || !selectedElement) return;

    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [active, selectedElement, updateRect]);

  if (!rect) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99] border-2 border-[#6a65d8] bg-[#6a65d8]/[0.06]"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    />
  );
}

/* ────────────────────────────────────────────────────────
   Event listeners hook — hover, click, keyboard
   ──────────────────────────────────────────────────────── */

export function useDevModeListeners() {
  const { active, setActive, setHoveredElement, setSelectedElement, selectedElement } = useDevMode();

  // Hover listener — mousemove
  useEffect(() => {
    if (!active) return;

    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't track inside the inspector panel or toggle button
      if (target?.closest('[data-devmode-panel]') || target?.closest('[data-devmode-toggle]')) {
        setHoveredElement(null);
        return;
      }
      setHoveredElement(target);
    };

    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, [active, setHoveredElement]);

  // Click listener — capture phase to prevent normal handlers
  useEffect(() => {
    if (!active) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept clicks inside the panel or toggle
      if (target?.closest('[data-devmode-panel]') || target?.closest('[data-devmode-toggle]')) return;

      e.preventDefault();
      e.stopPropagation();
      setSelectedElement(target);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [active, setSelectedElement]);

  // Keyboard — Esc
  useEffect(() => {
    if (!active) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedElement) {
          // Clear selection first
          setSelectedElement(null);
          setHoveredElement(null);
        } else {
          // No selection → exit DevMode entirely
          setActive(false);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, selectedElement, setActive, setSelectedElement, setHoveredElement]);
}

/* ────────────────────────────────────────────────────────
   Combined overlay component
   ──────────────────────────────────────────────────────── */

export function DevModeOverlay() {
  const { active } = useDevMode();
  useDevModeListeners();

  if (!active) return null;

  return (
    <>
      <HoverOverlay />
      <SelectedOutline />
    </>
  );
}
