import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(null), 2000);
    }
  }, []);

  return { copy, copiedValue };
}
