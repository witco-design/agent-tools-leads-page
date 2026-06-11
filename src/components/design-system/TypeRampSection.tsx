import { typeRamp } from './tokens';
import { useClipboard } from './useClipboard';

export function TypeRampSection() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div className="space-y-spacing-1">
      {typeRamp.map((entry) => {
        const regularClass = `${entry.step} font-normal`;
        const semiClass = `${entry.step} font-semibold`;

        return (
          <div
            key={entry.step}
            className="bg-bg-canvas rounded-1 border border-border-default px-spacing-4 py-spacing-3 flex items-baseline gap-spacing-6 hover:shadow-sm transition-shadow duration-200"
          >
            {/* Step name & metadata */}
            <div className="w-[140px] flex-shrink-0">
              <div className="text-text-2 font-semibold text-text-muted leading-tight">{entry.label}</div>
              <div className="text-text-1 font-normal text-text-muted mt-0.5">
                {entry.size} / {entry.lineHeight}
              </div>
            </div>

            {/* Regular specimen */}
            <div
              className="flex-1 cursor-pointer group"
              onClick={() => copy(`text-${entry.step}`)}
            >
              <div className="text-text-1 font-normal text-text-muted mb-0.5">Regular (400)</div>
              <div
                className={`text-text-default font-normal transition-colors duration-150 ${
                  copiedValue === `text-${entry.step}` ? 'text-success-text' : ''
                }`}
                style={{ fontSize: entry.size, lineHeight: entry.lineHeight }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>

            {/* Semi specimen */}
            <div
              className="flex-1 cursor-pointer group"
              onClick={() => copy(`text-${entry.step} font-semibold`)}
            >
              <div className="text-text-1 font-normal text-text-muted mb-0.5">Semi (600)</div>
              <div
                className={`text-text-default font-semibold transition-colors duration-150 ${
                  copiedValue === `text-${entry.step} font-semibold` ? 'text-success-text' : ''
                }`}
                style={{ fontSize: entry.size, lineHeight: entry.lineHeight }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
