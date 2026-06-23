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

export interface TokenInfo {
  token: string;
  value: string;
  category: 'color' | 'spacing' | 'radius' | 'typography' | 'other';
}

const COLOR_SCALE: Record<string, Record<string, { hex: string }>> = {
  blue: {
    '10': { hex: '#f5fcff' }, '20': { hex: '#ebf8ff' }, '30': { hex: '#e4f2ff' },
    '40': { hex: '#bfddff' }, '50': { hex: '#96c9ff' }, '60': { hex: '#6eb3ff' },
    '70': { hex: '#55a2ff' }, '80': { hex: '#4592ff' }, '90': { hex: '#4484f0' },
    '100': { hex: '#4172dc' }, '110': { hex: '#3e60c9' }, '120': { hex: '#3840a9' },
  },
  gray: {
    '10': { hex: '#fcfcfd' }, '20': { hex: '#f9f9fb' }, '30': { hex: '#f6f7f9' },
    '40': { hex: '#f2f4f7' }, '50': { hex: '#e4e7ec' }, '60': { hex: '#d0d5dd' },
    '70': { hex: '#98a2b3' }, '80': { hex: '#667085' }, '90': { hex: '#475467' },
    '100': { hex: '#344054' }, '110': { hex: '#1d2939' }, '120': { hex: '#101828' },
  },
  green: {
    '10': { hex: '#f8fcfb' }, '20': { hex: '#f1f9f7' }, '30': { hex: '#e0f1ec' },
    '40': { hex: '#b3dbce' }, '50': { hex: '#84c5af' }, '60': { hex: '#58ae91' },
    '70': { hex: '#45ac86' }, '80': { hex: '#32aa7b' }, '90': { hex: '#2a8d66' },
    '100': { hex: '#216f51' }, '110': { hex: '#1a5f44' }, '120': { hex: '#11442c' },
  },
  red: {
    '10': { hex: '#fffafb' }, '20': { hex: '#fff0f2' }, '30': { hex: '#ffe0e4' },
    '40': { hex: '#ffbec4' }, '50': { hex: '#f98d8c' }, '60': { hex: '#e36362' },
    '70': { hex: '#ec423d' }, '80': { hex: '#ed2e20' }, '90': { hex: '#de2121' },
    '100': { hex: '#cc0a1b' }, '110': { hex: '#c00114' }, '120': { hex: '#b10005' },
  },
  orange: {
    '10': { hex: '#fef5dd' }, '20': { hex: '#fbe4ab' }, '30': { hex: '#f8d374' },
    '40': { hex: '#f7c166' }, '50': { hex: '#f6af58' }, '60': { hex: '#f59c4a' },
    '70': { hex: '#f48a3c' }, '80': { hex: '#f3782e' }, '90': { hex: '#e7722c' },
    '100': { hex: '#db6c29' }, '110': { hex: '#c26025' }, '120': { hex: '#aa5420' },
  },
  purple: {
    '10': { hex: '#f6f6ff' }, '20': { hex: '#ebeaff' }, '30': { hex: '#dedcff' },
    '40': { hex: '#c3c0f1' }, '50': { hex: '#aba6e6' }, '60': { hex: '#8883c9' },
    '70': { hex: '#746ec0' }, '80': { hex: '#6059b7' }, '90': { hex: '#4c45ae' },
    '100': { hex: '#3830a5' }, '110': { hex: '#322b95' }, '120': { hex: '#2d2684' },
  },
};

const TOKEN_MAP: Record<string, TokenInfo> = {};

for (const [family, shades] of Object.entries(COLOR_SCALE)) {
  for (const [shade, { hex }] of Object.entries(shades)) {
    const token = `${family[0].toUpperCase()}${family.slice(1)}/${shade}`;
    TOKEN_MAP[`bg-${family}-${shade}`] = { token, value: hex, category: 'color' };
    TOKEN_MAP[`text-${family}-${shade}`] = { token, value: hex, category: 'color' };
    TOKEN_MAP[`border-${family}-${shade}`] = { token, value: hex, category: 'color' };
  }
}

const SEMANTIC_COLORS: Record<string, { token: string; value: string }> = {
  'bg-bg-app': { token: 'Background/app', value: '#f5fcff' },
  'bg-bg-card': { token: 'Background/card', value: '#ffffff' },
  'bg-bg-muted': { token: 'Background/muted', value: '#fcfcfd' },
  'text-text-default': { token: 'Text/default', value: '#101828' },
  'text-text-secondary': { token: 'Text/secondary', value: '#475467' },
  'text-text-muted': { token: 'Text/muted', value: '#667085' },
  'text-text-link': { token: 'Text/link', value: '#4172dc' },
  'text-text-link-hover': { token: 'Text/link-hover', value: '#3e60c9' },
  'border-border-default': { token: 'Border/default', value: '#e4e7ec' },
  'border-border-strong': { token: 'Border/strong', value: '#d0d5dd' },
  'border-border-focus': { token: 'Border/focus', value: '#4172dc' },
  'text-icon-default': { token: 'Icon/default', value: '#1d2939' },
};
for (const [cls, { token, value }] of Object.entries(SEMANTIC_COLORS)) {
  TOKEN_MAP[cls] = { token, value, category: 'color' };
}

const SPACING_SCALE: Record<string, string> = {
  '0': '0px', '05': '2px', '1': '4px', '2': '8px', '3': '12px', '4': '16px',
  '5': '20px', '6': '24px', '7': '28px', '8': '32px', '9': '36px',
  '10': '40px', '11': '48px',
};
const SPACING_PREFIXES = ['p', 'px', 'py', 'pl', 'pr', 'pt', 'pb', 'm', 'mx', 'my', 'ml', 'mr', 'mt', 'mb', 'gap', 'gap-x', 'gap-y'];
for (const prefix of SPACING_PREFIXES) {
  for (const [n, val] of Object.entries(SPACING_SCALE)) {
    TOKEN_MAP[`${prefix}-spacing-${n}`] = { token: `Spacing/${n}`, value: val, category: 'spacing' };
  }
}

const RADIUS_MAP: Record<string, { token: string; value: string }> = {
  'rounded-1': { token: 'Radius/1', value: '4px' },
  'rounded-2': { token: 'Radius/2', value: '8px' },
  'rounded-3': { token: 'Radius/3', value: '12px' },
  'rounded-4': { token: 'Radius/4', value: '16px' },
  'rounded-round': { token: 'Radius/round', value: '999px' },
};
for (const [cls, { token, value }] of Object.entries(RADIUS_MAP)) {
  TOKEN_MAP[cls] = { token, value, category: 'radius' };
}

const TYPO_MAP: Record<string, { token: string; value: string }> = {
  'text-text-1': { token: 'Text/1', value: '8px / 10px' },
  'text-text-2': { token: 'Text/2', value: '12px / 16px' },
  'text-text-3': { token: 'Text/3', value: '14px / 20px' },
  'text-text-4': { token: 'Text/4', value: '16px / 24px' },
  'text-text-5': { token: 'Text/5', value: '18px / 24px' },
  'text-text-6': { token: 'Text/6', value: '20px / 24px' },
  'text-text-7': { token: 'Text/7', value: '24px / 32px' },
  'text-text-8': { token: 'Text/8', value: '32px / 40px' },
  'text-text-9': { token: 'Text/9', value: '60px / 60px' },
};
for (const [cls, { token, value }] of Object.entries(TYPO_MAP)) {
  TOKEN_MAP[cls] = { token, value, category: 'typography' };
}

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
  return 0.2126 * sRGBtoLin(rgb.r) + 0.7152 * sRGBtoLin(rgb.g) + 0.0722 * sRGBtoLin(rgb.b);
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
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
    current = current.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

export function lookupTokenByHex(hex: string): string | null {
  const normalized = hex.toLowerCase();
  for (const [family, shades] of Object.entries(COLOR_SCALE)) {
    for (const [shade, { hex: tokenHex }] of Object.entries(shades)) {
      if (tokenHex.toLowerCase() === normalized) {
        return `${family[0].toUpperCase()}${family.slice(1)}/${shade}`;
      }
    }
  }
  for (const { token, value } of Object.values(SEMANTIC_COLORS)) {
    if (value.toLowerCase() === normalized) return token;
  }
  return null;
}
