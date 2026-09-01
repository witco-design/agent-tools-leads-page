import type { ComponentType } from 'react';

type IconType = ComponentType<{ className?: string }>;

interface SectionActionButtonProps {
  label: string;
  icon?: IconType;
  iconPosition?: 'before' | 'after';
  variant?: 'link' | 'destructive';
  onClick?: () => void;
  className?: string;
}

const BASE_CLASS =
  'inline-flex items-center gap-1.5 text-text-3 font-semibold hover:underline cursor-pointer bg-transparent border-none p-0';

const VARIANT_CLASS: Record<NonNullable<SectionActionButtonProps['variant']>, string> = {
  link: 'text-text-link',
  destructive: 'text-error-text',
};

export function SectionActionButton({
  label,
  icon: Icon,
  iconPosition = 'before',
  variant = 'link',
  onClick,
  className = '',
}: SectionActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`}
    >
      {Icon && iconPosition === 'before' && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
      {Icon && iconPosition === 'after' && <Icon className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
