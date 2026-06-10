import { useState, useMemo } from 'react';
import { X, Pipette, Layers, Palette, Ruler, Type } from 'lucide-react';
import { TOKENS, findNearestColorToken, Token } from './tokens';

type Tab = 'colors' | 'spacing' | 'typography' | 'components' | 'eyedropper';

// ── Main Panel ──────────────────────────────────────────────────────────────
export function TokenPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('colors');

  // Auto-scan the page for tokens in use
  const tokensInUse = useTokensInUse();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] z-[60] bg-white border-l border-[#E4E7EC] shadow-2xl transition-transform duration-200 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-label="Design tokens reference"
    >
      {/* Panel header */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-[#E4E7EC] bg-[#101828] text-white">
        <h2 className="text-base font-semibold">Design Tokens</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Tab strip */}
      <nav className="flex border-b border-[#E4E7EC] bg-[#f9f9fb]">
        {([
          { key: 'colors',     label: 'Colors',     icon: Palette },
          { key: 'spacing',    label: 'Spacing',    icon: Ruler },
          { key: 'typography', label: 'Type',       icon: Type },
          { key: 'components', label: 'Components', icon: Layers },
          { key: 'eyedropper', label: 'Picker',     icon: Pipette },
        ] as const).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 h-12 flex flex-col items-center justify-center gap-1 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-white text-[#3e60c9] border-b-2 border-[#3e60c9]'
                  : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content area */}
      <div className="overflow-y-auto h-[calc(100%-7rem)] p-4">
        {activeTab === 'colors' && <ColorsTab tokensInUse={tokensInUse} />}
        {activeTab === 'spacing' && <SpacingTab tokensInUse={tokensInUse} />}
        {activeTab === 'typography' && <TypographyTab tokensInUse={tokensInUse} />}
        {activeTab === 'components' && <ComponentsTab />}
        {activeTab === 'eyedropper' && <EyedropperTab />}
      </div>
    </div>
  );
}

// ── Auto-scan tokens in use ─────────────────────────────────────────────────
function useTokensInUse(): Set<string> {
  return useMemo(() => {
    const usedValues = new Set<string>();
    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      ['backgroundColor', 'color', 'borderColor'].forEach(prop => {
        const val = cs.getPropertyValue(prop);
        if (val && val.startsWith('rgb')) {
          const hex = rgbToHex(val);
          if (hex) usedValues.add(hex.toLowerCase());
        }
      });
    });
    return usedValues;
  }, []);
}

function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return '#' + [match[1], match[2], match[3]]
    .map(n => parseInt(n).toString(16).padStart(2, '0'))
    .join('');
}

// ── Colors Tab ──────────────────────────────────────────────────────────────
function ColorsTab({ tokensInUse }: { tokensInUse: Set<string> }) {
  const colorTokens = TOKENS.filter(t => t.category === 'color');
  const families = ['blue', 'gray', 'green', 'red', 'orange', 'purple'];

  return (
    <div className="space-y-5">
      {families.map(family => (
        <div key={family}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-2">
            {family}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {colorTokens
              .filter(t => t.name.startsWith(family + '.'))
              .map(token => {
                const inUse = tokensInUse.has(token.value.toLowerCase());
                return (
                  <button
                    key={token.name}
                    type="button"
                    onClick={() => navigator.clipboard.writeText(token.value)}
                    title={`${token.name}: ${token.value} — click to copy`}
                    className={`p-2 rounded border text-left cursor-pointer transition hover:shadow-sm ${
                      inUse ? 'border-[#3e60c9]' : 'border-[#E4E7EC]'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded border border-[#E4E7EC] mb-1"
                      style={{ backgroundColor: token.value }}
                    />
                    <div className="text-xs font-mono text-[#101828]">
                      {token.name.split('.')[1]}
                    </div>
                    <div className="text-xs font-mono text-[#667085]">
                      {token.value}
                    </div>
                    {inUse && (
                      <div className="text-xs text-[#3e60c9] mt-1">in use</div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Spacing Tab ─────────────────────────────────────────────────────────────
function SpacingTab({ tokensInUse: _tokensInUse }: { tokensInUse: Set<string> }) {
  const spacingTokens = TOKENS.filter(t => t.category === 'spacing');
  const radiusTokens = TOKENS.filter(t => t.category === 'radius');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-2">
          Spacing Scale
        </h3>
        <div className="space-y-2">
          {spacingTokens.map(token => (
            <button
              key={token.name}
              type="button"
              onClick={() => navigator.clipboard.writeText(token.name)}
              title={`${token.name}: ${token.value} — click to copy`}
              className="w-full flex items-center gap-3 p-2 rounded border border-[#E4E7EC] text-left cursor-pointer hover:shadow-sm transition"
            >
              <div
                className="h-4 rounded bg-[#3e60c9]"
                style={{ width: token.value }}
              />
              <div className="text-xs font-mono text-[#101828] whitespace-nowrap">
                {token.name}
              </div>
              <div className="text-xs font-mono text-[#667085]">
                {token.value}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-2">
          Border Radius
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {radiusTokens.map(token => (
            <button
              key={token.name}
              type="button"
              onClick={() => navigator.clipboard.writeText(token.name)}
              title={`${token.name}: ${token.value} — click to copy`}
              className="p-2 rounded border border-[#E4E7EC] text-center cursor-pointer hover:shadow-sm transition"
            >
              <div
                className="w-12 h-12 mx-auto mb-1 border-2 border-[#3e60c9] bg-[#f5fcff]"
                style={{ borderRadius: token.value }}
              />
              <div className="text-xs font-mono text-[#101828]">{token.name}</div>
              <div className="text-xs font-mono text-[#667085]">{token.value}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Typography Tab ──────────────────────────────────────────────────────────
function TypographyTab({ tokensInUse: _tokensInUse }: { tokensInUse: Set<string> }) {
  const typoTokens = TOKENS.filter(t => t.category === 'typography');

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-2">
        Type Scale
      </h3>
      {typoTokens.map(token => {
        const size = token.value.split(' / ')[0];
        return (
          <button
            key={token.name}
            type="button"
            onClick={() => navigator.clipboard.writeText(token.name)}
            title={`${token.name}: ${token.value} — click to copy`}
            className="w-full p-3 rounded border border-[#E4E7EC] text-left cursor-pointer hover:shadow-sm transition"
          >
            <div
              className="text-[#101828] font-medium mb-1 truncate"
              style={{ fontSize: size }}
            >
              The quick brown fox
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#667085]">
              <span>{token.name}</span>
              <span className="text-[#E4E7EC]">|</span>
              <span>{token.value}</span>
            </div>
            {token.description && (
              <div className="text-xs text-[#98a2b3] mt-0.5">{token.description}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Components Tab ──────────────────────────────────────────────────────────
function ComponentsTab() {
  const components = useMemo(() => {
    const map = new Map<string, number>();
    document.querySelectorAll('[data-component]').forEach(el => {
      const name = el.getAttribute('data-component') || '';
      if (name) map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).sort();
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-2">
        Components on Page ({components.length})
      </h3>
      {components.length === 0 ? (
        <p className="text-sm text-[#667085]">No data-component attributes found.</p>
      ) : (
        components.map(([name, count]) => (
          <div
            key={name}
            className="p-3 border border-[#E4E7EC] rounded flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-medium text-[#101828]">{name}</div>
              <div className="text-xs text-[#667085]">data-component=&quot;{name}&quot;</div>
            </div>
            {count > 1 && (
              <span className="text-xs text-[#667085] tabular-nums">&times;{count}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ── Eyedropper Tab ──────────────────────────────────────────────────────────
function EyedropperTab() {
  const [picked, setPicked] = useState<{ color: string; token: Token | null } | null>(null);

  const handlePick = async () => {
    // EyeDropper is a newer browser API (Chrome/Edge 95+)
    if (!('EyeDropper' in window)) {
      alert('Eyedropper not supported in this browser. Use Chrome 95+ or Edge 95+.');
      return;
    }
    // @ts-expect-error — EyeDropper is not yet in TS lib typings
    const dropper = new window.EyeDropper();
    try {
      const result = await dropper.open();
      const hex = result.sRGBHex;
      const nearest = findNearestColorToken(hex);
      setPicked({ color: hex, token: nearest?.token || null });
    } catch {
      // user cancelled
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePick}
        className="w-full h-10 inline-flex items-center justify-center gap-2 bg-[#3e60c9] hover:bg-[#3840a9] text-white rounded text-sm font-medium transition cursor-pointer"
      >
        <Pipette className="w-4 h-4" />
        Pick a color
      </button>

      {picked && (
        <div className="mt-4 p-3 border border-[#E4E7EC] rounded">
          <div
            className="w-full h-16 rounded border border-[#E4E7EC] mb-2"
            style={{ backgroundColor: picked.color }}
          />
          <div className="text-xs font-mono text-[#101828] mb-1">
            {picked.color.toUpperCase()}
          </div>
          {picked.token ? (
            <div className="text-xs text-[#3e60c9]">
              Nearest token: <strong>{picked.token.name}</strong> ({picked.token.value})
            </div>
          ) : (
            <div className="text-xs text-[#667085]">
              No matching token — consider adding to design system.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
