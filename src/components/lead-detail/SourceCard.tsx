import { CollapsibleCard } from './CollapsibleCard';

export function SourceCard() {
  return (
    <CollapsibleCard title="Source">
      <div className="space-y-spacing-3">
        <div className="grid grid-cols-[100px_1fr] gap-x-spacing-2 items-start">
          <span className="text-text-3 font-normal text-text-secondary pt-px">
            Source
          </span>
          <span className="text-text-3 text-text-default">
            Website Property Search
          </span>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-x-spacing-2 items-start">
          <span className="text-text-3 font-normal text-text-secondary pt-px">
            Details
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-text-3 text-text-default">Direct</span>
            <span className="text-text-2 text-text-muted">
              IP Address: 136.226.52.173
            </span>
            <span className="text-text-2 text-text-muted">
              Google Signup: 107783713173060314901
            </span>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
