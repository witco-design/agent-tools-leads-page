/**
 * PROTECTED — DevMode tooling.
 *
 * This file is part of the DevMode engineer-handoff system. Do not modify,
 * refactor, or delete without explicit user permission. Bolt / AI agents
 * should treat this folder as off-limits unless the user specifically
 * requests changes to DevMode.
 *
 * Removing or breaking DevMode files affects the design-system handoff to
 * the engineering team. If you think you need to change something here,
 * stop and ask the user first.
 */

import { useState } from 'react';
import { Code as Code2, X, MousePointerClick, ChevronDown, Clipboard, Check } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import {
  parseClassesWithTokens,
  rgbToHex,
  computeContrast,
  getEffectiveBg,
  lookupTokenByHex,
  type ParsedClass,
} from './tokenMap';

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#667085] hover:bg-[#f9fafb] cursor-pointer bg-transparent border-none"
      >
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Row({ label, value, extra, warning }: { label: string; value: React.ReactNode; extra?: string | null; warning?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[3px] text-xs">
      <span className="text-[#667085] shrink-0">{label}</span>
      <span className={`font-mono text-right break-all ${warning ? 'text-[#f48a3c]' : 'text-[#101828]'}`}>
        {value}
        {extra && <span className="text-[#667085] ml-1">({extra})</span>}
      </span>
    </div>
  );
}

function ColorSwatch({ label, hex, tokenName }: { label: string; hex: string; tokenName: string | null }) {
  return (
    <div className="flex items-center gap-2 py-[3px]">
      <div
        className="w-5 h-5 rounded border border-[#e4e7ec] shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-[#101828]">{hex.toUpperCase()}</div>
        {tokenName && <div className="text-[10px] text-[#667085]">{tokenName}</div>}
      </div>
      <span className="text-[10px] text-[#667085] shrink-0">{label}</span>
    </div>
  );
}

function CopyButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-2 py-1.5 text-xs font-medium border border-[#e4e7ec] rounded bg-white hover:bg-[#f9fafb] transition flex items-center justify-center gap-1 cursor-pointer"
    >
      {copied ? <Check className="w-3 h-3 text-[#45ac86]" /> : <Clipboard className="w-3 h-3 text-[#667085]" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function IdentitySection({ element }: { element: HTMLElement }) {
  const componentName = element.getAttribute('data-component') || null;
  const rect = element.getBoundingClientRect();

  return (
    <Section title="Identity">
      {componentName && <Row label="Component" value={componentName} />}
      <Row label="Tag" value={`<${element.tagName.toLowerCase()}>`} />
      <Row label="Dimensions" value={`${Math.round(rect.width)} × ${Math.round(rect.height)} px`} />
      {element.id && <Row label="id" value={`#${element.id}`} />}
    </Section>
  );
}

function ClassesSection({ element }: { element: HTMLElement }) {
  const className = typeof element.className === 'string' ? element.className : '';
  if (!className.trim()) {
    return (
      <Section title="Tailwind classes (0)">
        <p className="text-xs text-[#667085] italic">No classes on this element</p>
      </Section>
    );
  }

  const parsed = parseClassesWithTokens(className);

  const groups: Record<string, ParsedClass[]> = {};
  for (const item of parsed) {
    const cat = item.category || 'other';
    (groups[cat] ||= []).push(item);
  }

  const categoryOrder = ['color', 'spacing', 'radius', 'typography', 'other'];
  const sortedEntries = categoryOrder
    .filter((c) => groups[c]?.length)
    .map((c) => [c, groups[c]] as const);

  return (
    <Section title={`Tailwind classes (${parsed.length})`}>
      {sortedEntries.map(([cat, items]) => (
        <div key={cat} className="mb-3 last:mb-0">
          <p className="text-[10px] font-semibold uppercase text-[#98a2b3] mb-1">{cat}</p>
          <ul className="space-y-0.5">
            {items.map((item, i) => (
              <li key={`${item.class}-${i}`} className="flex items-baseline gap-2 text-xs font-mono">
                <span className="text-[#101828]">{item.class}</span>
                {item.token && (
                  <span className="text-[#667085]">→ {item.token} ({item.value})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}

function BoxModelSection({ element }: { element: HTMLElement }) {
  const cs = getComputedStyle(element);
  const m = [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].map((v) => parseInt(v) || 0);
  const b = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map((v) => parseInt(v) || 0);
  const p = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => parseInt(v) || 0);
  const rect = element.getBoundingClientRect();
  const contentW = Math.round(rect.width - b[1] - b[3] - p[1] - p[3]);
  const contentH = Math.round(rect.height - b[0] - b[2] - p[0] - p[2]);

  return (
    <Section title="Box model">
      <div className="text-[10px] font-mono text-center select-none">
        <div className="border border-dashed border-[#f48a3c]/40 bg-[#f48a3c]/5 p-1.5 inline-block w-full">
          <div className="text-[#f48a3c] mb-1">margin</div>
          <div className="text-[#f48a3c] mb-0.5">{m[0]}</div>
          <div className="flex items-center justify-center gap-1">
            <div className="text-[#f48a3c] w-6 text-right">{m[3]}</div>
            <div className="border border-[#eab308]/60 bg-[#eab308]/5 p-1.5 flex-1">
              <div className="text-[#a16207] mb-0.5">border · {b[0]}</div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-[#a16207] w-4 text-right">{b[3]}</div>
                <div className="border border-[#22c55e]/60 bg-[#22c55e]/5 p-1.5 flex-1">
                  <div className="text-[#16a34a] mb-0.5">padding · {p[0]}</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-[#16a34a] w-4 text-right">{p[3]}</div>
                    <div className="border border-[#3e60c9] bg-[#3e60c9]/10 px-2 py-1.5 flex-1 text-[#3e60c9] font-semibold">
                      {contentW} × {contentH}
                    </div>
                    <div className="text-[#16a34a] w-4 text-left">{p[1]}</div>
                  </div>
                  <div className="text-[#16a34a] mt-0.5">{p[2]}</div>
                </div>
                <div className="text-[#a16207] w-4 text-left">{b[1]}</div>
              </div>
              <div className="text-[#a16207] mt-0.5">{b[2]}</div>
            </div>
            <div className="text-[#f48a3c] w-6 text-left">{m[1]}</div>
          </div>
          <div className="text-[#f48a3c] mt-0.5">{m[2]}</div>
        </div>
      </div>
    </Section>
  );
}

function ColorsSection({ element }: { element: HTMLElement }) {
  const cs = getComputedStyle(element);
  const fg = cs.color;
  const bg = getEffectiveBg(element);

  const fgHex = rgbToHex(fg);
  const bgHex = rgbToHex(bg);
  const contrast = computeContrast(fgHex, bgHex);
  const aaText = contrast >= 4.5;
  const aaLargeText = contrast >= 3;
  const aaaText = contrast >= 7;

  const fgToken = lookupTokenByHex(fgHex);
  const bgToken = lookupTokenByHex(bgHex);

  let contrastLabel: string;
  let contrastColor: string;
  if (aaText) {
    contrastLabel = aaaText ? 'AAA pass' : 'AA pass';
    contrastColor = '#45ac86';
  } else if (aaLargeText) {
    contrastLabel = 'AA Large only';
    contrastColor = '#f48a3c';
  } else {
    contrastLabel = 'Fails AA';
    contrastColor = '#ec423d';
  }

  return (
    <Section title="Colors">
      <ColorSwatch label="Text" hex={fgHex} tokenName={fgToken} />
      <ColorSwatch label="Background" hex={bgHex} tokenName={bgToken} />
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="font-mono text-[#101828]">{contrast.toFixed(2)}:1</span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{ backgroundColor: `${contrastColor}20`, color: contrastColor }}
        >
          {contrastLabel}
        </span>
      </div>
    </Section>
  );
}

function TypographySection({ element }: { element: HTMLElement }) {
  const cs = getComputedStyle(element);
  const fontFamily = cs.fontFamily.split(',')[0].replace(/['"]/g, '');

  // Map font-size px value to typography token (matches updated type ramp)
  const sizeNum = parseFloat(cs.fontSize);
  const sizeTokenMap: Record<number, string> = {
    8: 'Text/1', 12: 'Text/2', 14: 'Text/3', 16: 'Text/4',
    18: 'Text/5', 20: 'Text/6', 24: 'Text/7', 32: 'Text/8', 60: 'Text/9',
  };
  const sizeToken = sizeTokenMap[sizeNum] || null;

  return (
    <Section title="Typography">
      <Row label="Font" value={fontFamily} />
      <Row label="Size" value={cs.fontSize} extra={sizeToken} />
      <Row label="Weight" value={cs.fontWeight} />
      <Row label="Line height" value={cs.lineHeight} />
      <Row label="Letter spacing" value={cs.letterSpacing === 'normal' ? '0' : cs.letterSpacing} />
    </Section>
  );
}

function implicitRole(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const roleMap: Record<string, string> = {
    a: 'link', button: 'button', h1: 'heading', h2: 'heading', h3: 'heading',
    h4: 'heading', h5: 'heading', h6: 'heading', img: 'img', input: 'textbox',
    nav: 'navigation', main: 'main', header: 'banner', footer: 'contentinfo',
    form: 'form', select: 'combobox', textarea: 'textbox', table: 'table',
    ul: 'list', ol: 'list', li: 'listitem', section: 'region', aside: 'complementary',
  };
  return roleMap[tag] || '';
}

function computeAccessibleName(el: HTMLElement): string {
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent?.trim() || '';
  }

  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
    const id = el.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
    }
  }

  if (el.children.length === 0) return el.textContent?.trim() || '';

  let text = '';
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent || '';
  });
  return text.trim() || '';
}

function AccessibilitySection({ element }: { element: HTMLElement }) {
  const role = element.getAttribute('role') || implicitRole(element);
  const ariaLabel = element.getAttribute('aria-label');
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  const ariaHidden = element.getAttribute('aria-hidden');
  const tabindex = element.getAttribute('tabindex');
  const accessibleName = computeAccessibleName(element);

  return (
    <Section title="Accessibility">
      <Row label="Role" value={role || '—'} />
      <Row label="Accessible name" value={accessibleName || '—'} />
      {ariaLabel && <Row label="aria-label" value={ariaLabel} />}
      {ariaDescribedBy && <Row label="aria-describedby" value={ariaDescribedBy} />}
      {ariaHidden === 'true' && <Row label="aria-hidden" value="true" warning />}
      {tabindex !== null && <Row label="tabindex" value={tabindex} />}
    </Section>
  );
}

function CopyActionsSection({ element }: { element: HTMLElement }) {
  const className = typeof element.className === 'string' ? element.className : '';

  const copyTailwind = () => navigator.clipboard.writeText(className);

  const copyJSX = () => {
    const tag = element.tagName.toLowerCase();
    const text = element.children.length === 0 ? element.textContent?.trim() : '...';
    const cls = className ? ` className="${className}"` : '';
    const jsx = `<${tag}${cls}>${text || ''}</${tag}>`;
    navigator.clipboard.writeText(jsx);
  };

  const copyCSS = () => {
    const cs = getComputedStyle(element);
    const props = [
      'display', 'position', 'width', 'height', 'padding', 'margin',
      'border', 'border-radius', 'background', 'color', 'font-size', 'font-weight', 'box-shadow',
    ];
    const css = props.map((p) => `  ${p}: ${cs.getPropertyValue(p)};`).join('\n');
    navigator.clipboard.writeText(`{\n${css}\n}`);
  };

  return (
    <Section title="Copy">
      <div className="grid grid-cols-3 gap-2">
        <CopyButton label="Tailwind" onClick={copyTailwind} />
        <CopyButton label="JSX" onClick={copyJSX} />
        <CopyButton label="CSS" onClick={copyCSS} />
      </div>
    </Section>
  );
}

function InspectorBody({ element }: { element: HTMLElement }) {
  return (
    <div className="divide-y divide-[#e4e7ec]">
      <IdentitySection element={element} />
      <ClassesSection element={element} />
      <BoxModelSection element={element} />
      <ColorsSection element={element} />
      <TypographySection element={element} />
      <AccessibilitySection element={element} />
      <CopyActionsSection element={element} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-5 py-16 text-[#667085]">
      <MousePointerClick className="w-8 h-8 mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-[#101828] mb-1">No element selected</p>
      <p className="text-xs">Hover over the page to preview elements. Click to lock selection.</p>
      <kbd className="mt-3 px-2 py-1 bg-[#f2f4f7] rounded text-[10px] font-mono text-[#475467]">Esc</kbd>
      <span className="text-xs mt-1">to clear selection</span>
    </div>
  );
}

export function InspectorPanel() {
  const { setActive, selectedElement } = useDevMode();

  return (
    <div
      data-devmode-panel
      className="flex flex-col h-full"
      role="complementary"
      aria-label="DevMode element inspector"
    >
      <div className="px-4 py-3 border-b border-[#e4e7ec] flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#3e60c9]" />
          <h2 className="text-sm font-semibold text-[#101828]">Inspector</h2>
        </div>
        <button
          type="button"
          onClick={() => setActive(false)}
          aria-label="Close DevMode"
          className="text-[#667085] hover:text-[#101828] cursor-pointer bg-transparent border-none p-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedElement ? <InspectorBody element={selectedElement} /> : <EmptyState />}
      </div>
    </div>
  );
}
