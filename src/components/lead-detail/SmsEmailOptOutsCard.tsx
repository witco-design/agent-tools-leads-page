import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';

interface OptOutState {
  allContact: boolean;
  crmEmail: boolean;
  eblastsWorkflow: boolean;
  allTextMessages: boolean;
  reactiveResponses: boolean;
}

export function SmsEmailOptOutsCard() {
  const { emptyMode } = useVersion();
  const [optOuts, setOptOuts] = useState<OptOutState>({
    allContact: true,
    crmEmail: true,
    eblastsWorkflow: true,
    allTextMessages: true,
    reactiveResponses: true,
  });

  // When "All Text Messages" is OFF, "Reactive Responses" auto-toggles OFF and becomes disabled
  useEffect(() => {
    if (!optOuts.allTextMessages && optOuts.reactiveResponses) {
      setOptOuts((prev) => ({ ...prev, reactiveResponses: false }));
    }
  }, [optOuts.allTextMessages, optOuts.reactiveResponses]);

  const OPT_OUT_LABELS: Record<keyof OptOutState, string> = {
    allContact: 'All Contact',
    crmEmail: 'CRM Email',
    eblastsWorkflow: 'Eblasts and Workflow',
    allTextMessages: 'All Text Messages',
    reactiveResponses: 'Reactive Responses',
  };

  const toggleOptOut = (key: keyof OptOutState) => {
    const newVal = !optOuts[key];
    setOptOuts((prev) => ({ ...prev, [key]: newVal }));
    toast(newVal ? `${OPT_OUT_LABELS[key]} opted in` : `${OPT_OUT_LABELS[key]} opted out`);
  };

  const isReactiveResponsesDisabled = !optOuts.allTextMessages;

  const optOutItems = [
    {
      key: 'allContact' as const,
      label: 'All Contact',
      description:
        'All contact methods from the Real Geeks platform—emails, text messages, Workflows, Eblasts, and Property Update Emails.',
      disabled: false,
    },
    {
      key: 'crmEmail' as const,
      label: 'CRM Email',
      description:
        'Includes any direct email sent that is not a part of automated subscriptions, Eblasts, or Workflows.',
      disabled: false,
    },
    {
      key: 'eblastsWorkflow' as const,
      label: 'Eblasts and Workflow Emails/Texts',
      description:
        'Includes all automated Workflow emails/SMS, and Eblasts.',
      disabled: false,
    },
    {
      key: 'allTextMessages' as const,
      label: 'All Text Messages',
      description:
        'Includes any and all SMS from the CRM, Workflow SMS, Reactive Responses, and GeekAI (Workflow SMS alone may also be impacted by any of the above categories), whether automated or sent 1:1.',
      disabled: false,
    },
    {
      key: 'reactiveResponses' as const,
      label: 'Reactive Responses',
      description:
        "Includes SMS and Emails triggered by the Reactive Response feature. This is turned off automatically when 'Text Messages' above is switched to opted out.",
      disabled: isReactiveResponsesDisabled,
    },
  ];

  return (
    <CollapsibleCard title="SMS/Email Opt Outs" infoTooltip="On (purple) means opted in. Off (gray) means opted out.">
      {emptyMode ? (
        <EmptyState
          icon={Bell}
          title="No opt-out preferences"
          subtitle="SMS and email opt-out settings will appear here once preferences are configured."
        />
      ) : (
      <div className="space-y-spacing-4">
        {optOutItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-start gap-spacing-3 p-spacing-2 -mx-spacing-2 rounded-1 transition-colors ${
              item.disabled ? '' : 'hover:bg-gray-30 cursor-pointer'
            }`}
            onClick={() => !item.disabled && toggleOptOut(item.key)}
          >
            <Switch
              checked={optOuts[item.key]}
              onCheckedChange={() => !item.disabled && toggleOptOut(item.key)}
              disabled={item.disabled}
              className={`shrink-0 mt-0.5 cursor-pointer data-[state=checked]:bg-blue-100 ${
                item.disabled ? 'opacity-50 cursor-not-allowed bg-gray-40' : ''
              }`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-text-3 font-semibold ${
                  item.disabled ? 'text-gray-70' : 'text-text-default'
                }`}
              >
                {item.label}
              </p>
              <p
                className={`text-text-3 font-normal mt-0.5 leading-snug ${
                  item.disabled ? 'text-gray-70' : 'text-text-secondary'
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      )}
    </CollapsibleCard>
  );
}
