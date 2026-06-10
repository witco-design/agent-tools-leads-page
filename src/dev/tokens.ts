// src/dev/tokens.ts
// Centralized registry of all design tokens used in the project.
// Source of truth for the Token Panel and engineer handoff tooling.

export type TokenCategory = 'color' | 'spacing' | 'radius' | 'typography' | 'shadow';

export interface Token {
  name: string;          // e.g., "blue.110" or "spacing-4"
  value: string;         // e.g., "#3e60c9" or "16px"
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
  { name: 'blue.50',  value: '#849ee3', category: 'color' },
  { name: 'blue.60',  value: '#6781d9', category: 'color' },
  { name: 'blue.70',  value: '#4e68cc', category: 'color' },
  { name: 'blue.80',  value: '#3e60c9', category: 'color' },
  { name: 'blue.90',  value: '#3840a9', category: 'color' },
  { name: 'blue.100', value: '#3a4daa', category: 'color' },
  { name: 'blue.110', value: '#3e60c9', category: 'color', description: 'Brand primary' },
  { name: 'blue.120', value: '#3840a9', category: 'color', description: 'Brand hover' },

  // Gray scale
  { name: 'gray.10',  value: '#f9fafb', category: 'color' },
  { name: 'gray.20',  value: '#f2f4f7', category: 'color' },
  { name: 'gray.30',  value: '#eaecf0', category: 'color' },
  { name: 'gray.40',  value: '#d0d5dd', category: 'color' },
  { name: 'gray.50',  value: '#e4e7ec', category: 'color', description: 'Default border/hairline' },
  { name: 'gray.60',  value: '#98a2b3', category: 'color' },
  { name: 'gray.70',  value: '#667085', category: 'color', description: 'Secondary/label text' },
  { name: 'gray.80',  value: '#475467', category: 'color' },
  { name: 'gray.90',  value: '#344054', category: 'color' },
  { name: 'gray.100', value: '#1d2939', category: 'color' },
  { name: 'gray.110', value: '#101828', category: 'color', description: 'Default text' },
  { name: 'gray.120', value: '#0c111d', category: 'color' },

  // Green scale (sage)
  { name: 'green.10',  value: '#e0f1ec', category: 'color', description: 'Success bg' },
  { name: 'green.20',  value: '#dcfae6', category: 'color' },
  { name: 'green.30',  value: '#e0f1ec', category: 'color', description: 'Live tag bg, positive icon bg' },
  { name: 'green.40',  value: '#6ce9a6', category: 'color' },
  { name: 'green.50',  value: '#32d583', category: 'color' },
  { name: 'green.60',  value: '#12b76a', category: 'color' },
  { name: 'green.70',  value: '#45ac86', category: 'color', description: 'Success text/icon' },
  { name: 'green.80',  value: '#027a48', category: 'color' },
  { name: 'green.90',  value: '#05603a', category: 'color' },
  { name: 'green.100', value: '#216f51', category: 'color', description: 'Icon-on-bg accessible' },
  { name: 'green.110', value: '#053321', category: 'color' },
  { name: 'green.120', value: '#022a1a', category: 'color' },

  // Red scale
  { name: 'red.10',  value: '#fef3f2', category: 'color' },
  { name: 'red.20',  value: '#fee4e2', category: 'color' },
  { name: 'red.30',  value: '#ffe0e4', category: 'color' },
  { name: 'red.40',  value: '#fda29b', category: 'color' },
  { name: 'red.50',  value: '#f97066', category: 'color' },
  { name: 'red.60',  value: '#f04438', category: 'color' },
  { name: 'red.70',  value: '#ec423d', category: 'color', description: 'Error default' },
  { name: 'red.80',  value: '#b42318', category: 'color' },
  { name: 'red.90',  value: '#912018', category: 'color' },
  { name: 'red.100', value: '#7a271a', category: 'color' },
  { name: 'red.110', value: '#55160c', category: 'color' },
  { name: 'red.120', value: '#3b0b05', category: 'color' },

  // Orange scale
  { name: 'orange.10',  value: '#fef6ee', category: 'color' },
  { name: 'orange.20',  value: '#fbe4ab', category: 'color' },
  { name: 'orange.30',  value: '#f9dbaf', category: 'color' },
  { name: 'orange.40',  value: '#f7b27a', category: 'color' },
  { name: 'orange.50',  value: '#f38744', category: 'color' },
  { name: 'orange.60',  value: '#ef6820', category: 'color' },
  { name: 'orange.70',  value: '#f48a3c', category: 'color', description: 'Warning default' },
  { name: 'orange.80',  value: '#b93815', category: 'color' },
  { name: 'orange.90',  value: '#932f19', category: 'color' },
  { name: 'orange.100', value: '#7e2410', category: 'color' },
  { name: 'orange.110', value: '#c26025', category: 'color', description: 'Icon-on-bg accessible' },
  { name: 'orange.120', value: '#3d1106', category: 'color' },

  // Purple scale
  { name: 'purple.10',  value: '#ebeaff', category: 'color', description: 'AI gradient start' },
  { name: 'purple.20',  value: '#d9d6fe', category: 'color' },
  { name: 'purple.30',  value: '#c3c0f1', category: 'color', description: 'AI card border' },
  { name: 'purple.40',  value: '#a4a0f5', category: 'color' },
  { name: 'purple.50',  value: '#8580eb', category: 'color' },
  { name: 'purple.60',  value: '#6a65d8', category: 'color' },
  { name: 'purple.70',  value: '#746ec0', category: 'color', description: 'Purple.70' },
  { name: 'purple.80',  value: '#4f4dab', category: 'color' },
  { name: 'purple.90',  value: '#3e3d87', category: 'color' },
  { name: 'purple.100', value: '#2f2e67', category: 'color' },
  { name: 'purple.110', value: '#23234b', category: 'color' },
  { name: 'purple.120', value: '#171733', category: 'color' },

  // === SPACING ===
  { name: 'spacing-0',  value: '0px',  category: 'spacing' },
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
  { name: 'radius-1',     value: '4px',    category: 'radius' },
  { name: 'radius-2',     value: '8px',    category: 'radius' },
  { name: 'radius-3',     value: '12px',   category: 'radius' },
  { name: 'radius-4',     value: '16px',   category: 'radius' },
  { name: 'radius-round', value: '9999px', category: 'radius' },

  // === TYPOGRAPHY ===
  { name: 'text-1', value: '8px / 12px',  category: 'typography', description: 'Tiny — not used in UI' },
  { name: 'text-2', value: '10px / 14px', category: 'typography', description: 'Micro — badge counters only' },
  { name: 'text-3', value: '12px / 16px', category: 'typography', description: 'Small badges only (decorative)' },
  { name: 'text-4', value: '14px / 20px', category: 'typography', description: 'Body text (accessibility floor)' },
  { name: 'text-5', value: '16px / 24px', category: 'typography', description: 'Card titles' },
  { name: 'text-6', value: '20px / 28px', category: 'typography', description: 'Section headers' },
  { name: 'text-7', value: '24px / 32px', category: 'typography' },
  { name: 'text-8', value: '32px / 40px', category: 'typography' },
  { name: 'text-9', value: '60px / 72px', category: 'typography' },

  // === SHADOWS ===
  { name: 'shadow-sm', value: '0 1px 2px 0 rgba(16,24,40,0.05)',                                            category: 'shadow' },
  { name: 'shadow-md', value: '0 4px 8px -2px rgba(16,24,40,0.10), 0 2px 4px -2px rgba(16,24,40,0.06)',     category: 'shadow' },
  { name: 'shadow-lg', value: '0 12px 16px -4px rgba(16,24,40,0.08), 0 4px 6px -2px rgba(16,24,40,0.03)',   category: 'shadow' },
];

// Helper: find token by value
export function findTokenByValue(value: string, category?: TokenCategory): Token | null {
  const v = value.toLowerCase();
  return TOKENS.find(t =>
    t.value.toLowerCase() === v && (!category || t.category === category)
  ) || null;
}

// Helper: find nearest color token for an arbitrary hex
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
