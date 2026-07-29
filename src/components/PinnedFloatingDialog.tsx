/**
 * PROTECTED — Pinned floating dialog primitive.
 * Panel-like: NO scrim, page underneath stays interactive.
 * Anchored bottom-left of content area, respects --sidebar-width variable.
 *
 * Close via:
 *   - X button in header
 *   - Esc key
 * DO NOT add outside-click-to-close — this is a persistent panel, not a modal.
 * DO NOT add a scrim/backdrop.
 *
 * Both cards (Important Notes, Geek AI Insights) render into this primitive.
 * Any future "detail view for a card" pattern should use this component
 * rather than opening a centered modal, for consistency.
 */
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinnedFloatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  accentColor: 'orange' | 'purple';
  children: React.ReactNode;
}

const accentClasses: Record<PinnedFloatingDialogProps['accentColor'], string> = {
  orange: 'bg-orange-10 border-orange-40',
  purple: 'bg-purple-10 border-purple-40',
};

export function PinnedFloatingDialog({
  isOpen,
  onClose,
  title,
  icon,
  accentColor,
  children,
}: PinnedFloatingDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        'fixed w-[480px] rounded-3 border shadow-lg overflow-hidden flex flex-col',
        'animate-fade-in-up',
        accentClasses[accentColor],
      )}
      style={{
        left: 'calc(var(--sidebar-width, 184px) + 16px)',
        bottom: '16px',
        minHeight: '320px',
        maxHeight: '60vh',
        zIndex: 60,
      }}
    >
      {/* Header: icon + title + close */}
      <div className="flex items-center justify-between px-spacing-4 py-spacing-3 border-b border-black/5">
        <div className="flex items-center gap-spacing-2">
          {icon}
          <h2 className="text-text-4 font-semibold text-text-default">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-1 p-1 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-60"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-spacing-4 py-spacing-4 text-text-3 text-text-default leading-relaxed">
        {children}
      </div>
    </div>
  );
}
