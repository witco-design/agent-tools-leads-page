import { spacingTokens, sizingTokens } from './tokens';
import { useClipboard } from './useClipboard';

export function SpacingSizingGrid() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div className="space-y-spacing-6">
      {/* Spacing tokens */}
      <div>
        <h3 className="text-text-3 font-semibold text-text-secondary mb-spacing-3 uppercase tracking-wider">Spacing</h3>
        <div className="flex items-end gap-spacing-3 flex-wrap">
          {spacingTokens.map((token) => {
            const isCopied = copiedValue === `p-${token.key}`;
            return (
              <div
                key={token.key}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => copy(`p-${token.key}`)}
              >
                <div
                  className={`w-[56px] rounded-1 transition-all duration-200 group-hover:opacity-80 ${
                    isCopied ? 'ring-2 ring-success-text' : ''
                  }`}
                  style={{
                    height: `${token.px}px`,
                    backgroundColor: '#8da2de',
                  }}
                />
                <div className="text-text-2 font-semibold text-text-default mt-spacing-2 leading-tight text-center">
                  {token.key}
                </div>
                <div className="text-text-1 font-normal text-text-muted leading-tight text-center">
                  {token.px}px
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sizing tokens */}
      <div>
        <h3 className="text-text-3 font-semibold text-text-secondary mb-spacing-3 uppercase tracking-wider">Sizing</h3>
        <div className="flex items-end gap-spacing-3 flex-wrap">
          {sizingTokens.map((token) => {
            const isCopied = copiedValue === `w-${token.key}`;
            return (
              <div
                key={token.key}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => copy(`w-${token.key}`)}
              >
                <div
                  className={`rounded-1 transition-all duration-200 group-hover:opacity-80 ${
                    isCopied ? 'ring-2 ring-success-text' : ''
                  }`}
                  style={{
                    width: `${Math.max(token.px, 24)}px`,
                    height: `${token.px}px`,
                    backgroundColor: '#8da2de',
                  }}
                />
                <div className="text-text-2 font-semibold text-text-default mt-spacing-2 leading-tight text-center">
                  {token.key}
                </div>
                <div className="text-text-1 font-normal text-text-muted leading-tight text-center">
                  {token.px}px
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
