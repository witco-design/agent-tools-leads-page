import { radiusTokens } from './tokens';
import { useClipboard } from './useClipboard';

export function BorderRadiusStrip() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div className="flex gap-spacing-6 flex-wrap">
      {radiusTokens.map((token) => {
        const isCopied = copiedValue === token.key;
        return (
          <div
            key={token.key}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => copy(token.key)}
          >
            <div
              className={`w-sizing-12 h-sizing-12 bg-blue-40 border-2 border-blue-80 transition-all duration-200 group-hover:shadow-md group-hover:scale-105 ${
                isCopied ? 'ring-2 ring-success-text' : ''
              }`}
              style={{ borderRadius: token.value }}
            />
            <div className="text-text-2 font-semibold text-text-default mt-spacing-2 text-center">
              {token.key}
            </div>
            <div className="text-text-2 font-normal text-text-secondary text-center">
              {token.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
