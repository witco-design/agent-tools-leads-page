import type { ComponentType, ReactNode } from 'react';
import { SectionActionButton } from './SectionActionButton';

type IconType = ComponentType<{ className?: string }>;

interface EmptyStateProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaIcon?: IconType;
  onCtaClick?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  ctaLabel,
  ctaIcon,
  onCtaClick,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-spacing-6 px-spacing-4 gap-spacing-2">
      <div className="flex items-center justify-center w-9 h-9 rounded-round bg-blue-10 mb-spacing-1">
        <Icon className="w-4 h-4 text-blue-100" />
      </div>
      <p className="text-text-3 font-semibold text-text-default">{title}</p>
      {subtitle && (
        <p className="text-text-3 font-normal text-text-muted leading-snug max-w-[260px]">
          {subtitle}
        </p>
      )}
      {children}
      {ctaLabel && (
        <SectionActionButton
          label={ctaLabel}
          icon={ctaIcon}
          iconPosition={ctaIcon ? 'before' : undefined}
          variant="link"
          onClick={onCtaClick}
        />
      )}
    </div>
  );
}
