import { useState } from 'react';
import { Code2 } from 'lucide-react';
import { TokenPanel } from './TokenPanel';

export function DevModeToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button — bottom-left, outside sidebar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open developer tools"
        className="fixed bottom-4 left-[240px] z-50 h-10 w-10 inline-flex items-center justify-center bg-[#101828] text-white rounded-full shadow-lg hover:bg-[#1d2939] transition cursor-pointer"
      >
        <Code2 className="w-5 h-5" />
      </button>

      {/* Slide-out panel */}
      <TokenPanel open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
