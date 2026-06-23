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

export type TokenCategory = 'color' | 'spacing' | 'radius' | 'typography' | 'shadow';

export interface Token {
  name: string;
  value: string;
  category: TokenCategory;
  description?: string;
}

export const TOKENS: Token[] = [
  // === COLORS ===

  // Blue scale
  { name: 'blue.10',  value: '#f5fcff', category: 'color', description: 'Lightest blue — page bg' },
  { name: 'blue.20',  value: '#ebf8ff', category: 'color', description: 'Selected state bg' },
  { name: 'blue.30',  value: '#e4f2ff', category: 'color', description: 'Hover bg, badge bg' },
  { name: 'blue.40',  value: '#bfddff', category: 'color' },
  { name: 'blue.50',  value: '#96c9ff', category: 'color' },
  { name: 'blue.60',  value: '#6eb3ff', category: 'color' },
  { name: 'blue.70',  value: '#55a2ff', category: 'color' },
  { name: 'blue.80',  value: '#4592ff', category: 'color' },
  { name: 'blue.90',  value: '#4484f0', category: 'color' },
  { name: 'blue.100', value: '#4172dc', category: 'color', description: 'Brand primary' },
  { name: 'blue.110', value: '#3e60c9', category: 'color', description: 'Brand hover' },
  { name: 'blue.120', value: '#3840a9', category: 'color', description: 'Brand active/pressed' },

  // Gray scale
  { name: 'gray.10',  value: '#fcfcfd', category: 'color' },
  { name: 'gray.20',  value: '#f9f9fb', category: 'color' },
  { name: 'gray.30',  value: '#f6f7f9', category: 'color' },
  { name: 'gray.40',  value: '#f2f4f7', category: 'color' },
  { name: 'gray.50',  value: '#e4e7ec', category: 'color', description: 'Default border/hairline' },
  { name: 'gray.60',  value: '#d0d5dd', category: 'color' },
  { name: 'gray.70',  value: '#98a2b3', category: 'color' },
  { name: 'gray.80',  value: '#667085', category: 'color', description: 'Secondary/label text' },
  { name: 'gray.90',  value: '#475467', category: 'color' },
  { name: 'gray.100', value: '#344054', category: 'color' },
  { name: 'gray.110', value: '#1d2939', category: 'color' },
  { name: 'gray.120', value: '#101828', category: 'color', description: 'Default text' },

  // Green scale
  { name: 'green.10',  value: '#f8fcfb', category: 'color', description: 'Success bg' },
  { name: 'green.20',  value: '#f1f9f7', category: 'color' },
  { name: 'green.30',  value: '#e0f1ec', category: 'color' },
  { name: 'green.40',  value: '#b3dbce', category: 'color' },
  { name: 'green.50',  value: '#84c5af', category: 'color' },
  { name: 'green.60',  value: '#58ae91', category: 'color' },
  { name: 'green.70',  value: '#45ac86', category: 'color', description: 'Success text/icon' },
  { name: 'green.80',  value: '#32aa7b', category: 'color' },
  { name: 'green.90',  value: '#2a8d66', category: 'color' },
  { name: 'green.100', value: '#216f51', category: 'color' },
  { name: 'green.110', value: '#1a5f44', category: 'color' },
  { name: 'green.120', value: '#11442c', category: 'color' },

  // Red scale
  { name: 'red.10',  value: '#fffafb', category: 'color' },
  { name: 'red.20',  value: '#fff0f2', category: 'color' },
  { name: 'red.30',  value: '#ffe0e4', category: 'color' },
  { name: 'red.40',  value: '#ffbec4', category: 'color' },
  { name: 'red.50',  value: '#f98d8c', category: 'color' },
  { name: 'red.60',  value: '#e36362', category: 'color' },
  { name: 'red.70',  value: '#ec423d', category: 'color', description: 'Error default' },
  { name: 'red.80',  value: '#ed2e20', category: 'color' },
  { name: 'red.90',  value: '#de2121', category: 'color' },
  { name: 'red.100', value: '#cc0a1b', category: 'color' },
  { name: 'red.110', value: '#c00114', category: 'color' },
  { name: 'red.120', value: '#b10005', category: 'color' },

  // Orange scale
  { name: 'orange.10',  value: '#fef5dd', category: 'color' },
  { name: 'orange.20',  value: '#fbe4ab', category: 'color' },
  { name: 'orange.30',  value: '#f8d374', category: 'color' },
  { name: 'orange.40',  value: '#f7c166', category: 'color' },
  { name: 'orange.50',  value: '#f6af58', category: 'color' },
  { name: 'orange.60',  value: '#f59c4a', category: 'color' },
  { name: 'orange.70',  value: '#f48a3c', category: 'color', description: 'Warning default' },
  { name: 'orange.80',  value: '#f3782e', category: 'color' },
  { name: 'orange.90',  value: '#e7722c', category: 'color' },
  { name: 'orange.100', value: '#db6c29', category: 'color' },
  { name: 'orange.110', value: '#c26025', category: 'color' },
  { name: 'orange.120', value: '#aa5420', category: 'color' },

  // Purple scale
  { name: 'purple.10',  value: '#f6f6ff', category: 'color' },
  { name: 'purple.20',  value: '#ebeaff', category: 'color', description: 'AI gradient start' },
  { name: 'purple.30',  value: '#dedcff', category: 'color' },
  { name: 'purple.40',  value: '#c3c0f1', category: 'color', description: 'AI card border' },
  { name: 'purple.50',  value: '#aba6e6', category: 'color' },
  { name: 'purple.60',  value: '#8883c9', category: 'color' },
  { name: 'purple.70',  value: '#746ec0', category: 'color' },
  { name: 'purple.80',  value: '#6059b7', category: 'color' },
  { name: 'purple.90',  value: '#4c45ae', category: 'color' },
  { name: 'purple.100', value: '#3830a5', category: 'color' },
  { name: 'purple.110', value: '#322b95', category: 'color' },
  { name: 'purple.120', value: '#2d2684', category: 'color' },

  // === SPACING ===
  { name: 'spacing-0',  value: '0px',  category: 'spacing' },
  { name: 'spacing-05', value: '2px',  category: 'spacing' },
  { name: 'spacing-1',  value: '4px',  category: 'spacing' },
  { name: 'spacing-2',  value: '8px',  category: 'spacing' },
  { name: 'spacing-3',  value: '12px', category: 'spacing' },
  { name: 'spacing-4',  value: '16px', category: 'spacing' },
  { name: 'spacing-5',  value: '20px', category: 'spacing' },
  { name: 'spacing-6',  value: '24px', category: 'spacing' },
  { name: 'spacing-7',  value: '28px', category: 'spacing' },
  { name: 'spacing-8',  value: '32px', category: 'spacing' },
  { name: 'spacing-9',  value: '36px', category: 'spacing' },
  { name: 'spacing-10', value: '40px', category: 'spacing' },
  { name: 'spacing-11', value: '48px', category: 'spacing' },

  // === BORDER RADIUS ===
  { name: 'radius-1',     value: '4px',   category: 'radius' },
  { name: 'radius-2',     value: '8px',   category: 'radius' },
  { name: 'radius-3',     value: '12px',  category: 'radius' },
  { name: 'radius-4',     value: '16px',  category: 'radius' },
  { name: 'radius-round', value: '999px', category: 'radius' },

  // === TYPOGRAPHY ===
  { name: 'text-1', value: '8px / 10px',  category: 'typography' },
  { name: 'text-2', value: '12px / 16px', category: 'typography', description: 'Micro — badge counters only' },
  { name: 'text-3', value: '14px / 20px', category: 'typography', description: 'Body text (accessibility floor)' },
  { name: 'text-4', value: '16px / 24px', category: 'typography', description: 'Card titles' },
  { name: 'text-5', value: '18px / 24px', category: 'typography' },
  { name: 'text-6', value: '20px / 24px', category: 'typography', description: 'Section headers' },
  { name: 'text-7', value: '24px / 32px', category: 'typography' },
  { name: 'text-8', value: '32px / 40px', category: 'typography' },
  { name: 'text-9', value: '60px / 60px', category: 'typography' },

  // === SHADOWS ===
  { name: 'shadow-sm', value: '0 1px 1px -0.5px rgba(0,0,0,0.07), 0 2px 2px -1px rgba(0,0,0,0.07), 0 3px 3px -1.5px rgba(0,0,0,0.07)', category: 'shadow' },
  { name: 'shadow-md', value: '0 2px 2px -1px rgba(0,0,0,0.07), 0 2px 2px -1px rgba(0,0,0,0.07), 0 6px 6px -3px rgba(0,0,0,0.07)',     category: 'shadow' },
  { name: 'shadow-lg', value: '0 8px 8px -4px rgba(0,0,0,0.07), 0 0 2px 1px rgba(0,0,0,0.06), 0 10px 36px 0 rgba(0,0,0,0.16)',         category: 'shadow' },
];

export function findTokenByValue(value: string, category?: TokenCategory): Token | null {
  const v = value.toLowerCase();
  return TOKENS.find(t =>
    t.value.toLowerCase() === v && (!category || t.category === category)
  ) || null;
}

export function findNearestColorToken(hex: string): { token: Token; distance: number } | null {
  const target = hexToRgb(hex);
  if (!target) return null;

  let nearest: Token | null = null;
  let minDist = Infinity;

  TOKENS.filter(t => t.category === 'color').forEach(token => {
    const rgb = hexToRgb(token.value);
    if (!rgb) return;
    const dist = Math.sqrt(
      Math.pow(target.r - rgb.r, 2) +
      Math.pow(target.g - rgb.g, 2) +
      Math.pow(target.b - rgb.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = token;
    }
  });

  return nearest ? { token: nearest, distance: minDist } : null;
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
