// ── Real Geeks Design System Token Data ──

export const colorScales = {
  blue: {
    10: '#f5fcff', 20: '#ebf8ff', 30: '#e4f2ff', 40: '#bfddff',
    50: '#96c9ff', 60: '#6eb3ff', 70: '#55a2ff', 80: '#4592ff',
    90: '#4484f0', 100: '#4172dc', 110: '#3e60c9', 120: '#3840a9',
  },
  gray: {
    10: '#fcfcfd', 20: '#f9f9fb', 30: '#f6f7f9', 40: '#f2f4f7',
    50: '#e4e7ec', 60: '#d0d5dd', 70: '#98a2b3', 80: '#667085',
    90: '#475467', 100: '#344054', 110: '#1d2939', 120: '#101828',
  },
  green: {
    10: '#f8fcfb', 20: '#f1f9f7', 30: '#e0f1ec', 40: '#b3dbce',
    50: '#84c5af', 60: '#58ae91', 70: '#45ac86', 80: '#32aa7b',
    90: '#2a8d66', 100: '#216f51', 110: '#1a5f44', 120: '#11442c',
  },
  red: {
    10: '#fffafb', 20: '#fff0f2', 30: '#ffe0e4', 40: '#ffbec4',
    50: '#f98d8c', 60: '#e36362', 70: '#ec423d', 80: '#ed2e20',
    90: '#de2121', 100: '#cc0a1b', 110: '#c00114', 120: '#b10005',
  },
  orange: {
    10: '#fef5dd', 20: '#fbe4ab', 30: '#f8d374', 40: '#f7c166',
    50: '#f6af58', 60: '#f59c4a', 70: '#f48a3c', 80: '#f3782e',
    90: '#e7722c', 100: '#db6c29', 110: '#c26025', 120: '#aa5420',
  },
  purple: {
    10: '#f6f6ff', 20: '#ebeaff', 30: '#dedcff', 40: '#c3c0f1',
    50: '#aba6e6', 60: '#8883c9', 70: '#746ec0', 80: '#6059b7',
    90: '#4c45ae', 100: '#3830a5', 110: '#322b95', 120: '#2d2684',
  },
  ink: {
    white: '#ffffff',
    black: '#0d0d0d',
  },
} as const;

export const semanticAliases = {
  Background: [
    { name: 'bg-app', value: '#f5fcff', resolvedFrom: 'blue.10', usage: 'Outer page shell background' },
    { name: 'bg-card', value: '#ffffff', resolvedFrom: 'ink.white', usage: 'Card & content surfaces' },
    { name: 'bg-canvas', value: '#ffffff', resolvedFrom: 'ink.white', usage: 'Alias for bg-card' },
    { name: 'bg-muted', value: '#fcfcfd', resolvedFrom: 'gray.10', usage: 'Subdued input backgrounds' },
    { name: 'bg-default', value: '#ffffff', resolvedFrom: 'ink.white', usage: 'Default light background' },
  ],
  Text: [
    { name: 'text-default', value: '#101828', resolvedFrom: 'gray.120', usage: 'Primary body text' },
    { name: 'text-secondary', value: '#475467', resolvedFrom: 'gray.90', usage: 'Supplementary text' },
    { name: 'text-muted', value: '#667085', resolvedFrom: 'gray.80', usage: 'Placeholder & disabled text' },
    { name: 'text-link', value: '#4172dc', resolvedFrom: 'blue.100', usage: 'Interactive link text' },
    { name: 'text-link-hover', value: '#3e60c9', resolvedFrom: 'blue.110', usage: 'Hover/pressed link text' },
  ],
  Brand: [
    { name: 'brand-primary', value: '#4172dc', resolvedFrom: 'blue.100', usage: 'Primary action, CTA' },
    { name: 'brand-primary-hover', value: '#3e60c9', resolvedFrom: 'blue.110', usage: 'Hover state of primary actions' },
    { name: 'icon-default', value: '#1d2939', resolvedFrom: 'gray.110', usage: 'Default icon color' },
    { name: 'border-default', value: '#e4e7ec', resolvedFrom: 'gray.50', usage: 'Borders & dividers' },
    { name: 'border-strong', value: '#d0d5dd', resolvedFrom: 'gray.60', usage: 'Heavier emphasis borders' },
    { name: 'border-focus', value: '#4172dc', resolvedFrom: 'blue.100', usage: 'Focused input border' },
  ],
  Status: [
    { name: 'success-bg', value: '#f8fcfb', resolvedFrom: 'green.10', usage: 'Success background' },
    { name: 'success-border', value: '#b3dbce', resolvedFrom: 'green.40', usage: 'Success border' },
    { name: 'success-text', value: '#45ac86', resolvedFrom: 'green.70', usage: 'Success text' },
    { name: 'error-bg', value: '#fffafb', resolvedFrom: 'red.10', usage: 'Error background' },
    { name: 'error-border', value: '#ffbec4', resolvedFrom: 'red.40', usage: 'Error border' },
    { name: 'error-text', value: '#ec423d', resolvedFrom: 'red.70', usage: 'Error text' },
    { name: 'warning-bg', value: '#fef5dd', resolvedFrom: 'orange.10', usage: 'Warning background' },
    { name: 'warning-border', value: '#fbe4ab', resolvedFrom: 'orange.20', usage: 'Warning border' },
    { name: 'warning-text', value: '#f48a3c', resolvedFrom: 'orange.70', usage: 'Warning text' },
    { name: 'info-bg', value: '#f5fcff', resolvedFrom: 'blue.10', usage: 'Info background' },
    { name: 'info-text', value: '#4172dc', resolvedFrom: 'blue.100', usage: 'Info text' },
  ],
  Tag: [
    { name: 'tag-bg', value: '#dedcff', resolvedFrom: 'purple.30', usage: 'Tag background fill' },
    { name: 'tag-text', value: '#322b95', resolvedFrom: 'purple.110', usage: 'Tag label text' },
  ],
  Disabled: [
    { name: 'disabled-content', value: '#98a2b3', resolvedFrom: 'gray.70', usage: 'Disabled text/icon' },
    { name: 'disabled-bg', value: '#f2f4f7', resolvedFrom: 'gray.40', usage: 'Disabled element background' },
  ],
} as const;

export const typeRamp = [
  { step: 'text-1', size: '8px',  lineHeight: '10px', label: 'Text 1' },
  { step: 'text-2', size: '12px', lineHeight: '16px', label: 'Text 2' },
  { step: 'text-3', size: '14px', lineHeight: '20px', label: 'Text 3' },
  { step: 'text-4', size: '16px', lineHeight: '24px', label: 'Text 4' },
  { step: 'text-5', size: '18px', lineHeight: '24px', label: 'Text 5' },
  { step: 'text-6', size: '20px', lineHeight: '24px', label: 'Text 6' },
  { step: 'text-7', size: '24px', lineHeight: '32px', label: 'Text 7' },
  { step: 'text-8', size: '32px', lineHeight: '40px', label: 'Text 8' },
  { step: 'text-9', size: '60px', lineHeight: '60px', label: 'Text 9' },
] as const;

export const spacingTokens = [
  { key: 'spacing-0',  px: 0 },
  { key: 'spacing-05', px: 2 },
  { key: 'spacing-1',  px: 4 },
  { key: 'spacing-2',  px: 8 },
  { key: 'spacing-3',  px: 12 },
  { key: 'spacing-4',  px: 16 },
  { key: 'spacing-5',  px: 20 },
  { key: 'spacing-6',  px: 24 },
  { key: 'spacing-7',  px: 28 },
  { key: 'spacing-8',  px: 32 },
  { key: 'spacing-9',  px: 36 },
  { key: 'spacing-10', px: 40 },
  { key: 'spacing-11', px: 48 },
] as const;

export const sizingTokens = [
  { key: 'sizing-0',  px: 0 },
  { key: 'sizing-1',  px: 4 },
  { key: 'sizing-2',  px: 8 },
  { key: 'sizing-3',  px: 12 },
  { key: 'sizing-4',  px: 16 },
  { key: 'sizing-5',  px: 20 },
  { key: 'sizing-6',  px: 24 },
  { key: 'sizing-7',  px: 28 },
  { key: 'sizing-8',  px: 32 },
  { key: 'sizing-9',  px: 36 },
  { key: 'sizing-10', px: 40 },
  { key: 'sizing-11', px: 44 },
  { key: 'sizing-12', px: 48 },
  { key: 'sizing-13', px: 52 },
  { key: 'sizing-14', px: 56 },
  { key: 'sizing-15', px: 60 },
] as const;

export const radiusTokens = [
  { key: 'rounded-1',     value: '4px',   label: '1' },
  { key: 'rounded-2',     value: '8px',   label: '2' },
  { key: 'rounded-3',     value: '12px',  label: '3' },
  { key: 'rounded-4',     value: '16px',  label: '4' },
  { key: 'rounded-round', value: '999px', label: 'round' },
] as const;

export const shadowTokens = [
  { key: 'shadow-sm', label: 'shadow-sm', description: 'Subtle elevation for chips and badges' },
  { key: 'shadow-md', label: 'shadow-md', description: 'Default card elevation' },
  { key: 'shadow-lg', label: 'shadow-lg', description: 'Modal & tooltip overlay' },
  { key: 'shadow-button-press', label: 'shadow-button-press', description: 'Primary button :active / focus ring' },
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
