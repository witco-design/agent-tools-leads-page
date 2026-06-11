import { semanticAliases } from './tokens';
import { useClipboard } from './useClipboard';

export function SemanticAliasCards() {
  const { copy, copiedValue } = useClipboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-6">
      {Object.entries(semanticAliases).map(([category, aliases]) => (
        <div
          key={category}
          className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <h3 className="text-text-4 font-semibold text-text-default mb-spacing-3 pb-spacing-2 border-b border-border-default">
            {category}
          </h3>
          <div className="space-y-spacing-3">
            {aliases.map((alias) => {
              const isCopied = copiedValue === alias.name;
              return (
                <div
                  key={alias.name}
                  className={`flex items-start gap-spacing-3 cursor-pointer rounded-1 p-spacing-2 -mx-spacing-2 transition-colors duration-150 hover:bg-bg-muted ${
                    isCopied ? 'bg-success-bg/30' : ''
                  }`}
                  onClick={() => copy(alias.name)}
                >
                  {/* Color dot */}
                  <div
                    className="w-sizing-6 h-sizing-6 rounded-round flex-shrink-0 border border-border-default shadow-sm mt-0.5"
                    style={{ backgroundColor: alias.value }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-spacing-2">
                      <span className="text-text-3 font-semibold text-text-default">
                        {alias.name}
                      </span>
                      {isCopied && (
                        <span className="text-text-1 font-semibold text-success-text">Copied!</span>
                      )}
                    </div>
                    <div className="text-text-2 font-normal text-text-muted">
                      {alias.value} &middot; {alias.resolvedFrom}
                    </div>
                    <div className="text-text-2 font-normal text-text-secondary mt-0.5">
                      {alias.usage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
