// src/dev/tokenMap.ts
// Maps Tailwind classes → Real Geeks design tokens for the Inspector panel.
// Also provides color-math helpers for contrast checking.

export interface TokenInfo {
  token: string;
  value: string;
  category: 'color' | 'spacing' | 'radius' | 'typography' | 'other';
}

/* ────────────────────────────────────────────────────────
   Tailwind class → token mapping
   ──────────────────────────────────────────────────────── */

const COLOR_SCALE: Record<string, Record<string, { hex: string }>> = {
  blue: {
    '10': { hex: '#f5fcff' }, '20': { hex: '#ebf8ff' }, '30': { hex: '#e4f2ff' },
    '40': { hex: '#bfddff' }, '50': { hex: '#849ee3' }, '60': { hex: '#6781d9' },
    '70': { hex: '#4e68cc' }, '80': { hex: '#3e60c9' }, '90': { hex: '#3840a9' },
    '100': { hex: '#3a4daa' }, '110': { hex: '#3e60c9' }, '120': { hex: '#3840a9' },
  },
  gray: {
    '10': { hex: '#f9fafb' }, '20': { hex: '#f2f4f7' }, '30': { hex: '#eaecf0' },
    '40': { hex: '#d0d5dd' }, '50': { hex: '#e4e7ec' }, '60': { hex: '#98a2b3' },
    '70': { hex: '#667085' }, '80': { hex: '#475467' }, '90': { hex: '#344054' },
    '100': { hex: '#1d2939' }, '110': { hex: '#101828' }, '120': { hex: '#0c111d' },
  },
  green: {
    '10': { hex: '#e0f1ec' }, '20': { hex: '#dcfae6' }, '30': { hex: '#e0f1ec' },
    '40': { hex: '#6ce9a6' }, '50': { hex: '#32d583' }, '60': { hex: '#12b76a' },
    '70': { hex: '#45ac86' }, '80': { hex: '#027a48' }, '90': { hex: '#05603a' },
    '100': { hex: '#216f51' }, '110': { hex: '#053321' }, '120': { hex: '#022a1a' },
  },
  red: {
    '10': { hex: '#fef3f2' }, '20': { hex: '#fee4e2' }, '30': { hex: '#ffe0e4' },
    '40': { hex: '#fda29b' }, '50': { hex: '#f97066' }, '60': { hex: '#f04438' },
    '70': { hex: '#ec423d' }, '80': { hex: '#b42318' }, '90': { hex: '#912018' },
    '100': { hex: '#7a271a' }, '110': { hex: '#55160c' }, '120': { hex: '#3b0b05' },
  },
  orange: {
    '10': { hex: '#fef6ee' }, '20': { hex: '#fbe4ab' }, '30': { hex: '#f9dbaf' },
    '40': { hex: '#f7b27a' }, '50': { hex: '#f38744' }, '60': { hex: '#ef6820' },
    '70': { hex: '#f48a3c' }, '80': { hex: '#b93815' }, '90': { hex: '#932f19' },
    '100': { hex: '#7e2410' }, '110': { hex: '#c26025' }, '120': { hex: '#3d1106' },
  },
  purple: {
    '10': { hex: '#ebeaff' }, '20': { hex: '#d9d6fe' }, '30': { hex: '#c3c0f1' },
    '40': { hex: '#a4a0f5' }, '50': { hex: '#8580eb' }, '60': { hex: '#6a65d8' },
    '70': { hex: '#746ec0' }, '80': { hex: '#4f4dab' }, '90': { hex: '#3e3d87' },
    '100': { hex: '#2f2e67' }, '110': { hex: '#23234b' }, '120': { hex: '#171733' },
  },
};

// Build the TOKEN_MAP dynamically from the color scale + known semantic/spacing/radius/typography tokens
const TOKEN_MAP: Record<string, TokenInfo> = {};

// Color tokens — generate for bg-*, text-*, border-* prefixes
for (const [family, shades] of Object.entries(COLOR_SCALE)) {
  for (const [shade, { hex }] of Object.entries(shades)) {
    const token = `${family[0].toUpperCase()}${family.slice(1)}/${shade}`;
    TOKEN_MAP[`bg-${family}-${shade}`] = { token, value: hex, category: 'color' };
    TOKEN_MAP[`text-${family}-${shade}`] = { token, value: hex, category: 'color' };
    TOKEN_MAP[`border-${family}-${shade}`] = { token, value: hex, category: 'color' };
  }
}

// Semantic color tokens
const SEMANTIC_COLORS: Record<string, { token: string; value: string }> = {
  'bg-bg-app': { token: 'Background/app', value: '#f5fcff' },
  'bg-bg-card': { token: 'Background/card', value: '#ffffff' },
  'bg-bg-muted': { token: 'Background/muted', value: '#f9fafb' },
  'text-text-default': { token: 'Text/default', value: '#101828' },
  'text-text-secondary': { token: 'Text/secondary', value: '#475467' },
  'text-text-muted': { token: 'Text/muted', value: '#667085' },
  'text-text-link': { token: 'Text/link', value: '#3e60c9' },
  'text-text-link-hover': { token: 'Text/link-hover', value: '#3840a9' },
  'border-border-default': { token: 'Border/default', value: '#e4e7ec' },
  'border-border-strong': { token: 'Border/strong', value: '#d0d5dd' },
  'border-border-focus': { token: 'Border/focus', value: '#3e60c9' },
  'text-icon-default': { token: 'Icon/default', value: '#667085' },
};
for (const [cls, { token, value }] of Object.entries(SEMANTIC_COLORS)) {
  TOKEN_MAP[cls] = { token, value, category: 'color' };
}

// Spacing tokens — for p, px, py, pl, pr, pt, pb, m, mx, my, ml, mr, mt, mb, gap variants
const SPACING_SCALE: Record<string, string> = {
  '0': '0px', '1': '4px', '2': '8px', '3': '12px', '4': '16px',
  '5': '20px', '6': '24px', '7': '28px', '8': '32px', '9': '36px',
  '10': '40px', '11': '48px',
};
const SPACING_PREFIXES = ['p', 'px', 'py', 'pl', 'pr', 'pt', 'pb', 'm', 'mx', 'my', 'ml', 'mr', 'mt', 'mb', 'gap', 'gap-x', 'gap-y'];
for (const prefix of SPACING_PREFIXES) {
  for (const [n, val] of Object.entries(SPACING_SCALE)) {
    TOKEN_MAP[`${prefix}-spacing-${n}`] = { token: `Spacing/${n}`, value: val, category: 'spacing' };
  }
}

// Border radius tokens
const RADIUS_MAP: Record<string, { token: string; value: string }> = {
  'rounded-1': { token: 'Radius/1', value: '4px' },
  'rounded-2': { token: 'Radius/2', value: '8px' },
  'rounded-3': { token: 'Radius/3', value: '12px' },
  'rounded-4': { token: 'Radius/4', value: '16px' },
  'rounded-round': { token: 'Radius/round', value: '9999px' },
  'rounded-radius-1': { token: 'Radius/1', value: '4px' },
  'rounded-radius-2': { token: 'Radius/2', value: '8px' },
  'rounded-radius-3': { token: 'Radius/3', value: '12px' },
  'rounded-radius-4': { token: 'Radius/4', value: '16px' },
  'rounded-radius-round': { token: 'Radius/round', value: '9999px' },
};
for (const [cls, { token, value }] of Object.entries(RADIUS_MAP)) {
  TOKEN_MAP[cls] = { token, value, category: 'radius' };
}

// Typography tokens
const TYPO_MAP: Record<string, { token: string; value: string }> = {
  'text-text-1': { token: 'Text/1', value: '8px / 12px' },
  'text-text-2': { token: 'Text/2', value: '10px / 14px' },
  'text-text-3': { token: 'Text/3', value: '12px / 16px' },
  'text-text-4': { token: 'Text/4', value: '14px / 20px' },
  'text-text-5': { token: 'Text/5', value: '16px / 24px' },
  'text-text-6': { token: 'Text/6', value: '20px / 28px' },
  'text-text-7': { token: 'Text/7', value: '24px / 32px' },
  'text-text-8': { token: 'Text/8', value: '32px / 40px' },
  'text-text-9': { token: 'Text/9', value: '60px / 72px' },
};
for (const [cls, { token, value }] of Object.entries(TYPO_MAP)) {
  TOKEN_MAP[cls] = { token, value, category: 'typography' };
}

/* ────────────────────────────────────────────────────────
   Lookup helpers
   ──────────────────────────────────────────────────────── */

export function lookupToken(className: string): TokenInfo | null {
  return TOKEN_MAP[className] || null;
}

export interface ParsedClass {
  class: string;
  token?: string;
  value?: string;
  category?: string;
}

export function parseClassesWithTokens(className: string): ParsedClass[] {
  const classes = className.split(/\s+/).filter(Boolean);
  return classes.map((c) => {
    const info = lookupToken(c);
    return info
      ? { class: c, token: info.token, value: info.value, category: info.category }
      : { class: c };
  });
}

/* ────────────────────────────────────────────────────────
   Color math helpers
   ──────────────────────────────────────────────────────── */

export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  return (
    '#' +
    [match[1], match[2], match[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, '0'))
      .join('')
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function sRGBtoLin(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const R = sRGBtoLin(rgb.r);
  const G = sRGBtoLin(rgb.g);
  const B = sRGBtoLin(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function computeContrast(fg: string, bg: string): number {
  const fgHex = fg.startsWith('#') ? fg : rgbToHex(fg);
  const bgHex = bg.startsWith('#') ? bg : rgbToHex(bg);
  const L1 = relativeLuminance(fgHex);
  const L2 = relativeLuminance(bgHex);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getEffectiveBg(el: HTMLElement): string {
  let current: HTMLElement | null = el;
  while (current) {
    const bg = getComputedStyle(current).backgroundColor;
    // Skip transparent / rgba with 0 alpha
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return bg;
    }
    current = current.parentElement;
  }
  return 'rgb(255, 255, 255)'; // fallback to white
}

// Look up a token by its computed value (hex) — useful for Colors section
export function lookupTokenByHex(hex: string): string | null {
  const normalized = hex.toLowerCase();
  // Check all color scale entries
  for (const [family, shades] of Object.entries(COLOR_SCALE)) {
    for (const [shade, { hex: tokenHex }] of Object.entries(shades)) {
      if (tokenHex.toLowerCase() === normalized) {
        return `${family[0].toUpperCase()}${family.slice(1)}/${shade}`;
      }
    }
  }
  // Check semantic tokens
  for (const { token, value } of Object.values(SEMANTIC_COLORS)) {
    if (value.toLowerCase() === normalized) return token;
  }
  return null;
}
