// ── Real Geeks Design System Token Data ──

export const colorScales = {
  blue: {
    10: '#f0f3fb', 20: '#d9e0f4', 30: '#b3c1e9', 40: '#8da2de',
    50: '#6783d3', 60: '#4f6ec9', 70: '#4564c4', 80: '#3e5cb8',
    90: '#3752a8', 100: '#2f4898', 110: '#3e60c9', 120: '#1a2f6b',
  },
  gray: {
    10: '#f8f8f8', 20: '#f0f0f0', 30: '#e8e8e8', 40: '#d8d8d8',
    50: '#c0c0c0', 60: '#a0a0a0', 70: '#888888', 80: '#707070',
    90: '#585858', 100: '#404040', 110: '#303030', 120: '#1a1a1a',
  },
  green: {
    10: '#f0faf0', 20: '#d4f0d4', 30: '#b0e0b0', 40: '#80cc80',
    50: '#5cb85c', 60: '#4cae4c', 70: '#42a042', 80: '#389438',
    90: '#2d7a2d', 100: '#256b25', 110: '#1a5c1a', 120: '#0f3d0f',
  },
  red: {
    10: '#fef0f0', 20: '#fcd4d4', 30: '#f8a8a8', 40: '#f47c7c',
    50: '#ef5050', 60: '#e04040', 70: '#d43030', 80: '#c42020',
    90: '#a81818', 100: '#8c1010', 110: '#700a0a', 120: '#500505',
  },
  orange: {
    10: '#fef5dd', 20: '#fde8b0', 30: '#fcd883', 40: '#fbc856',
    50: '#fab829', 60: '#e5a520', 70: '#cc9318', 80: '#b38010',
    90: '#996e0a', 100: '#805c05', 110: '#664a03', 120: '#4d3802',
  },
  purple: {
    10: '#f5f0ff', 20: '#e4d9fc', 30: '#d3c0f9', 40: '#bfa3f5',
    50: '#a886f0', 60: '#9470e0', 70: '#7f5bcc', 80: '#6b47b8',
    90: '#5733a4', 100: '#462090', 110: '#36107c', 120: '#260060',
  },
  ink: {
    white: '#ffffff',
    black: '#000000',
  },
} as const;

export const semanticAliases = {
  Background: [
    { name: 'bg-app', value: '#fef5dd', resolvedFrom: 'orange.10', usage: 'Outer page shell background' },
    { name: 'bg-canvas', value: '#ffffff', resolvedFrom: 'ink.white', usage: 'Card & content surfaces' },
    { name: 'bg-muted', value: '#f8f8f8', resolvedFrom: 'gray.10', usage: 'Subdued input backgrounds' },
  ],
  Text: [
    { name: 'text-default', value: '#1a1a1a', resolvedFrom: 'gray.120', usage: 'Primary body text' },
    { name: 'text-secondary', value: '#585858', resolvedFrom: 'gray.90', usage: 'Supplementary text' },
    { name: 'text-muted', value: '#a0a0a0', resolvedFrom: 'gray.60', usage: 'Placeholder & disabled text' },
    { name: 'text-link', value: '#3e60c9', resolvedFrom: 'blue.110', usage: 'Interactive link text' },
  ],
  Brand: [
    { name: 'brand-primary', value: '#3e60c9', resolvedFrom: 'blue.110', usage: 'Primary action, CTA' },
    { name: 'brand-primary-hover', value: '#3752a8', resolvedFrom: 'blue.90', usage: 'Hover state of primary actions' },
    { name: 'icon-default', value: '#303030', resolvedFrom: 'gray.110', usage: 'Default icon color' },
    { name: 'border-default', value: '#c0c0c0', resolvedFrom: 'gray.50', usage: 'Borders & dividers' },
  ],
  Status: [
    { name: 'success-bg', value: '#b0e0b0', resolvedFrom: 'green.30', usage: 'Success background' },
    { name: 'success-border', value: '#80cc80', resolvedFrom: 'green.40', usage: 'Success border' },
    { name: 'success-text', value: '#2d7a2d', resolvedFrom: 'green.90', usage: 'Success text' },
    { name: 'error-bg', value: '#fcd4d4', resolvedFrom: 'red.20', usage: 'Error background' },
    { name: 'error-border', value: '#f47c7c', resolvedFrom: 'red.40', usage: 'Error border' },
    { name: 'error-text', value: '#a81818', resolvedFrom: 'red.90', usage: 'Error text' },
    { name: 'warning-bg', value: '#fef5dd', resolvedFrom: 'orange.10', usage: 'Warning background' },
    { name: 'warning-border', value: '#fde8b0', resolvedFrom: 'orange.20', usage: 'Warning border' },
    { name: 'warning-text', value: '#996e0a', resolvedFrom: 'orange.90', usage: 'Warning text' },
  ],
  Tag: [
    { name: 'tag-bg', value: '#d3c0f9', resolvedFrom: 'purple.30', usage: 'Tag background fill' },
    { name: 'tag-text', value: '#36107c', resolvedFrom: 'purple.110', usage: 'Tag label text' },
  ],
} as const;

export const typeRamp = [
  { step: 'text-1', size: '10px', lineHeight: '14px', label: 'Text 1' },
  { step: 'text-2', size: '12px', lineHeight: '16px', label: 'Text 2' },
  { step: 'text-3', size: '14px', lineHeight: '20px', label: 'Text 3' },
  { step: 'text-4', size: '16px', lineHeight: '24px', label: 'Text 4' },
  { step: 'text-5', size: '18px', lineHeight: '26px', label: 'Text 5' },
  { step: 'text-6', size: '20px', lineHeight: '28px', label: 'Text 6' },
  { step: 'text-7', size: '24px', lineHeight: '32px', label: 'Text 7' },
  { step: 'text-8', size: '32px', lineHeight: '40px', label: 'Text 8' },
  { step: 'text-9', size: '40px', lineHeight: '48px', label: 'Text 9' },
] as const;

export const spacingTokens = [
  { key: 'spacing-1', px: 4 },
  { key: 'spacing-2', px: 8 },
  { key: 'spacing-3', px: 12 },
  { key: 'spacing-4', px: 16 },
  { key: 'spacing-5', px: 20 },
  { key: 'spacing-6', px: 24 },
  { key: 'spacing-7', px: 28 },
  { key: 'spacing-8', px: 32 },
  { key: 'spacing-9', px: 36 },
  { key: 'spacing-10', px: 40 },
] as const;

export const sizingTokens = [
  { key: 'sizing-1', px: 4 },
  { key: 'sizing-2', px: 8 },
  { key: 'sizing-3', px: 12 },
  { key: 'sizing-4', px: 16 },
  { key: 'sizing-5', px: 20 },
  { key: 'sizing-6', px: 24 },
  { key: 'sizing-7', px: 28 },
  { key: 'sizing-8', px: 32 },
  { key: 'sizing-9', px: 36 },
  { key: 'sizing-10', px: 40 },
  { key: 'sizing-11', px: 44 },
  { key: 'sizing-12', px: 48 },
  { key: 'sizing-13', px: 52 },
  { key: 'sizing-14', px: 56 },
] as const;

export const radiusTokens = [
  { key: 'rounded-1', value: '4px', label: '1' },
  { key: 'rounded-2', value: '8px', label: '2' },
  { key: 'rounded-3', value: '12px', label: '3' },
  { key: 'rounded-4', value: '16px', label: '4' },
  { key: 'rounded-round', value: '9999px', label: 'round' },
] as const;

export const shadowTokens = [
  { key: 'shadow-sm', label: 'shadow-sm', description: 'Subtle elevation for chips and chips' },
  { key: 'shadow-md', label: 'shadow-md', description: 'Default card elevation' },
  { key: 'shadow-lg', label: 'shadow-lg', description: 'Modal & tooltip overlay' },
] as const;

export const navLinks = [
  { label: 'Colors', href: '#colors' },
  { label: 'Typography', href: '#typography' },
  { label: 'Aliases', href: '#aliases' },
  { label: 'Spacing', href: '#spacing' },
  { label: 'Radius', href: '#radius' },
  { label: 'Shadows', href: '#shadows' },
  { label: 'Components', href: '#components' },
] as const;
