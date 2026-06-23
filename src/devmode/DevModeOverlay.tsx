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

import { useEffect, useState, useCallback } from 'react';
import { useDevMode } from './DevModeContext';

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
      <div
        className="fixed pointer-events-none z-[100] border-2 border-[#3e60c9]/60 bg-[#3e60c9]/[0.08]"
        style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
      />
      <div
        className="fixed pointer-events-none z-[101] px-2 py-1 bg-[#3e60c9] text-white text-[10px] font-mono rounded shadow-md whitespace-nowrap"
        style={{ top: Math.max(0, rect.top - 24), left: rect.left }}
      >
        {componentName} · {Math.round(rect.width)}×{Math.round(rect.height)}
      </div>
    </>
  );
}

function SelectedOutline() {
  const { active, selectedElement } = useDevMode();
  const [rect, setRect] = useState<DOMRect | null>(null);

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

export function useDevModeListeners() {
  const { active, setActive, setHoveredElement, setSelectedElement, selectedElement } = useDevMode();

  useEffect(() => {
    if (!active) return;
    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-devmode-panel]') || target?.closest('[data-devmode-toggle]')) {
        setHoveredElement(null);
        return;
      }
      setHoveredElement(target);
    };
    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, [active, setHoveredElement]);

  useEffect(() => {
    if (!active) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-devmode-panel]') || target?.closest('[data-devmode-toggle]')) return;
      e.preventDefault();
      e.stopPropagation();
      setSelectedElement(target);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [active, setSelectedElement]);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedElement) {
          setSelectedElement(null);
          setHoveredElement(null);
        } else {
          setActive(false);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, selectedElement, setActive, setSelectedElement, setHoveredElement]);
}

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
