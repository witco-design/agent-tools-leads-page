import { CollapsibleCard } from './CollapsibleCard';

export function SourceCard() {
  return (
    <CollapsibleCard title="Source">
      <div className="space-y-spacing-3">
        <div className="flex items-center gap-spacing-2">
          <span className="text-text-3 font-normal text-text-secondary w-[60px] shrink-0">
            Source
          </span>
          <span className="text-text-3 font-normal text-text-default">
            Website Property Search
          </span>
        </div>

        <div className="w-full">
          <p className="text-text-3 font-normal text-text-secondary mb-spacing-1">
            Details
          </p>
          <p className="text-text-3 font-normal text-text-default leading-snug">
            Direct
          </p>
          <div className="mt-spacing-1 space-y-spacing-0.5">
            <p className="text-text-3 font-normal text-text-muted leading-snug">
              <span className="text-text-secondary">IP Address:</span>{' '}
              136.226.52.173
            </p>
            <p className="text-text-3 font-normal text-text-muted leading-snug">
              <span className="text-text-secondary">Google Signup:</span>{' '}
              107783713173060314901
            </p>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
