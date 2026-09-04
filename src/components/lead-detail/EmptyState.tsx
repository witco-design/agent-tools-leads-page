import type { ComponentType } from 'react';
import { Plus } from 'lucide-react';

type IconType = ComponentType<{ className?: string }>;

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  action?: EmptyStateAction;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-spacing-2 py-spacing-3 px-spacing-4">
      <div className="w-9 h-9 rounded-round bg-bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-text-3 font-semibold text-text-default">{title}</p>
      {subtitle && (
        <p className="text-text-2 text-text-muted max-w-[260px]">{subtitle}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 text-text-3 font-semibold text-text-link hover:underline cursor-pointer mt-spacing-1"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {action.label}
        </button>
      )}
    </div>
  );
}
