import { Phone, Mail, MapPin, Pencil } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';
import { TooltipProvider } from '@/components/ui/tooltip';

const CONTACT_ROWS = [
  {
    id: 'primary-phone',
    icon: Phone,
    value: '(415) 555-0142',
    href: 'tel:+14155550142',
    label: 'Primary',
    actionable: true,
  },
  {
    id: 'alt-phone',
    icon: Phone,
    value: '(415) 555-0188',
    href: 'tel:+14155550188',
    label: 'Alt',
    actionable: true,
  },
  {
    id: 'email',
    icon: Mail,
    value: 'cdubois@realgeeks.com',
    href: 'mailto:cdubois@realgeeks.com',
    label: 'Email',
    actionable: true,
  },
  {
    id: 'address',
    icon: MapPin,
    value: 'Mountain View, CA 94041',
    href: undefined,
    label: 'Address',
    actionable: false,
  },
] as const;

export function ContactInfoSection() {
  const editButton = (
    <button
      type="button"
      className="inline-flex items-center gap-spacing-1 text-text-4 font-medium text-text-link hover:text-text-link-hover transition cursor-pointer bg-transparent border-none p-0"
      onClick={() => {
        /* placeholder for edit mode */
      }}
    >
      <Pencil className="w-3.5 h-3.5" />
      Edit
    </button>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <CollapsibleCard
        id="contact-info"
        title="Contact Info"
        showInfoIcon
        rightAction={editButton}
      >
        <div className="divide-y divide-border-default -my-spacing-1">
          {CONTACT_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.id}
                className="flex items-center justify-between py-spacing-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-spacing-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      row.actionable ? 'text-text-link' : 'text-text-muted'
                    }`}
                  />
                  {row.actionable && row.href ? (
                    <a
                      href={row.href}
                      className="text-text-4 font-medium text-text-link hover:text-text-link-hover transition truncate"
                      title={row.value}
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span
                      className="text-text-4 text-text-default truncate"
                      title={row.value}
                    >
                      {row.value}
                    </span>
                  )}
                </div>
                <span className="text-text-4 text-text-muted shrink-0 ml-spacing-3">
                  {row.label}
                </span>
              </div>
            );
          })}
        </div>
      </CollapsibleCard>
    </TooltipProvider>
  );
}
