import { useState } from 'react';
import { colorScales } from './tokens';
import { useClipboard } from './useClipboard';

function getContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff';
}

interface ColorChipProps {
  scaleName: string;
  step: string;
  hex: string;
  onCopy: (text: string) => void;
  copiedValue: string | null;
}

function ColorChip({ scaleName, step, hex, onCopy, copiedValue }: ColorChipProps) {
  const [hovered, setHovered] = useState(false);
  const tailwindClass = `bg-${scaleName}-${step}`;
  const isCopied = copiedValue === tailwindClass;
  const textColor = getContrastText(hex);

  return (
    <div
      className={`relative flex-1 min-w-[72px] h-[72px] rounded-1 shadow-sm cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
        hovered ? 'scale-105 shadow-md z-10' : ''
      } ${isCopied ? 'ring-2 ring-success-text' : ''}`}
      style={{ backgroundColor: hex }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCopy(tailwindClass)}
      title={`${tailwindClass} — ${hex}`}
    >
      <span
        className="text-[11px] font-semibold leading-tight"
        style={{ color: textColor }}
      >
        {step}
      </span>
      <span
        className="text-[10px] font-normal leading-tight mt-0.5 opacity-80"
        style={{ color: textColor }}
      >
        {hex}
      </span>
      {isCopied && (
        <div className="absolute inset-0 rounded-1 bg-success-bg/60 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-success-text">Copied!</span>
        </div>
      )}
      {hovered && !isCopied && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-canvas shadow-lg rounded-1 px-2 py-1 whitespace-nowrap z-20 pointer-events-none"
        >
          <span className="text-[10px] font-semibold text-text-default">{tailwindClass}</span>
        </div>
      )}
    </div>
  );
}

export function ColorPaletteSection() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div className="space-y-spacing-5">
      {Object.entries(colorScales).map(([scaleName, scale]) => {
        if (scaleName === 'ink') {
          return (
            <div key={scaleName}>
              <div className="text-text-2 font-semibold text-text-secondary mb-spacing-2 uppercase tracking-wider">{scaleName}</div>
              <div className="flex gap-spacing-2">
                {Object.entries(scale).map(([step, hex]) => (
                  <div
                    key={step}
                    className="min-w-[72px] h-[72px] rounded-1 shadow-sm cursor-pointer transition-all duration-200 flex flex-col items-center justify-center border border-border-default hover:scale-105 hover:shadow-md"
                    style={{ backgroundColor: hex }}
                    onClick={() => copy(`bg-ink-${step}`)}
                    title={`bg-ink-${step} — ${hex}`}
                  >
                    <span className="text-[11px] font-semibold" style={{ color: getContrastText(hex) }}>{step}</span>
                    <span className="text-[10px] font-normal opacity-80 mt-0.5" style={{ color: getContrastText(hex) }}>{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={scaleName}>
            <div className="text-text-2 font-semibold text-text-secondary mb-spacing-2 uppercase tracking-wider">{scaleName}</div>
            <div className="flex gap-spacing-2">
              {Object.entries(scale).map(([step, hex]) => (
                <ColorChip
                  key={step}
                  scaleName={scaleName}
                  step={step}
                  hex={hex}
                  onCopy={copy}
                  copiedValue={copiedValue}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
