import { shadowTokens } from './tokens';

export function ShadowShowcase() {
  return (
    <div className="flex gap-spacing-6 flex-wrap">
      {shadowTokens.map((token) => {
        let shadowClass = 'shadow-sm';
        if (token.key === 'shadow-md') shadowClass = 'shadow-md';
        if (token.key === 'shadow-lg') shadowClass = 'shadow-lg';

        return (
          <div
            key={token.key}
            className={`flex-1 min-w-[200px] bg-bg-canvas rounded-3 border border-border-default p-spacing-6 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 ${shadowClass} ${
              token.key === 'shadow-sm' ? 'hover:shadow-md' : token.key === 'shadow-md' ? 'hover:shadow-lg' : ''
            }`}
          >
            <div className="text-text-4 font-semibold text-text-default mb-spacing-1">
              {token.label}
            </div>
            <div className="text-text-2 font-normal text-text-muted text-center">
              {token.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
