import { useState } from 'react';
import { Radio } from 'lucide-react';
import { toast } from 'sonner';

export function OnlineNowBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="flex items-center bg-success-bg rounded-round px-spacing-4 py-spacing-3 border border-success-border">
      <div className="flex items-center gap-spacing-2 flex-1">
        <Radio className="w-4 h-4 text-text-default shrink-0" />
        <span className="text-text-4 font-semibold text-text-default">
          Online Now
        </span>
      </div>
      <button
        type="button"
        className="text-text-4 font-semibold text-text-default underline cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => {
          setVisible(false);
          toast("Dismissed — you won't see this for the rest of the session");
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
